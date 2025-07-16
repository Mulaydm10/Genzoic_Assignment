# Market Pulse - AI-Powered Stock Analysis Platform

Market Pulse is a fullstack TypeScript application that provides AI-powered stock market sentiment analysis using Google Gemini AI. The platform analyzes stock momentum, news sentiment, and market trends to provide users with actionable insights.

## Features

- **Real-time Stock Analysis**: Enter any stock ticker to get instant market sentiment analysis
- **AI-Powered Insights**: Leverages Google Gemini AI to analyze market sentiment and provide pulse ratings
- **Momentum Scoring**: Calculates 5-day momentum scores based on historical returns
- **News Impact Analysis**: Fetches and analyzes recent news headlines for sentiment impact
- **Interactive UI**: Clean, responsive React interface with loading states and error handling
- **Caching**: In-memory caching with 10-minute TTL for improved performance

## Tech Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** for API routes
- **Google Gemini AI** for sentiment analysis
- **Zod** for schema validation
- **In-memory caching** with TTL support

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **TanStack Query** for data fetching
- **Recharts** for data visualization
- **Wouter** for routing

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key

### Environment Variables
Create a `.env` file in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### Installation & Running

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd market-pulse
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory with your Gemini API key.

4. **Start the application**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## API Documentation

### Market Pulse Analysis Endpoint

**GET** `/api/v1/market-pulse?ticker=SYMBOL`

Analyzes market sentiment for a given stock ticker.

**Parameters:**
- `ticker` (string, required): Stock ticker symbol (e.g., AAPL, MSFT, TSLA)

**Example Request:**
```bash
curl "http://localhost:5000/api/v1/market-pulse?ticker=AAPL"
```

**Example Response:**
```json
{
  "ticker": "AAPL",
  "momentum_score": 1.24,
  "returns": [2.1, -0.5, 1.8, -1.2, 0.3],
  "pulse": "bullish",
  "confidence": 75,
  "llm_explanation": "Based on momentum analysis and recent news sentiment, AAPL shows positive indicators with strong quarterly results and strategic partnerships driving optimism.",
  "news_headlines": [
    {
      "title": "Apple Inc. Reports Strong Quarterly Results",
      "description": "Apple Inc. exceeded analyst expectations with robust revenue growth and positive outlook for the coming quarter.",
      "sentiment": "positive",
      "timestamp": "2024-01-15T18:00:00.000Z"
    }
  ],
  "analysis_timestamp": "2024-01-15T20:00:00.000Z",
  "cache_hit": false
}
```

## Architecture Overview

### Design Decisions

**Frontend Architecture:**
- **React + TypeScript**: Type-safe component development
- **Tailwind CSS**: Utility-first styling with dark mode support
- **TanStack Query**: Efficient data fetching and caching
- **Shadcn UI**: Consistent, accessible component library

**Backend Architecture:**
- **Express.js**: Lightweight, fast web framework
- **Google Gemini AI**: Advanced language model for sentiment analysis
- **In-memory Caching**: 10-minute TTL for improved performance
- **Zod Validation**: Runtime type checking for API requests

**Data Flow:**
1. User submits stock ticker through React frontend
2. Frontend validates input and makes API request
3. Backend validates ticker format using Zod schema
4. Cache check for existing analysis (10-minute TTL)
5. Generate mock stock returns and news data
6. Send structured prompt to Gemini AI for analysis
7. Parse AI response and format final result
8. Cache response and return to frontend
9. Frontend displays results with interactive components

### Performance Optimizations

- **Caching Strategy**: In-memory cache with automatic cleanup
- **Bundling**: Vite for fast development and optimized production builds
- **Code Splitting**: Automatic route-based splitting
- **Type Safety**: Full TypeScript coverage prevents runtime errors

### Security Considerations

- **Input Validation**: Strict ticker format validation
- **API Key Security**: Environment variable storage
- **Error Handling**: Graceful fallbacks for API failures
- **Rate Limiting**: Basic protection against API abuse

## Features Implemented

✅ **Core Functionality**
- Stock ticker input with validation
- 5-day momentum calculation
- AI-powered sentiment analysis via Gemini
- News impact assessment
- Real-time analysis results

✅ **User Experience**
- Auto-focus input field
- Loading states and progress indicators
- Error handling with retry functionality
- Dark/light mode toggle
- Responsive design for all devices
- Collapsible JSON response viewer

✅ **Performance & Reliability**
- In-memory caching with 10-minute TTL
- Automatic cache cleanup
- Graceful error handling
- Fallback responses for AI failures

✅ **Technical Excellence**
- Full TypeScript implementation
- Comprehensive error handling
- Clean component architecture
- Accessibility features

## Limitations & Known Issues

- **Mock Data**: Currently uses generated mock data for stock returns and news
- **API Dependency**: Requires active Gemini API key and internet connection
- **Memory Storage**: Cache is cleared on server restart
- **Rate Limiting**: Basic implementation, not production-grade

## Next Steps & Future Enhancements

### Immediate Improvements
- [ ] Integration with real stock market APIs (Alpha Vantage, IEX Cloud)
- [ ] Real news API integration (NewsAPI, Financial Modeling Prep)
- [ ] Persistent database storage (PostgreSQL, Redis)
- [ ] Advanced rate limiting and API protection

### Advanced Features
- [ ] User authentication and portfolio tracking
- [ ] Historical analysis and trend visualization
- [ ] Email/SMS alerts for price targets
- [ ] Multi-ticker comparison tools
- [ ] Advanced charting with technical indicators

### Production Deployment
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] CI/CD pipeline setup
- [ ] Monitoring and logging
- [ ] Load balancing and scaling
- [ ] SSL/TLS implementation

### Testing & Quality
- [ ] Unit tests for all components
- [ ] Integration tests for API endpoints
- [ ] End-to-end testing with Playwright
- [ ] Performance testing and optimization

## Acknowledgments

This project leverages several excellent technologies:

- **Google Gemini AI**: Advanced language model for intelligent market analysis
- **React**: Modern frontend framework for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Shadcn UI**: Beautiful, accessible component library
- **TypeScript**: Type-safe JavaScript for robust development
- **Express.js**: Fast, minimalist web framework for Node.js

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

# MarketPulseTracker

## Project Structure

- `src/` — Backend (Express server, Gemini integration, cache, etc.)
- `frontend/` — React SPA frontend
- `k8s/` — Kubernetes manifests (deployment, service)
- `Dockerfile` — Production-ready Dockerfile
- `.github/workflows/ci.yml` — GitHub Actions CI config
- `README.md` — Project documentation
- `.env.example` — Example environment variables
- `MarketPulseTracker/` — **Legacy folder** (see below)

## Legacy Folder: `MarketPulseTracker/`

> **Note:**
> The `MarketPulseTracker/` folder is a legacy directory containing the original, pre-reorganization codebase (backend, frontend, configs, etc.).
>
> - It is **not used** in the new structure.
> - All active development and deployment should use the new `src/`, `frontend/`, and `k8s/` folders at the project root.
> - You may safely ignore or delete `MarketPulseTracker/` after confirming your migration is complete.
> - It is retained here temporarily for reference and backup during the transition.

## Setup, Environment, and Usage

... (keep your existing setup, env, and usage instructions here) ...
