<template>
  <div class="bg-seo-card border border-seo-border rounded-lg p-6 mb-6">
    <div class="flex flex-wrap gap-4 items-end">
      <!-- Start Date -->
      <div class="flex-1 min-w-[200px]">
        <label for="start-date" class="block text-sm font-medium text-seo-text mb-2">
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          v-model="localStartDate"
          @change="handleDateChange"
          class="w-full px-4 py-2 bg-seo-bg border border-seo-border text-white rounded-lg focus:ring-2 focus:ring-seo-purple focus:border-seo-purple"
        />
      </div>

      <!-- End Date -->
      <div class="flex-1 min-w-[200px]">
        <label for="end-date" class="block text-sm font-medium text-seo-text mb-2">
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          v-model="localEndDate"
          @change="handleDateChange"
          class="w-full px-4 py-2 bg-seo-bg border border-seo-border text-white rounded-lg focus:ring-2 focus:ring-seo-purple focus:border-seo-purple"
        />
      </div>

      <!-- Threshold Selector -->
      <div class="flex-1 min-w-[200px]">
        <label for="threshold" class="block text-sm font-medium text-seo-text mb-2">
          Position Change Threshold
        </label>
        <select
          id="threshold"
          v-model="localThreshold"
          @change="handleThresholdChange"
          class="w-full px-4 py-2 bg-seo-bg border border-seo-border text-white rounded-lg focus:ring-2 focus:ring-seo-purple focus:border-seo-purple"
        >
          <option :value="3">±3 positions</option>
          <option :value="5">±5 positions</option>
          <option :value="10">±10 positions</option>
        </select>
      </div>

      <!-- Apply Button -->
      <div>
        <button
          @click="applyFilters"
          class="px-6 py-2 bg-seo-purple text-white rounded-lg hover:bg-seo-purple-dark transition-colors font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAlertsStore } from '../stores/alertsStore'

const store = useAlertsStore()

const localStartDate = ref(store.dateRange.startDate)
const localEndDate = ref(store.dateRange.endDate)
const localThreshold = ref(store.threshold)

// Emit event when filters change
const emit = defineEmits(['filtersApplied'])

const handleDateChange = () => {
  // Debounce logic can be added here if needed
}

const handleThresholdChange = () => {
  // Immediate update for threshold
}

const applyFilters = () => {
  store.setDateRange(localStartDate.value, localEndDate.value)
  store.setThreshold(parseInt(localThreshold.value))
  emit('filtersApplied')
}

// Watch for store changes to sync local state
watch(
  () => store.dateRange,
  (newRange) => {
    localStartDate.value = newRange.startDate
    localEndDate.value = newRange.endDate
  }
)

watch(
  () => store.threshold,
  (newThreshold) => {
    localThreshold.value = newThreshold
  }
)
</script>
