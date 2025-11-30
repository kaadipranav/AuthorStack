# AuthorStack Migration Guide

> **Purpose:** Step-by-step guide for migrating between providers when Student Pack benefits expire or during scaling.

## Table of Contents
1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Database Migration](#database-migration)
3. [Authentication Migration](#authentication-migration)
4. [Storage Migration](#storage-migration)
5. [Hosting Migration](#hosting-migration)
6. [Post-Migration Verification](#post-migration-verification)

---

## Pre-Migration Checklist

Before any migration:

- [ ] Create complete backups of all databases
- [ ] Document current environment variables
- [ ] Schedule migration during low-traffic period
- [ ] Notify users of potential downtime
- [ ] Test migration in staging environment first
- [ ] Have rollback plan ready

---

## Database Migration

### MongoDB Atlas → Supabase PostgreSQL

**When:** When M0 free tier (512MB) is exhausted and scaling is needed.

**Alternative:** Stay on MongoDB Atlas with paid tier if document model is preferred.

#### Steps:

1. **Export MongoDB Data**
```bash
# Export each collection
mongodump --uri="$MONGODB_URI" --db=authorstack --out=./backup

# Or export as JSON
mongoexport --uri="$MONGODB_URI" --db=authorstack --collection=users --out=users.json
mongoexport --uri="$MONGODB_URI" --db=authorstack --collection=books --out=books.json
```

2. **Transform Schema**
```javascript
// Convert MongoDB documents to PostgreSQL rows
// Handle ObjectId → UUID conversion
// Flatten nested documents or use JSONB
```

3. **Create Supabase Tables**
```sql
-- Example: users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  credits INTEGER DEFAULT 0,
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

4. **Import Data**
```bash
# Use Supabase CLI or pg_restore
psql $DATABASE_URL < migration.sql
```

5. **Update Service Layer**
```typescript
// lib/db/mongodb.ts → lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
```

### Azure PostgreSQL → Supabase PostgreSQL

**When:** Student Pack expires (Azure free tier ends).

#### Steps:

1. **Export Database**
```bash
pg_dump $DATABASE_URL > azure_backup.sql
```

2. **Create Supabase Project**
- Go to [supabase.com](https://supabase.com)
- Create new project
- Note the connection string

3. **Import to Supabase**
```bash
psql $SUPABASE_URL < azure_backup.sql
```

4. **Update Environment Variables**
```env
# Old
DATABASE_URL=postgresql://...azure.com/authorstack

# New
DATABASE_URL=postgresql://...supabase.co/postgres
```

5. **Verify Data**
```sql
SELECT COUNT(*) FROM sales_data;
SELECT COUNT(*) FROM daily_aggregates;
```

---

## Authentication Migration

### Appwrite → Supabase Auth

**When:** Student Pack expires (Appwrite Pro ends).

**Note:** This is the most complex migration. Plan for password resets.

#### Steps:

1. **Export Users from Appwrite**
```javascript
// Use Appwrite SDK
const users = await users.list()
// Export to JSON
```

2. **Create Users in Supabase**
```typescript
// Note: Passwords cannot be migrated
// Users will need to reset passwords
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, serviceKey)

for (const user of users) {
  await supabase.auth.admin.createUser({
    email: user.email,
    email_confirm: true,
    user_metadata: { name: user.name }
  })
}
```

3. **Update Auth Service**
```typescript
// lib/services/auth.service.ts
import { createServerClient } from '@supabase/ssr'

export async function createUser(input: CreateUserInput) {
  const supabase = createServerClient(...)
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  })
  // ...
}
```

4. **Send Password Reset Emails**
```typescript
// Batch send password reset emails to all users
for (const user of users) {
  await supabase.auth.resetPasswordForEmail(user.email)
}
```

5. **Update OAuth Configurations**
- Configure Google OAuth in Supabase dashboard
- Configure GitHub OAuth in Supabase dashboard
- Update redirect URLs

---

## Storage Migration

### DigitalOcean Spaces → Supabase Storage

**When:** DigitalOcean credits depleted.

#### Steps:

1. **List All Files**
```typescript
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  // ...
})

const files = await client.send(new ListObjectsV2Command({
  Bucket: 'authorstack-assets'
}))
```

2. **Download Files**
```bash
# Using s3cmd or AWS CLI
aws s3 sync s3://authorstack-assets ./backup --endpoint-url=$DO_SPACES_ENDPOINT
```

3. **Upload to Supabase Storage**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, serviceKey)

for (const file of files) {
  const content = fs.readFileSync(`./backup/${file}`)
  await supabase.storage
    .from('assets')
    .upload(file.Key, content)
}
```

4. **Update URLs in Database**
```sql
UPDATE books 
SET cover_url = REPLACE(
  cover_url, 
  'authorstack-assets.nyc3.cdn.digitaloceanspaces.com',
  'your-project.supabase.co/storage/v1/object/public/assets'
);
```

---

## Hosting Migration

### DigitalOcean App Platform → Fly.io

**When:** DigitalOcean credits depleted.

#### Steps:

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

2. **Create fly.toml**
```toml
app = "authorstack"
primary_region = "ewr"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

[env]
  NODE_ENV = "production"
```

3. **Create Dockerfile**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

4. **Set Secrets**
```bash
fly secrets set MONGODB_URI="..."
fly secrets set DATABASE_URL="..."
# ... all other env vars
```

5. **Deploy**
```bash
fly deploy
```

6. **Update DNS**
- Point domain to Fly.io
- Update CORS settings
- Update OAuth redirect URLs

---

## Post-Migration Verification

### Checklist

- [ ] All API endpoints responding correctly
- [ ] User authentication working
- [ ] Database queries returning expected data
- [ ] File uploads/downloads working
- [ ] Background jobs executing
- [ ] Monitoring/logging active
- [ ] SSL certificates valid
- [ ] Performance within acceptable limits

### Monitoring

```bash
# Check application logs
fly logs -a authorstack

# Check database connections
psql $DATABASE_URL -c "SELECT COUNT(*) FROM pg_stat_activity;"

# Verify Sentry receiving errors
# Check Sentry dashboard
```

### Rollback Plan

If migration fails:

1. Revert DNS to old hosting
2. Restore database from backup
3. Investigate and fix issues
4. Retry migration

---

## Cost Comparison

| Service | Student Pack | Post-Graduation |
|---------|-------------|-----------------|
| Hosting | $0 (DO credits) | $10-15/mo (Fly.io) |
| Database | $0 (Azure) | $25/mo (Supabase) |
| Auth | $0 (Appwrite Pro) | Included in Supabase |
| Storage | $0 (DO credits) | Included in Supabase |
| Redis | $0 (Upstash) | $0 (Upstash free) |
| **Total** | **~$10-30/mo** | **~$65-90/mo** |

---

## Support

For migration assistance:
- Check GitHub Issues
- Community Discord
- Email: support@authorstack.com
