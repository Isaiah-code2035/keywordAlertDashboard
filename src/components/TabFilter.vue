<template>
  <div class="border-b border-gray-200 mb-6">
    <nav class="-mb-px flex space-x-8">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="selectTab(tab.value)"
        :class="[
          'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          activeTab === tab.value
            ? 'border-seo-purple text-seo-purple'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref(props.modelValue)

const tabs = [
  { label: 'All Changes', value: 'all' },
  { label: 'Drops', value: 'drops' },
  { label: 'Gains', value: 'gains' }
]

const selectTab = (value) => {
  activeTab.value = value
  emit('update:modelValue', value)
}
</script>
