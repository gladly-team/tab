# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Notes

**DO NOT START DEV SERVERS** - The development server is already running. Never run `yarn run start:newtab`, `yarn run start:search`, or any other start commands. The servers are already active and attempting to start them will cause port conflicts.

## Common Development Commands

### Initial Setup
```bash
# Install all dependencies and build Docker images
yarn run build

# Initialize database (first time only)
cd dynamodb
yarn run init
cd ..
```

### Running the Application
```bash
# Start the new tab app (most common)
yarn run start:newtab

# Start the search app
yarn run start:search
```

### Testing
```bash
# Run all tests across all services
yarn test

# Run tests for specific services
yarn run graphql:test
yarn run lambda:test
yarn run web:test
yarn run dynamodb:test

# Run tests in watch mode (per service)
cd graphql && yarn run test:watch
cd web && yarn run test:watch
cd lambda && yarn run test:watch

# Run integration tests
yarn run test:integration
```

### Linting and Formatting
```bash
# Format all code (automatically done on commit)
yarn run parent:format:fix
yarn run web:format:fix
yarn run graphql:format:fix
yarn run lambda:format:fix
yarn run dynamodb:format:fix

# Run linting
yarn run parent:lint
cd graphql && yarn run lint
cd lambda && yarn run lint
```

### Building and Deployment
```bash
# Build for production (handled by CI)
yarn run ci:deploy

# Deploy individual services
yarn run dynamodb:deploy
yarn run lambda:deploy
yarn run graphql:deploy
yarn run s3:deploy
yarn run web:deploy
```

## Architecture Overview

### Service Architecture
Tab for a Cause is a monorepo containing multiple services that work together:

1. **Web App** (`/web`): React-based frontend using Relay for GraphQL
   - Two main apps: "newtab" (browser new tab page) and "search" 
   - Uses Material-UI v3 for UI components
   - Firebase Authentication for user auth
   - Relay compiler for GraphQL queries

2. **GraphQL API** (`/graphql`): Node.js GraphQL server
   - Serverless deployment on AWS Lambda
   - Uses DynamoDB for data persistence
   - Redis (via Upstash) for caching
   - Firebase Admin SDK for auth verification
   - GrowthBook for feature flags and experiments

3. **Lambda Functions** (`/lambda`): Edge functions and utilities
   - Firebase authorizer for API Gateway
   - Lambda@Edge functions for CloudFront
   - Search request logging

4. **DynamoDB** (`/dynamodb`): Database configuration and fixtures
   - Local DynamoDB setup for development
   - Table definitions in `tables.json`
   - Test fixtures for development

5. **S3** (`/s3`): Static asset serving
   - Media files (backgrounds, charity images)
   - Local development server

### Key Data Models
The application uses DynamoDB tables for:
- **Users**: User accounts and profiles
- **Charities**: Supported charitable organizations  
- **UserImpact**: Tracks user contributions to charities
- **Missions**: Gamification challenges
- **VcDonationLog**: Virtual currency donations
- **UserWidgets**: Dashboard widget configurations
- **ReferralDataLog**: User referral tracking
- **BackgroundImages**: Custom background images

### GraphQL Schema
The GraphQL API provides:
- User management and authentication
- Charity selection and donation tracking
- Widget configuration
- Mission/squad functionality
- Revenue and impact tracking
- A/B testing and feature flags

### Authentication Flow
1. Frontend uses Firebase Auth for user authentication
2. Firebase ID tokens are sent with GraphQL requests
3. Lambda authorizer validates tokens
4. GraphQL resolvers check user permissions

### Development Environment
- Uses Docker Compose for local services (DynamoDB, Redis)
- Environment variables managed via `.env` and `.env.local` files
- Hot reloading for web and GraphQL development
- GraphQL schema automatically synced to web app

### Deployment
- TravisCI handles CI/CD pipeline
- Serverless Framework deploys to AWS
- Stage-specific deployments (dev, prod)
- Environment variables managed in `travis.yml`