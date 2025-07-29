# Crypto Trading Signals Dashboard

## Overview

This project is a single-page application (SPA) that serves as a public, real-time dashboard for cryptocurrency trading signals, specifically for Bitcoin (BTC) and Ethereum (ETH). The application focuses on providing transparent, AI-explainable trading signals with comprehensive market analysis. It's built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom crypto-themed color scheme
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with dedicated routes for signals and market data
- **Data Storage**: In-memory storage with interface for future database integration
- **External APIs**: CoinGecko API for real-time cryptocurrency data

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Shared TypeScript schemas using Zod for validation
- **Database**: PostgreSQL (configured but not yet implemented)

## Key Components

### 1. Trading Signal Engine
Located in `server/services/signal-engine.ts`, this component:
- Generates trading signals based on technical indicators (RSI, MACD, Moving Averages, Bollinger Bands)
- Incorporates sentiment analysis data
- Calculates signal strength and provides explainable AI reasoning
- Updates signals for BTC and ETH automatically

### 2. Real-time Data Management
- Uses TanStack Query for client-side data fetching with 30-second refresh intervals
- Implements fallback data to prevent application failures
- Provides market overview with total market cap, volume, and BTC dominance

### 3. XAI (Explainable AI) System
- Modal-based explanation system triggered by user interaction
- Provides technical analysis reasoning, sentiment analysis, and risk assessments
- Tracks user engagement with analytics for product validation

### 4. Analytics Integration
- Google Analytics integration for tracking user engagement
- Custom event tracking for XAI modal interactions
- Page view tracking for single-page application navigation

### 5. Responsive UI Components
- Custom crypto-themed design with dark color scheme
- Signal cards displaying asset information, current signals, and strength indicators
- Market overview dashboard with key metrics
- Mobile-responsive design using Tailwind CSS

## Data Flow

1. **Signal Generation**: Backend signal engine fetches real-time data from CoinGecko API
2. **Technical Analysis**: Calculates various technical indicators from historical price data
3. **Sentiment Analysis**: Processes market sentiment data and news sources
4. **Signal Processing**: Combines technical and sentiment data to generate trading signals
5. **Client Updates**: Frontend polls backend every 30 seconds for updated signals
6. **User Interaction**: XAI explanations provided on-demand with analytics tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity (prepared for future use)
- **drizzle-orm**: Object-relational mapping
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Setup
- Vite development server with hot module replacement
- Express server running in development mode with file watching
- Environment variable configuration for Google Analytics

### Production Build
- Frontend: Vite builds optimized React application to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Single-command deployment with `npm run build` and `npm start`

### Environment Configuration
- Database URL configuration through environment variables
- Google Analytics measurement ID for user tracking
- API endpoints configured for both development and production

### Scalability Considerations
- Memory storage can be easily replaced with database implementation
- Drizzle ORM already configured for PostgreSQL migration
- API structure supports adding authentication and user-specific features
- Modular service architecture allows for microservices migration

The application is designed as an MVP to validate the hypothesis that transparent, explainable trading signals generate user interest and engagement, measured through anonymous analytics tracking.