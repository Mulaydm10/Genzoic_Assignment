# Market Pulse - AI-Powered Stock Analysis Platform

## Overview

Market Pulse is a fullstack TypeScript application that provides AI-powered stock market sentiment analysis using Google Gemini AI. The platform analyzes stock momentum, news sentiment, and market trends to provide users with bullish/neutral/bearish pulse ratings along with detailed explanations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Visualization**: Recharts for displaying stock data charts
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **API Design**: RESTful API with single endpoint `/api/v1/market-pulse`
- **Validation**: Zod for request/response schema validation
- **Caching**: In-memory caching with TTL (10-minute default)

### Database Setup
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Configuration**: Ready for database integration with environment-based configuration
- **Migrations**: Drizzle-kit for schema migrations

## Key Components

### Core Services
1. **Momentum Calculation**: Generates mock 5-day stock returns and calculates momentum scores
2. **News Analysis**: Fetches and analyzes recent news headlines for sentiment impact
3. **AI Sentiment Analysis**: Google Gemini AI integration for market pulse determination
4. **Caching Layer**: In-memory cache with cleanup mechanisms for performance optimization

### Frontend Components
1. **TickerInput**: Stock ticker entry with validation
2. **LoadingIndicator**: Loading states during analysis
3. **ResponseCard**: Displays analysis results with pulse ratings
4. **ErrorBox**: Error handling and retry functionality
5. **SparklineChart**: Visualizes stock return data

### Backend Routes
- `GET /api/v1/market-pulse?ticker=SYMBOL`: Main analysis endpoint that returns comprehensive market pulse data

## Data Flow

1. **User Input**: User enters stock ticker through TickerInput component
2. **API Request**: Frontend makes request to `/api/v1/market-pulse` endpoint
3. **Data Processing**: Backend processes request through multiple stages:
   - Ticker validation using Zod schema
   - Cache check for existing analysis
   - Mock data generation for returns and news
   - Momentum and volatility calculations
   - AI sentiment analysis via Google Gemini
4. **Response**: Structured response with pulse rating, confidence, and explanation
5. **UI Update**: Frontend displays results in ResponseCard with visualizations

## External Dependencies

### AI Integration
- **Google Gemini AI**: Primary AI service for sentiment analysis
- **API Configuration**: Requires `GEMINI_API_KEY` environment variable
- **Response Format**: Structured JSON with pulse, confidence, and explanation

### Mock Data Sources
- **Stock Returns**: Algorithm-generated consistent mock data based on ticker
- **News Headlines**: Template-based news generation for different companies
- **Sentiment Classification**: Positive/neutral/negative categorization

### UI Libraries
- **Radix UI**: Comprehensive component primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe styling variants

## Deployment Strategy

### Development Setup
- **Environment**: NODE_ENV=development with hot module replacement
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Database**: Drizzle configuration ready for PostgreSQL connection

### Production Configuration
- **Build Command**: `npm run build` - creates optimized frontend and backend bundles
- **Start Command**: `npm start` - runs production server
- **Environment Variables**: 
  - `GEMINI_API_KEY`: Required for AI functionality
  - `DATABASE_URL`: For database connectivity
  - `PORT`: Server port configuration

### Performance Optimizations
- **Caching**: 10-minute TTL on analysis results
- **Bundle Optimization**: Vite tree-shaking and code splitting
- **Type Safety**: Full TypeScript coverage for runtime safety

## Recent Updates

### January 2024 - Final Feature Implementation
- ✅ Added dark mode toggle with system preference detection
- ✅ Implemented auto-focus on ticker input field
- ✅ Enhanced rate limiting with in-memory tracking (100 requests per 15 minutes)
- ✅ Created custom useMarketPulse hook for better state management
- ✅ Added comprehensive error handling with retry logic
- ✅ Full dark mode support across all components
- ✅ Updated README with complete API documentation and architecture details

### Technical Enhancements
- **Dark Mode**: Complete light/dark theme implementation with localStorage persistence
- **Rate Limiting**: Basic protection against API abuse with cleanup mechanisms
- **Custom Hook**: Centralized state management for market pulse functionality
- **Error Handling**: Enhanced error states with user-friendly messages and retry functionality
- **Documentation**: Comprehensive README with API examples, architecture overview, and future roadmap

The application follows a modern fullstack architecture with clear separation of concerns, comprehensive error handling, performance optimizations, and accessibility features suitable for production deployment.