# Launch Checklists - Quick Reference

Fast reference for launch checklist testing and usage.

## 🚀 Quick Test (3 minutes)

```bash
# 1. Start dev server
pnpm dev

# 2. Sign in
# Email: testuser@example.com
# Password: TestPassword123!

# 3. Go to Launches
http://localhost:3000/launches

# 4. Click "Create Launch"
# Select book: "The Art of Book Marketing"
# Select template: "Fiction Launch"
# Set launch date: 30 days from now
# Click "Create Launch"

# 5. See launch detail page
# 10 tasks loaded
# Progress bar at 0%
# Tasks have due dates

# 6. Complete a task
# Click checkbox on first task
# Progress bar updates to 10%

# 7. Add custom task
# Click "Add Task"
# Enter task name
# Click "Add"
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/launches/templates.json` | 3 templates |
| `app/api/launches/create/route.ts` | Create API |
| `app/api/launches/[id]/route.ts` | Get API |
| `lib/hooks/useLaunches.ts` | React Query hooks |
| `components/launches/CreateLaunchWizard.tsx` | Wizard |
| `components/launches/LaunchTaskList.tsx` | Task list |
| `app/launches/page.tsx` | Launches list |
| `app/launches/[id]/page.tsx` | Launch detail |

---

## 🧪 Test Cases

### Test 1: Create Launch
1. Visit /launches
2. Click "Create Launch"
3. Select book
4. Select template
5. Set date
6. ✓ Redirects to detail page

### Test 2: Complete Task
1. Click checkbox
2. ✓ Task marked complete
3. ✓ Progress updates

### Test 3: Add Task
1. Click "Add Task"
2. Enter name
3. Click "Add"
4. ✓ Task appears

### Test 4: Progress
1. Complete 3 of 10 tasks
2. ✓ Progress bar shows 30%
3. ✓ Completion count shows 3/10

---

## 📊 Templates

| Template | Tasks | Days |
|----------|-------|------|
| Fiction | 10 | 60 to -3 |
| Minimal | 5 | 14 to 0 |
| Non-Fiction | 10 | 60 to -5 |

---

## 🔧 API Endpoints

```
POST /api/launches/create
GET /api/launches/:id
PATCH /api/launches/:id/tasks/:taskId
POST /api/launches/:id/tasks
```

---

## 📈 Progress Calculation

```
Completed: 3
Total: 10
Percentage: 30%
```

---

## ✅ Checklist

- [ ] Dev server running
- [ ] Signed in
- [ ] Visit /launches
- [ ] Create launch
- [ ] See 10 tasks
- [ ] Complete task
- [ ] See progress update
- [ ] Add custom task

---

**Ready to test!** 🎉

Visit http://localhost:3000/launches
