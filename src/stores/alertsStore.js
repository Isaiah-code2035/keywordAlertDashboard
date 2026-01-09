import { defineStore } from 'pinia'
import { getCampaigns, getKeywordRanks } from '../services/api'
import { sendAlertNotification, sendSummaryNotification } from '../services/notifications'

export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    campaigns: [],
    selectedCampaign: null,
    keywordRanks: [],
    dateRange: {
      startDate: getDefaultStartDate(),
      endDate: getDefaultEndDate()
    },
    threshold: 5,
    loading: false,
    error: null,
    campaignsCache: null,
    browserNotificationsEnabled: false
  }),

  getters: {
    // Get campaigns with keyword change counts
    campaignsWithAlerts: (state) => {
      if (!state.campaigns || state.campaigns.length === 0) return []

      return state.campaigns.map(campaign => {
        // Handle both API response formats
        const campaignId = campaign.campaign_info?.id || campaign.id || campaign.campaign_id
        const keywords = state.keywordRanks[campaignId] || []
        const drops = keywords.filter(k => k.change < -Math.abs(state.threshold)).length
        const gains = keywords.filter(k => k.change >= state.threshold).length

        return {
          ...campaign,
          campaign_id: campaignId,
          campaign_name: campaign.campaign_info?.name || campaign.name || campaign.campaign_name,
          domain: campaign.campaign_info?.domain || campaign.domain,
          drops,
          gains
        }
      })
    },

    // Get filtered keywords for selected campaign
    filteredKeywords: (state) => (filter = 'all') => {
      if (!state.selectedCampaign) return []

      const keywords = state.keywordRanks[state.selectedCampaign.campaign_id] || []

      if (filter === 'drops') {
        return keywords.filter(k => k.change < -Math.abs(state.threshold))
      } else if (filter === 'gains') {
        return keywords.filter(k => k.change >= state.threshold)
      } else if (filter === 'all') {
        return keywords.filter(k => Math.abs(k.change) >= state.threshold)
      }

      return keywords
    }
  },

  actions: {
    async fetchCampaigns() {
      // Use cached data if available
      if (this.campaignsCache) {
        this.campaigns = this.campaignsCache
        return
      }

      this.loading = true
      this.error = null

      try {
        const data = await getCampaigns()
        console.log('API Response for campaigns:', data)
        console.log('First campaign structure:', data[0])
        this.campaigns = data
        this.campaignsCache = data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch campaigns'
        console.error('Error fetching campaigns:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchKeywordRanks(campaignId) {
      console.log('Fetching keyword ranks for campaign ID:', campaignId)
      this.loading = true
      this.error = null

      try {
        const data = await getKeywordRanks(
          campaignId,
          this.dateRange.startDate,
          this.dateRange.endDate
        )

        // Process keyword data to calculate changes
        const processedKeywords = processKeywordData(data, this.dateRange.startDate, this.dateRange.endDate)

        console.log('Processed keywords for campaign', campaignId, ':', processedKeywords)
        this.keywordRanks[campaignId] = processedKeywords
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch keyword ranks'
        console.error('Error fetching keyword ranks:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchAllKeywordRanks() {
      this.loading = true
      this.error = null

      try {
        // Fetch keyword ranks for all campaigns
        console.log('Fetching keyword ranks for all campaigns:', this.campaigns)
        const promises = this.campaigns.map(campaign => {
          console.log('Campaign object:', campaign)
          const campaignId = campaign.campaign_info?.id || campaign.id || campaign.campaign_id
          console.log('Using campaign ID:', campaignId)
          return this.fetchKeywordRanks(campaignId)
        })

        await Promise.all(promises)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch keyword ranks'
        console.error('Error fetching all keyword ranks:', err)
      } finally {
        this.loading = false
      }
    },

    setDateRange(startDate, endDate) {
      this.dateRange = { startDate, endDate }
    },

    setThreshold(threshold) {
      this.threshold = threshold
    },

    setSelectedCampaign(campaign) {
      this.selectedCampaign = campaign
    },

    clearError() {
      this.error = null
    },

    setNotificationEmail(email, enabled) {
      this.notificationEmail = email
      this.emailNotificationsEnabled = enabled
    },

    async checkAndSendNotifications() {
      const campaigns = this.campaignsWithAlerts

      // Send individual campaign alerts
      for (const campaign of campaigns) {
        if (campaign.drops > 0 || campaign.gains > 0) {
          await sendAlertNotification({
            campaignName: campaign.campaign_name || campaign.name || 'Unknown Campaign',
            drops: campaign.drops,
            gains: campaign.gains,
            threshold: this.threshold,
            userEmail: this.emailNotificationsEnabled ? this.notificationEmail : null
          })
        }
      }

      // Send summary notification
      const totalDrops = campaigns.reduce((sum, c) => sum + c.drops, 0)
      const totalGains = campaigns.reduce((sum, c) => sum + c.gains, 0)

      if (totalDrops > 0 || totalGains > 0) {
        await sendSummaryNotification({
          totalCampaigns: campaigns.length,
          totalDrops,
          totalGains,
          threshold: this.threshold,
          userEmail: this.emailNotificationsEnabled ? this.notificationEmail : null,
          campaignsWithAlerts: campaigns
        })
      }
    }
  }
})

// Helper function to get default start date (7 days ago)
function getDefaultStartDate() {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString().split('T')[0]
}

// Helper function to get default end date (today)
function getDefaultEndDate() {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

// Helper function to process keyword data and calculate changes
function processKeywordData(data, startDate, endDate) {
  if (!data || !Array.isArray(data)) return []

  return data.map(keyword => {
    // Get desktop ranking data (prioritize desktop, fallback to mobile)
    const rankingData = keyword.ranking_data?.desktop || keyword.ranking_data?.mobile || {}

    // Current rank and trend
    const currentRank = rankingData.rank || null
    const trend = rankingData.trend || 0

    // Calculate previous rank from current rank and trend
    // If trend is -3, rank dropped by 3 (went from 1 to 4), so previousRank = 4 - (-3) = 1
    const previousRank = currentRank !== null ? currentRank - trend : null

    // Calculate change (positive = gain/improvement, negative = drop/worse)
    const change = previousRank !== null && currentRank !== null ? previousRank - currentRank : 0

    // Get search volume
    const searchVolume = keyword.search_data?.search_volume || 0

    return {
      keyword: keyword.keyword || 'N/A',
      previousRank,
      currentRank,
      change,
      searchVolume,
      trend,
      keyword_id: keyword.keyword_id,
      ...keyword
    }
  }).filter(k => k.currentRank !== null && k.currentRank > 0 && k.currentRank <= 100)
}
