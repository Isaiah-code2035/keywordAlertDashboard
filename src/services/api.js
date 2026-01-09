import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Authorization': import.meta.env.VITE_API_KEY,
    'Content-Type': 'application/json'
  }
})

// Rate limiting: max 10 requests per second
let requestQueue = []
let requestCount = 0
const MAX_REQUESTS_PER_SECOND = 10
const RATE_LIMIT_WINDOW = 1000 // 1 second in ms

setInterval(() => {
  requestCount = 0
}, RATE_LIMIT_WINDOW)

const rateLimitedRequest = async (requestFn) => {
  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      if (requestCount < MAX_REQUESTS_PER_SECOND) {
        requestCount++
        try {
          const result = await requestFn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      } else {
        setTimeout(executeRequest, 100)
      }
    }
    executeRequest()
  })
}

// Get all tracked campaigns
export const getCampaigns = async () => {
  return rateLimitedRequest(async () => {
    let allCampaigns = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await apiClient.get('/dashboard/v3.0/campaigns/tracked', {
        params: {
          limit: 100,
          offset: (page - 1) * 100
        }
      })

      console.log(`Page ${page} response:`, response)
      console.log(`Page ${page} data (${response.data?.length || 0} campaigns):`, response.data)

      const campaigns = response.data

      if (campaigns && campaigns.length > 0) {
        allCampaigns = allCampaigns.concat(campaigns)

        // Check if there are more pages
        // If we got less than 100, we're done
        if (campaigns.length < 100) {
          hasMore = false
        } else {
          page++
        }
      } else {
        hasMore = false
      }
    }

    console.log(`Total campaigns fetched: ${allCampaigns.length}`)
    return allCampaigns
  })
}

// Get daily keyword ranks for a campaign
export const getKeywordRanks = async (campaignId, startDate, endDate) => {
  return rateLimitedRequest(async () => {
    console.log('Fetching keywords with params:', { campaignId, startDate, endDate })

    const response = await apiClient.get(`/rank-tracker/v3.0/keywords`, {
      params: {
        campaign_id: campaignId,
        start_date: startDate,
        end_date: endDate
      }
    })
    console.log('Keyword ranks response:', response.data)
    return response.data
  })
}

export default apiClient
