<template>
  <div>
    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search keywords..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              @click="sortBy('keyword')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Keyword
              <span v-if="sortColumn === 'keyword'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('previousRank')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Previous Rank
              <span v-if="sortColumn === 'previousRank'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('currentRank')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Current Rank
              <span v-if="sortColumn === 'currentRank'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('change')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Change
              <span v-if="sortColumn === 'change'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="sortBy('searchVolume')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Search Volume
              <span v-if="sortColumn === 'searchVolume'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="filteredKeywords.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              No keywords found
            </td>
          </tr>
          <tr
            v-for="keyword in filteredKeywords"
            :key="keyword.keyword"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ keyword.keyword }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ keyword.previousRank || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ keyword.currentRank || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
              <span
                :class="{
                  'text-gain-green': keyword.change > 0,
                  'text-drop-red': keyword.change < 0,
                  'text-gray-500': keyword.change === 0
                }"
              >
                {{ formatChange(keyword.change) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatNumber(keyword.searchVolume) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination info -->
    <div class="mt-4 text-sm text-gray-600">
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
