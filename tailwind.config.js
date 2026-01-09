/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SEOmonitor Brand Colors
        'seo-purple': '#8b5cf6',
        'seo-purple-dark': '#7c3aed',
        'seo-bg-dark': '#0f0f0f',
        'seo-bg': '#1a1a1a',
        'seo-card': '#262626',
        'seo-card-hover': '#2d2d2d',
        'seo-border': '#404040',
        'drop-red': '#ef4444',
        'gain-green': '#10b981',
        'seo-text': '#e5e5e5',
        'seo-text-muted': '#a3a3a3',
      },
    },
  },
  plugins: [],
}
