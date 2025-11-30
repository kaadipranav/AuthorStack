# AuthorStack Architecture

> **Version:** 0.1.0  
> **Last Updated:** November 2024  
> **Stack:** Next.js 14 + GitHub Student Developer Pack

## Overview

AuthorStack is built to maximize free resources from the GitHub Student Developer Pack while maintaining production-ready architecture that can scale post-graduation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Next.js 14 App Router                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  Pages   │  │   API    │  │  Server  │              │   │
│  │  │ (React)  │  │  Routes  │  │ Actions  │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │   Book   │  │  Sales   │  │    AI    │       │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   MongoDB    │     │  PostgreSQL  │     │    Redis     │
│   Atlas      │     │    Azure     │     │   Upstash    │
│  (App Data)  │     │ (Analytics)  │     │   (Cache)    │
└──────────────┘     └──────────────┘     └──────────────┘
        │                                         │
        │     ┌──────────────┐                   │
        └────▶│   Appwrite   │◀──────────────────┘
              │  (Auth/RT)   │
              └──────────────┘
```

## Core Principles

### 1. Service Layer Pattern
All database access MUST go through the service layer (`/lib/services/`). This enables:
- Easy migration between providers
- Centralized business logic
- Consistent error handling
- Caching abstraction

### 2. Multi-Database Strategy
We distribute data across multiple free databases to maximize storage:

| Data Type | Database | Reason |
|-----------|----------|--------|
| Users/Auth | Appwrite | Free Pro, built-in auth |
| Books/Core | MongoDB Atlas | Flexible schema, M0 free |
| Sales/Analytics | Azure PostgreSQL | Time-series, free student |
| Cache/Jobs | Upstash Redis | Edge-compatible, free tier |

### 3. Background Jobs
Jobs are handled through:
- BullMQ with Redis (or Upstash adapter)
- Triggered via cron endpoint (`/api/cron/master`)
- Scheduled by GitHub Actions (free)

### 4. AI Integration
- Primary: OpenRouter with DeepSeek V3 (cheapest)
- Backup: Azure OpenAI ($100 credit)
- Rate limited per user (5 req/min)

## Directory Structure

```
/authorstack
├── /app                 # Next.js App Router
│   ├── /api            # API routes
│   ├── /(auth)         # Auth pages (layout group)
│   └── /(dashboard)    # Protected pages
├── /lib                # Core utilities
│   ├── /db             # Database clients
│   ├── /services       # Service layer (CRITICAL!)
│   ├── /queue          # Background jobs
│   ├── /utils          # Helpers
│   └── /ai             # AI utilities
├── /components         # React components
├── /hooks              # Custom hooks
├── /types              # TypeScript types
├── /config             # Configuration
└── /docs               # Documentation
```

## Data Flow

### Read Flow
```
Client → API Route → Service → Cache Check → Database → Response
                                    ↓
                              Cache Update
```

### Write Flow
```
Client → API Route → Validation → Service → Database → Cache Invalidate
                         ↓
                    Zod Schema
```

### Background Job Flow
```
Trigger (Cron/Event) → Queue → Worker → Service → Database
                                  ↓
                            Sentry Logging
```

## Security

1. **Authentication**: Appwrite handles all auth (OAuth, sessions, MFA)
2. **Rate Limiting**: Upstash rate limiter on all API routes
3. **Validation**: Zod schemas for all inputs
4. **Headers**: Security headers via Next.js config
5. **Secrets**: Environment variables, never committed

## Monitoring

| Service | Purpose | Pack Benefit |
|---------|---------|--------------|
| Sentry | Error tracking | 1 year free |
| New Relic | APM | Free ($300/mo value) |
| Datadog | Infrastructure | 2 years free |
| SimpleAnalytics | User analytics | 1 year free |

## Post-Graduation Migration

When student benefits expire:
1. Consolidate databases to Supabase ($25/mo)
2. Move hosting to Fly.io ($10-15/mo)
3. Keep Upstash Redis (free tier continues)
4. Keep MongoDB M0 (free tier continues)

**Target Cost: $65-90/month**

## Related Documentation

- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Detailed schema definitions
- [API_ROUTES.md](./API_ROUTES.md) - API endpoint documentation
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Provider migration guide
