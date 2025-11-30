# AuthorStack Database Schema

> **Strategy:** Distribute data across multiple free databases from GitHub Student Pack

## Database Distribution

| Database | Provider | Data Stored | Pack Benefit |
|----------|----------|-------------|--------------|
| MongoDB Atlas | MongoDB | Core app data | $50 credits + M0 free |
| PostgreSQL | Azure | Analytics/time-series | Free while student |
| Appwrite | Appwrite | Auth, sessions | Free Pro ($15/mo value) |
| Redis | Upstash | Cache, rate limits | Free tier |

---

## MongoDB Atlas Collections

### `users`
Core user profile data (synced from Appwrite auth).

```javascript
{
  _id: ObjectId,
  authId: String,              // Appwrite user ID
  authProvider: "appwrite",    // For migration tracking
  email: String,
  name: String,
  subscriptionTier: String,    // "free" | "starter" | "professional" | "enterprise"
  credits: Number,             // AI credits balance
  preferences: {
    emailNotifications: Boolean,
    weeklyDigest: Boolean,
    theme: String,             // "light" | "dark" | "system"
    timezone: String,
    currency: String
  },
  connectedPlatforms: [{
    platform: String,          // "kdp" | "gumroad" | "apple_books"
    connectedAt: Date,
    lastSync: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ authId: 1 }                  // Unique
{ email: 1 }                   // Unique
```

### `books`
Book catalog with metadata.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,            // Reference to users
  title: String,
  subtitle: String,
  author: String,
  description: String,
  isbn: String,
  asin: String,                // Amazon ID
  coverUrl: String,            // DigitalOcean Spaces URL
  genres: [String],
  platforms: [String],         // Which platforms this book is on
  publishedDate: Date,
  status: String,              // "draft" | "published" | "archived"
  metadata: {
    pageCount: Number,
    wordCount: Number,
    series: String,
    seriesPosition: Number
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1 }
{ userId: 1, status: 1 }
{ asin: 1 }                    // For quick lookups
```

### `checklists`
Launch checklists and tasks.

```javascript
{
  _id: ObjectId,
  bookId: ObjectId,
  userId: ObjectId,
  templateId: String,
  name: String,
  tasks: [{
    id: String,
    title: String,
    description: String,
    completed: Boolean,
    dueDate: Date,
    completedAt: Date,
    category: String
  }],
  progress: Number,            // 0-100
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1 }
{ bookId: 1 }
```

### `community_posts`
Community feed posts (Phase 3).

```javascript
{
  _id: ObjectId,
  authorId: ObjectId,
  content: String,
  attachments: [{
    type: String,
    url: String
  }],
  likes: [ObjectId],           // User IDs
  comments: [{
    id: String,
    authorId: ObjectId,
    content: String,
    createdAt: Date
  }],
  visibility: String,          // "public" | "followers"
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ authorId: 1 }
{ createdAt: -1 }
```

### `marketplace_boosts`
Paid visibility boosts (Phase 3).

```javascript
{
  _id: ObjectId,
  bookId: ObjectId,
  userId: ObjectId,
  duration: Number,            // Days
  position: Number,            // Leaderboard position
  credits_spent: Number,
  active: Boolean,
  startedAt: Date,
  expiresAt: Date
}

// Indexes
{ active: 1, expiresAt: 1 }
{ userId: 1 }
```

### `competitors`
Tracked competitor books.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  asin: String,
  title: String,
  author: String,
  currentPrice: Number,
  priceHistory: [{
    price: Number,
    date: Date
  }],
  genre: String,
  lastChecked: Date,
  createdAt: Date
}

// Indexes
{ userId: 1 }
{ asin: 1 }
```

---

## Azure PostgreSQL Tables

### `sales_data`
Raw sales transactions from all platforms.

```sql
CREATE TABLE sales_data (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL,       -- MongoDB ObjectId as string
  platform VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  revenue DECIMAL(10,2) NOT NULL,
  units INTEGER NOT NULL,
  page_reads INTEGER DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  synced_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, book_id, platform, date)
);

CREATE INDEX idx_sales_user_date ON sales_data(user_id, date DESC);
CREATE INDEX idx_sales_platform ON sales_data(platform);
CREATE INDEX idx_sales_book ON sales_data(book_id);
```

### `daily_aggregates`
Pre-calculated daily summaries for fast dashboard queries.

```sql
CREATE TABLE daily_aggregates (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  total_revenue DECIMAL(10,2) NOT NULL,
  total_units INTEGER NOT NULL,
  total_page_reads INTEGER DEFAULT 0,
  platform_breakdown JSONB,    -- {"kdp": {"revenue": 100, "units": 50}}
  book_breakdown JSONB,        -- {"book_id": {"revenue": 50, "units": 25}}
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_aggregates_user_date ON daily_aggregates(user_id, date DESC);
```

### `sync_logs`
Platform sync history for debugging.

```sql
CREATE TABLE sync_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  platform VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,  -- "success" | "partial" | "failed"
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  synced_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sync_user ON sync_logs(user_id, synced_at DESC);
```

### `ai_insights`
Cached AI-generated insights.

```sql
CREATE TABLE ai_insights (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID,                 -- NULL for user-level insights
  insight_type VARCHAR(50),     -- "trend" | "pricing" | "forecast"
  content JSONB NOT NULL,
  confidence DECIMAL(3,2),
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insights_user ON ai_insights(user_id, created_at DESC);
CREATE INDEX idx_insights_valid ON ai_insights(valid_until) WHERE valid_until > NOW();
```

### `revenue_forecasts`
AI revenue predictions.

```sql
CREATE TABLE revenue_forecasts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_revenue DECIMAL(10,2),
  actual_revenue DECIMAL(10,2), -- Filled in after the date
  confidence DECIMAL(3,2),
  factors JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_forecasts_user ON revenue_forecasts(user_id, forecast_date);
```

---

## Appwrite Database

### Collection: `user_preferences`
Real-time synced user settings.

```javascript
{
  $id: String,                 // Auto-generated
  userId: String,              // Appwrite user ID
  theme: String,
  notifications: Boolean,
  // Synced to MongoDB for redundancy
}
```

### Collection: `sessions`
Active user sessions (managed by Appwrite).

---

## Upstash Redis Keys

### Cache Keys
```
authorstack:user:{userId}           → User profile (5 min TTL)
authorstack:book:{bookId}           → Book data (5 min TTL)
authorstack:sales:{userId}:{range}  → Sales data (1 min TTL)
authorstack:dashboard:{userId}      → Dashboard summary (1 min TTL)
```

### Rate Limit Keys
```
authorstack:ratelimit:{userId}      → API rate limit counter
authorstack:ai-ratelimit:{userId}   → AI endpoint rate limit
```

### Queue Keys (if using BullMQ)
```
authorstack:queue:data-sync         → Data sync jobs
authorstack:queue:analytics         → Analytics jobs
authorstack:queue:notifications     → Email jobs
```

---

## Migration Notes

### Post-Graduation Consolidation

When migrating to Supabase:

1. **MongoDB → Supabase PostgreSQL**
   - Convert collections to tables
   - Use JSONB for flexible fields
   
2. **Azure PostgreSQL → Supabase PostgreSQL**
   - Direct migration via pg_dump/pg_restore
   
3. **Appwrite → Supabase Auth**
   - Export users, reset passwords
   - Update OAuth configurations
   
4. **Redis → Keep Upstash**
   - Free tier continues post-graduation
