import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CampaignDetailView from '../views/CampaignDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/campaign/:id',
      name: 'campaign-detail',
      component: CampaignDetailView,
      props: true
    }
  ]
})

export default router
