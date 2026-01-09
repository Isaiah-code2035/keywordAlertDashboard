<template>
  <div class="bg-seo-card border border-seo-border rounded-lg p-6 mb-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white">Browser Notifications</h2>
        <p class="text-sm text-seo-text-muted mt-1">Get instant alerts when keywords drop or gain positions</p>
        <p v-if="browserNotificationsStatus" class="text-sm mt-2" :class="browserNotificationsEnabled ? 'text-gain-green' : 'text-amber-500'">
          {{ browserNotificationsStatus }}
        </p>
      </div>
      <button
        @click="toggleBrowserNotifications"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-colors shadow-md',
          browserNotificationsEnabled
            ? 'bg-gain-green text-white hover:bg-green-700'
            : 'bg-seo-purple text-white hover:bg-seo-purple-dark'
        ]"
      >
        {{ browserNotificationsEnabled ? '✓ Enabled' : 'Enable Notifications' }}
      </button>
    </div>

    <!-- Test Button -->
    <div v-if="browserNotificationsEnabled" class="mt-4 pt-4 border-t border-seo-border">
      <button
        @click="testBrowserNotification"
        class="px-4 py-2 bg-seo-purple text-white rounded-lg hover:bg-seo-purple-dark transition-colors font-medium text-sm"
      >
        Test Notification
      </button>
      <p v-if="testResult" class="mt-2 text-sm" :class="testResult.success ? 'text-gain-green' : 'text-drop-red'">
        {{ testResult.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAlertsStore } from '../stores/alertsStore'
import {
  requestNotificationPermission,
  sendBrowserNotification
} from '../services/notifications'

const store = useAlertsStore()

const browserNotificationsEnabled = ref(false)
const browserNotificationsStatus = ref('')
const testResult = ref(null)

const toggleBrowserNotifications = async () => {
  if (!browserNotificationsEnabled.value) {
    const granted = await requestNotificationPermission()
    if (granted) {
      browserNotificationsEnabled.value = true
      browserNotificationsStatus.value = '✓ Notifications enabled - You will receive alerts automatically'
      localStorage.setItem('browserNotificationsEnabled', 'true')
      store.setBrowserNotificationsEnabled(true)

      // Send welcome notification
      sendBrowserNotification('Notifications Enabled!', {
        body: 'You will now receive automatic alerts for keyword changes',
        icon: '/favicon.ico'
      })
    } else {
      browserNotificationsStatus.value = '⚠️ Permission denied. Please check your browser settings.'
    }
  } else {
    browserNotificationsEnabled.value = false
    browserNotificationsStatus.value = '🔕 Notifications disabled'
    localStorage.setItem('browserNotificationsEnabled', 'false')
    store.setBrowserNotificationsEnabled(false)
  }
}

const testBrowserNotification = () => {
  if (browserNotificationsEnabled.value) {
    sendBrowserNotification('Test Keyword Alert', {
      body: '5 keywords dropped, 3 keywords gained in Test Campaign',
      requireInteraction: false
    })
    testResult.value = {
      success: true,
      message: '✓ Test notification sent!'
    }
  } else {
    testResult.value = {
      success: false,
      message: 'Please enable notifications first'
    }
  }

  setTimeout(() => {
    testResult.value = null
  }, 3000)
}

onMounted(() => {
  // Load saved settings
  browserNotificationsEnabled.value = localStorage.getItem('browserNotificationsEnabled') === 'true'

  if (browserNotificationsEnabled.value && Notification.permission === 'granted') {
    browserNotificationsStatus.value = '✓ Notifications enabled - Alerts are automatic'
    store.setBrowserNotificationsEnabled(true)
  } else if (browserNotificationsEnabled.value && Notification.permission !== 'granted') {
    browserNotificationsEnabled.value = false
    localStorage.setItem('browserNotificationsEnabled', 'false')
  }
})
</script>
