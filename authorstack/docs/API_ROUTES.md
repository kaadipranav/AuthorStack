# AuthorStack API Routes

> **Base URL:** `/api`  
> **Authentication:** Bearer token via Appwrite session

## Authentication

### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Author"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "userId": "user_123",
  "sessionId": "session_abc"
}
```

### POST `/api/auth/login`
Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Author"
  },
  "sessionId": "session_abc"
}
```

### POST `/api/auth/logout`
End current session.

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Books

### GET `/api/books`
List all books for authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (draft, published, archived)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "books": [
    {
      "id": "book_123",
      "title": "My First Novel",
      "author": "John Author",
      "status": "published",
      "platforms": ["kdp", "gumroad"],
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

### POST `/api/books`
Create a new book.

**Request:**
```json
{
  "title": "My New Book",
  "author": "John Author",
  "description": "A thrilling adventure...",
  "genres": ["Fantasy", "Adventure"],
  "platforms": ["kdp"]
}
```

**Response:** `201 Created`
```json
{
  "book": {
    "id": "book_456",
    "title": "My New Book",
    "status": "draft",
    "createdAt": "2024-11-30T10:00:00Z"
  }
}
```

### GET `/api/books/[id]`
Get a specific book.

**Response:** `200 OK`
```json
{
  "book": {
    "id": "book_123",
    "title": "My First Novel",
    "subtitle": "A Tale of Two Cities",
    "author": "John Author",
    "description": "...",
    "isbn": "978-0-123456-78-9",
    "asin": "B0ABCDEFGH",
    "coverUrl": "https://cdn.authorstack.com/covers/book_123.jpg",
    "genres": ["Literary Fiction"],
    "platforms": ["kdp", "gumroad"],
    "status": "published",
    "metadata": {},
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-06-20T15:30:00Z"
  }
}
```

### PUT `/api/books/[id]`
Update a book.

**Request:**
```json
{
  "title": "Updated Title",
  "status": "published"
}
```

**Response:** `200 OK`

### DELETE `/api/books/[id]`
Delete a book.

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Sales

### GET `/api/sales`
Get sales data for authenticated user.

**Query Parameters:**
- `range`: Time range (7d, 30d, 90d, custom)
- `startDate` (optional): ISO date for custom range
- `endDate` (optional): ISO date for custom range
- `platform` (optional): Filter by platform
- `bookId` (optional): Filter by book

**Response:** `200 OK`
```json
{
  "sales": [
    {
      "id": 123,
      "bookId": "book_123",
      "platform": "kdp",
      "date": "2024-11-29",
      "revenue": 45.50,
      "units": 15
    }
  ],
  "aggregates": [
    {
      "date": "2024-11-29",
      "totalRevenue": 125.00,
      "totalUnits": 42,
      "platformBreakdown": {
        "kdp": { "revenue": 100.00, "units": 35 },
        "gumroad": { "revenue": 25.00, "units": 7 }
      }
    }
  ],
  "range": "30d"
}
```

### POST `/api/sales`
Trigger manual sync from connected platforms.

**Response:** `200 OK`
```json
{
  "success": true,
  "triggered": ["kdp", "gumroad"],
  "message": "Sync started"
}
```

---

## AI

### POST `/api/ai/insights`
Generate AI insights for user's data.

**Request:**
```json
{
  "bookId": "book_123",        // Optional: specific book
  "includeForecasts": true     // Optional
}
```

**Response:** `200 OK`
```json
{
  "insights": [
    {
      "id": "insight_1",
      "type": "trend",
      "title": "Revenue Growth",
      "description": "Your revenue increased 23% this month compared to last month.",
      "confidence": 0.92,
      "action": "Consider increasing marketing spend to maintain momentum."
    }
  ],
  "generatedAt": "2024-11-30T10:00:00Z"
}
```

**Rate Limit:** 5 requests/minute per user

### POST `/api/ai/pricing`
Get pricing recommendations for a book.

**Request:**
```json
{
  "bookId": "book_123",
  "competitorAsins": ["B0AAAA", "B0BBBB"]  // Optional
}
```

**Response:** `200 OK`
```json
{
  "recommendedPrice": 4.99,
  "confidence": 0.85,
  "reasoning": "Based on competitor pricing and your sales history...",
  "alternatives": [
    { "price": 2.99, "scenario": "Volume strategy" },
    { "price": 6.99, "scenario": "Premium positioning" }
  ]
}
```

---

## Cron

### POST `/api/cron/master`
Master cron endpoint (protected).

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
```

**Response:** `200 OK`
```json
{
  "triggered": ["data-ingestion", "leaderboard-calc", "analytics-aggregation"],
  "timestamp": "2024-11-30T00:00:00Z"
}
```

---

## Webhooks

### POST `/api/webhooks/stripe`
Handle Stripe webhook events.

**Headers:**
```
Stripe-Signature: {signature}
```

**Handled Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Response:** `200 OK`
```json
{
  "received": true
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE",
  "details": {}  // Optional
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 100 req/min |
| AI endpoints | 5 req/min |
| Auth endpoints | 10 req/min |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701345600
```
