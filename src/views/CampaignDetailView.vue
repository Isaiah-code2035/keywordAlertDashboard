<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </button>

      <!-- Campaign Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6" v-if="campaign">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ campaign.campaign_name || campaign.name || 'Campaign Details' }}
        </h1>
        <p class="text-gray-600">{{ campaign.domain || campaign.url || 'No domain' }}</p>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-4 mt-6">
          <div class="bg-red-50 rounded-lg p-4">
            <p class="text-sm text-gray-600">Ranking Drops</p>
            <p class="text-3xl font-bold text-drop-red">{{ campaign.drops || 0 }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <p class="text-sm text-gray-600">Ranking Gains</p>
            <p class="text-3xl font-bold text-gain-green">{{ campaign.gains || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="store.error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between"
      >
        <span>{{ store.error }}</span>
        <button
          @click="store.clearError"
          class="text-red-700 hover:text-red-900"
        >
          ×
        </button>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="store.loading" />

      <!-- Keywords Section -->
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <!-- Tab Filter -->
        <TabFilter v-model="activeFilter" />

        <!-- Keyword Table -->
        <KeywordTable :keywords="displayedKeywords" />

        <!-- Empty State -->
        <div
          v-if="displayedKeywords.length === 0"
          class="text-center py-12"
        >
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No keywords found</h3>
          <p class="mt-1 text-sm text-gray-500">
            No keywords match the current filter criteria.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAlertsStore } from '../stores/alertsStore'
import TabFilter from '../components/TabFilter.vue'
import KeywordTable from '../components/KeywordTable.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const store = useAlertsStore()

const activeFilter = ref('all')

const campaign = computed(() => {
  if (store.selectedCampaign) {
    return store.selectedCampaign
  }

  // Try to find campaign by ID from route params
  const campaignId = route.params.id
  const found = store.campaignsWithAlerts.find(
    c => String(c.campaign_id || c.id) === String(campaignId)
  )

  if (found) {
    store.setSelectedCampaign(found)
    return found
  }

  return null
})

const displayedKeywords = computed(() => {
  if (!campaign.value) return []
  return store.filteredKeywords(activeFilter.value)
})

const goBack = () => {
  router.push({ name: 'dashboard' })
}

onMounted(async () => {
  // If no campaigns loaded yet, fetch them
  if (store.campaigns.length === 0) {
    await store.fetchCampaigns()
  }

  // Fetch keyword ranks for this campaign
  const campaignId = route.params.id
  if (campaignId) {
    await store.fetchKeywordRanks(campaignId)
  }
})
</script>
