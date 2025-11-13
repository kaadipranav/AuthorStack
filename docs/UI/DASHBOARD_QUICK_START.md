# Sales Dashboard - Quick Start

Get the dashboard running in 2 minutes.

## 🚀 Start Dashboard

```bash
# 1. Start dev server
pnpm dev

# 2. Open browser
http://localhost:3000/dashboard

# 3. Sign in (if not already)
# Email: testuser@example.com
# Password: TestPassword123!
```

---

## 📊 What You'll See

### Top Metrics
- **Total Revenue:** $1,028.62 (last 30 days)
- **Units Sold:** 186
- **Page Reads:** 34,280 (KDP)

### Revenue Chart
- Line chart showing daily revenue
- 14 days of data
- Hover for details

### Platform Breakdown
- Pie chart showing revenue by platform
- Amazon: $639.12 (62%)
- Gumroad: $199.80 (19%)

### Top Books Table
- "The Art of Book Marketing": $639.12
- "Midnight in the Garden": $189.70
- Sorted by revenue

---

## 🔧 API Endpoints

### Overview
```
GET /api/dashboard/overview
```

Returns: Total revenue, units, page reads, platform breakdown, top books

### Charts
```
GET /api/dashboard/charts?days=30
```

Returns: Time series data for revenue and units

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/dashboard/page.tsx` | Main dashboard |
| `app/api/dashboard/overview/route.ts` | Overview API |
| `app/api/dashboard/charts/route.ts` | Charts API |
| `lib/hooks/useDashboard.ts` | React Query hooks |
| `components/dashboard/RevenueCard.tsx` | Metric cards |
| `components/dashboard/SalesChart.tsx` | Chart component |
| `components/dashboard/PlatformBreakdown.tsx` | Breakdown |
| `components/dashboard/BookPerformanceTable.tsx` | Table |

---

## 🧪 Quick Tests

### Test 1: Data Loads
1. Visit /dashboard
2. See metrics, charts, and table
3. ✓ Pass

### Test 2: Charts Display
1. Look at revenue line chart
2. See 14 data points
3. ✓ Pass

### Test 3: Platform Breakdown
1. Look at pie chart
2. See Amazon and Gumroad
3. ✓ Pass

### Test 4: Top Books
1. Look at table
2. See top 5 books
3. ✓ Pass

---

## 💾 Test Data

The dashboard uses seed data:
- 2 test books
- 21 sales records
- 14 days of data
- 2 platforms (Amazon, Gumroad)

---

## 🎯 Features

✓ Real-time data aggregation
✓ Server-side SQL queries
✓ React Query caching
✓ Skeleton loaders
✓ Empty states
✓ Responsive design
✓ Error handling

---

## 📈 Data Flow

```
Dashboard Page
    ↓
useDashboardOverview() hook
    ↓
GET /api/dashboard/overview
    ↓
Query Supabase (sales_data table)
    ↓
Aggregate by platform and book
    ↓
Return JSON
    ↓
React Query caches
    ↓
Components render
```

---

## 🔐 Authentication

- Dashboard requires login
- Only shows user's own data
- Server-side data filtering

---

## ⚡ Performance

- 5 minute cache
- Indexed database queries
- Minimal payload
- Responsive UI

---

## 📚 Documentation

- `DASHBOARD_IMPLEMENTATION.md` - Full guide
- `DASHBOARD_QUICK_START.md` - This file

---

## ✅ Checklist

- [ ] `pnpm dev` running
- [ ] Signed in
- [ ] Dashboard loads
- [ ] Metrics visible
- [ ] Charts render
- [ ] Table displays

---

**Ready to go!** 🎉

Visit http://localhost:3000/dashboard
