/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'drop-red': '#EF4444',
        'gain-green': '#22C55E',
      },
    },
  },
  plugins: [],
}
