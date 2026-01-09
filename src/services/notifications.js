import emailjs from '@emailjs/browser'

// Initialize EmailJS (user will need to add their own keys)
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY)
}

// Browser Notification API
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export const sendBrowserNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    })
  }
}

// Email Notification via EmailJS
export const sendEmailNotification = async (emailData) => {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn('EmailJS not configured. Add VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_TEMPLATE_ID to .env')
    return { success: false, error: 'EmailJS not configured' }
  }

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData
    )
    console.log('Email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

// Send alert notifications
export const sendAlertNotification = async ({
  campaignName,
  drops,
  gains,
  threshold,
  userEmail
}) => {
  const hasSignificantChanges = Math.abs(drops) >= threshold || Math.abs(gains) >= threshold

  if (!hasSignificantChanges) {
    return { browser: false, email: false }
  }

  // Browser notification
  const browserNotificationSent = Notification.permission === 'granted'
  if (browserNotificationSent) {
    const message = drops > 0
      ? `${drops} keyword${drops > 1 ? 's' : ''} dropped in ${campaignName}`
      : `${gains} keyword${gains > 1 ? 's' : ''} gained in ${campaignName}`

    sendBrowserNotification('Keyword Alert!', {
      body: message,
      tag: `campaign-${campaignName}`,
      requireInteraction: true
    })
  }

  // Email notification
  let emailResult = { success: false }
  if (userEmail && EMAILJS_SERVICE_ID) {
    emailResult = await sendEmailNotification({
      to_email: userEmail,
      campaign_name: campaignName,
      drops_count: drops,
      gains_count: gains,
      threshold: threshold,
      message: `Campaign ${campaignName} has ${drops} drops and ${gains} gains (threshold: ±${threshold})`
    })
  }

  return {
    browser: browserNotificationSent,
    email: emailResult.success
  }
}

// Send summary notification for all campaigns
export const sendSummaryNotification = async ({
  totalCampaigns,
  totalDrops,
  totalGains,
  threshold,
  userEmail,
  campaignsWithAlerts
}) => {
  // Browser notification
  const browserNotificationSent = Notification.permission === 'granted'
  if (browserNotificationSent) {
    sendBrowserNotification('Keyword Alerts Summary', {
      body: `${totalCampaigns} campaigns monitored\n${totalDrops} total drops | ${totalGains} total gains`,
      tag: 'summary',
      requireInteraction: false
    })
  }

  // Email notification with detailed summary
  let emailResult = { success: false }
  if (userEmail && EMAILJS_SERVICE_ID) {
    const campaignsList = campaignsWithAlerts
      .filter(c => c.drops > 0 || c.gains > 0)
      .map(c => `• ${c.campaign_name}: ${c.drops} drops, ${c.gains} gains`)
      .join('\n')

    emailResult = await sendEmailNotification({
      to_email: userEmail,
      total_campaigns: totalCampaigns,
      total_drops: totalDrops,
      total_gains: totalGains,
      threshold: threshold,
      campaigns_list: campaignsList,
      message: `Summary: ${totalDrops} drops and ${totalGains} gains across ${totalCampaigns} campaigns`
    })
  }

  return {
    browser: browserNotificationSent,
    email: emailResult.success
  }
}

export default {
  requestNotificationPermission,
  sendBrowserNotification,
  sendEmailNotification,
  sendAlertNotification,
  sendSummaryNotification
}
