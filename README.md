# Keyword Alerts Dashboard

A Vue 3 application that integrates with the SEOmonitor API to monitor keyword ranking changes across multiple campaigns. Users can see at-a-glance which campaigns have significant keyword movements (drops or gains), then drill down into specific campaigns to see detailed keyword data.

## Features

- **Dashboard Overview**: View all campaigns with their keyword drops and gains at a glance
- **Date Range Filtering**: Select custom date ranges to analyze ranking changes
- **Threshold Selection**: Filter keywords by position change thresholds (±3, ±5, ±10 positions)
- **Campaign Details**: Drill down into specific campaigns to see detailed keyword data
- **Tab Filtering**: Filter keywords by all changes, drops only, or gains only
- **Sortable Tables**: Sort keyword data by any column (keyword, rank, change, volume)
- **Search Functionality**: Search for specific keywords within campaigns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: See changes as you adjust filters and thresholds

## Tech Stack

- **Vue 3** (Composition API)
- **Vue Router** (Navigation)
- **Pinia** (State Management)
- **Axios** (API Calls)
- **Tailwind CSS** (Styling)
- **Vite** (Build Tool)

## Project Structure

```
src/
├── components/
│   ├── CampaignCard.vue          # Campaign summary card
│   ├── KeywordTable.vue          # Sortable keyword table
│   ├── FilterBar.vue             # Date picker & threshold selector
│   ├── TabFilter.vue             # All/Drops/Gains tabs
│   └── LoadingSpinner.vue        # Loading indicator
├── views/
│   ├── DashboardView.vue         # Main overview page
│   └── CampaignDetailView.vue    # Campaign details page
├── stores/
│   └── alertsStore.js            # Pinia store for state management
├── services/
│   └── api.js                    # Axios instance and API functions
├── router/
│   └── index.js                  # Vue Router configuration
├── App.vue                       # Root component
└── main.js                       # App entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- SEOmonitor API key

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd keyword-alerts-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:

   The `.env` file has already been created with your API key. If you need to update it:

   ```bash
   VITE_API_KEY=your_seomonitor_api_key
   VITE_API_BASE_URL=https://apigw.seomonitor.com/v3
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:

   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## API Integration

The application uses the SEOmonitor API v3 with the following endpoints:

- **GET** `/dashboard/v3.0/campaigns/tracked` - Get list of all campaigns
- **GET** `/rank-tracker/v3.0/keywords/daily-ranks` - Get daily keyword ranks
  - Query parameters: `campaign_id`, `start_date`, `end_date`

### Rate Limiting

The API service implements rate limiting to comply with SEOmonitor's limit of 10 requests per second.

### Authentication

API requests include the API key in the `Authorization` header, which is configured via environment variables.

## How It Works

### Ranking Change Calculation

- **Change** = Previous Rank (start_date) - Current Rank (end_date)
- **Gain** (positive change): Keyword moved up in rankings (lower rank number is better)
- **Drop** (negative change): Keyword moved down in rankings (higher rank number)
- Only keywords with changes >= threshold are displayed

### Color Coding

- **Red (#EF4444)**: Ranking drops (negative changes)
- **Green (#22C55E)**: Ranking gains (positive changes)
- **Gray**: Neutral or no significant change

## Usage Guide

### Dashboard View

1. Select your desired date range and threshold
2. Click "Apply Filters" to fetch campaign data
3. View campaign cards showing drops and gains counts
4. Click "View Details" on any campaign to drill down

### Campaign Detail View

1. Use the tab filter to view All Changes, Drops only, or Gains only
2. Search for specific keywords using the search bar
3. Click column headers to sort the table
4. Use the back button to return to the dashboard

## Troubleshooting

### API Errors

- **401 Unauthorized**: Check that your API key is correct in `.env`
- **429 Too Many Requests**: Rate limiting is active; the app will automatically retry
- **Network errors**: Verify your internet connection and API base URL

### No Data Showing

- Ensure you have campaigns set up in SEOmonitor
- Check that the selected date range has data available
- Verify that keywords exist for the selected campaigns

### Build Issues

If you encounter build issues:

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development

### Adding New Features

The modular structure makes it easy to add new features:

- Add new components in `src/components/`
- Add new views in `src/views/`
- Extend the store in `src/stores/alertsStore.js`
- Add new API functions in `src/services/api.js`

### State Management

The Pinia store (`alertsStore.js`) manages:

- Campaigns list
- Selected campaign
- Keyword ranks data
- Date range and threshold settings
- Loading and error states

## License

This project is proprietary software for SEOmonitor.

## Support

For issues or questions, please contact the development team.
