<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <!-- Campaign Name -->
    <h3 class="text-xl font-bold text-gray-900 mb-2 truncate">
      {{ campaign.campaign_name || campaign.name || 'Unnamed Campaign' }}
    </h3>

    <!-- Domain -->
    <p class="text-gray-600 mb-4 truncate">
      {{ campaign.domain || campaign.url || 'No domain' }}
    </p>

    <!-- Stats -->
    <div class="space-y-2 mb-6">
      <!-- Drops -->
      <div class="flex items-center justify-between">
        <span class="text-gray-700">Drops:</span>
        <span class="text-drop-red font-bold text-lg">
          {{ campaign.drops || 0 }}
        </span>
      </div>

      <!-- Gains -->
      <div class="flex items-center justify-between">
        <span class="text-gray-700">Gains:</span>
        <span class="text-gain-green font-bold text-lg">
          {{ campaign.gains || 0 }}
        </span>
      </div>
    </div>

    <!-- View Details Button -->
    <button
      @click="viewDetails"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
    >
      View Details
      <svg
        class="w-5 h-5 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAlertsStore } from '../stores/alertsStore'

const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const store = useAlertsStore()

const viewDetails = () => {
  store.setSelectedCampaign(props.campaign)
  router.push({
    name: 'campaign-detail',
    params: { id: props.campaign.campaign_id || props.campaign.id }
  })
}
</script>
