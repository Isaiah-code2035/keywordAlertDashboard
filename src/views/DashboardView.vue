<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Keyword Alerts Dashboard</h1>
        <p class="text-gray-600 mt-2">Monitor keyword ranking changes across all campaigns</p>
      </header>

      <!-- Notification Settings -->
      <NotificationSettings />

      <!-- Filter Bar -->
      <FilterBar @filtersApplied="handleFiltersApplied" />

      <!-- Loading State -->
      <LoadingSpinner v-if="store.loading" />

      <!-- Empty State -->
      <div
        v-else-if="!store.loading && store.campaignsWithAlerts.length === 0"
        class="bg-white rounded-lg shadow-md p-12 text-center"
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by adding campaigns to SEOmonitor.
        </p>
      </div>

      <!-- Campaign Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <CampaignCard
          v-for="campaign in store.campaignsWithAlerts"
          :key="campaign.campaign_id || campaign.id"
          :campaign="campaign"
        />
      </div>

      <!-- Summary Stats -->
      <div
        v-if="!store.loading && store.campaignsWithAlerts.length > 0"
        class="mt-8 bg-white rounded-lg shadow-md p-6"
      >
        <h2 class="text-xl font-bold text-gray-900 mb-4">Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Campaigns</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalCampaigns }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Drops</p>
            <p class="text-3xl font-bold text-drop-red">{{ totalDrops }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Gains</p>
            <p class="text-3xl font-bold text-gain-green">{{ totalGains }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAlertsStore } from '../stores/alertsStore'
import FilterBar from '../components/FilterBar.vue'
import CampaignCard from '../components/CampaignCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import NotificationSettings from '../components/NotificationSettings.vue'

const store = useAlertsStore()

const totalCampaigns = computed(() => store.campaignsWithAlerts.length)

const totalDrops = computed(() => {
  return store.campaignsWithAlerts.reduce((sum, campaign) => sum + campaign.drops, 0)
})

const totalGains = computed(() => {
  return store.campaignsWithAlerts.reduce((sum, campaign) => sum + campaign.gains, 0)
})

const handleFiltersApplied = async () => {
  await loadData()
  // Automatically check and send notifications after loading data
  await store.checkAndSendNotifications()
}

const loadData = async () => {
  await store.fetchCampaigns()
  await store.fetchAllKeywordRanks()
  // Automatically send notifications after data loads
  await store.checkAndSendNotifications()
}

onMounted(async () => {
  await loadData()
})
</script>
