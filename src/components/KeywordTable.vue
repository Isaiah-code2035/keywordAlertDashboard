<template>
  <div>
    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search keywords..."
        class="w-full px-4 py-2 bg-seo-bg border border-seo-border text-white rounded-lg focus:ring-2 focus:ring-seo-purple focus:border-seo-purple placeholder-seo-text-muted"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-seo-card border border-seo-border rounded-lg">
      <table class="min-w-full divide-y divide-seo-border">
        <thead class="bg-seo-bg">
          <tr>
            <th
              @click="sortBy('keyword')"
              class="px-6 py-3 text-left text-xs font-medium text-seo-text-muted uppercase tracking-wider cursor-pointer hover:bg-seo-card-hover"
            >
              Keyword
              <span v-if="sortColumn === 'keyword'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('previousRank')"
              class="px-6 py-3 text-left text-xs font-medium text-seo-text-muted uppercase tracking-wider cursor-pointer hover:bg-seo-card-hover"
            >
              Previous Rank
              <span v-if="sortColumn === 'previousRank'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('currentRank')"
              class="px-6 py-3 text-left text-xs font-medium text-seo-text-muted uppercase tracking-wider cursor-pointer hover:bg-seo-card-hover"
            >
              Current Rank
              <span v-if="sortColumn === 'currentRank'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('change')"
              class="px-6 py-3 text-left text-xs font-medium text-seo-text-muted uppercase tracking-wider cursor-pointer hover:bg-seo-card-hover"
            >
              Change
              <span v-if="sortColumn === 'change'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('searchVolume')"
              class="px-6 py-3 text-left text-xs font-medium text-seo-text-muted uppercase tracking-wider cursor-pointer hover:bg-seo-card-hover"
            >
              Search Volume
              <span v-if="sortColumn === 'searchVolume'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-seo-card divide-y divide-seo-border">
          <tr v-if="filteredKeywords.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-seo-text-muted">
              No keywords found
            </td>
          </tr>
          <tr
            v-for="keyword in filteredKeywords"
            :key="keyword.keyword"
            class="hover:bg-seo-card-hover"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
              {{ keyword.keyword }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-seo-text-muted">
              {{ keyword.previousRank || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-seo-text-muted">
              {{ keyword.currentRank || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
              <span
                :class="{
                  'text-gain-green': keyword.change > 0,
                  'text-drop-red': keyword.change < 0,
                  'text-seo-text-muted': keyword.change === 0
                }"
              >
                {{ formatChange(keyword.change) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-seo-text-muted">
              {{ formatNumber(keyword.searchVolume) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination info -->
    <div class="mt-4 text-sm text-seo-text-muted">
      Showing {{ filteredKeywords.length }} keyword(s)
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  keywords: {
    type: Array,
    default: () => []
  }
})

const searchQuery = ref('')
const sortColumn = ref('change')
const sortDirection = ref('desc')

const filteredKeywords = computed(() => {
  let result = [...props.keywords]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(k =>
      k.keyword.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  result.sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]

    // Handle null/undefined values
    if (aVal === null || aVal === undefined) aVal = 0
    if (bVal === null || bVal === undefined) bVal = 0

    // String comparison for keyword
    if (sortColumn.value === 'keyword') {
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
      return sortDirection.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    // Numeric comparison
    return sortDirection.value === 'asc'
      ? aVal - bVal
      : bVal - aVal
  })

  return result
})

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = column === 'change' ? 'desc' : 'asc'
  }
}

const formatChange = (change) => {
  if (change > 0) return `+${change}`
  return change
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString()
}
</script>
