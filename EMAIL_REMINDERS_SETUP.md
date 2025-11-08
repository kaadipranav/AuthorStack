# Email Reminders with Resend - Setup Guide

Complete setup for email reminders using Resend and cron jobs.

## ✅ What's Implemented

### Backend
- ✓ Resend email service (`lib/email/resend.ts`)
- ✓ Cron endpoint (`app/api/cron/send-reminders/route.ts`)
- ✓ HTML email templates (reminder + launch day)
- ✓ Automatic task reminder detection

### Frontend
- ✓ Reminders toggle in launch creation
- ✓ UI component for enabling/disabling reminders

### Features
- ✓ Reminders 7, 3, and 1 day(s) before task due date
- ✓ Launch day notification
- ✓ Beautiful HTML emails
- ✓ Secure cron authentication
- ✓ Detailed logging

---

## 🚀 Quick Setup

### Step 1: Get Resend API Key

1. Go to https://resend.com
2. Sign up for free account
3. Go to API Keys
4. Copy your API key

### Step 2: Add Environment Variables

Add to `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-secret-key-here
```

### Step 3: Test Locally

```bash
# Test the cron endpoint
curl -X GET http://localhost:3000/api/cron/send-reminders \
  -H "Authorization: Bearer your-secret-key-here"
```

---

## 📧 Email Templates

### Task Reminder Email

**Subject:** 📋 Reminder: "Task Name" is due in X day(s)

**Content:**
- Task name and book title
- Due date
- Days until due
- Launch date
- Link to launch checklist
- Call-to-action button

**Example:**
```
Task: Finalize book cover
Book: The Art of Book Marketing
Due: Thursday, October 9, 2025
Days until due: 7 days
Launch date: October 16, 2025

[View Launch Checklist Button]
```

### Launch Day Email

**Subject:** 🚀 Launch Day! Your book "Book Title" is live!

**Content:**
- Celebration message
- Reminders to post on social media
- Link to launch dashboard
- Congratulations message

---

## 🔧 Cron Configuration

### Option 1: Vercel Cron (Recommended)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 2 * * *"
    }
  ]
}
```

This runs daily at 2 AM UTC.

### Option 2: Upstash QStash

1. Go to https://console.upstash.com
2. Create QStash project
3. Create scheduled task:
   - URL: `https://your-domain.com/api/cron/send-reminders`
   - Schedule: `0 2 * * *` (daily at 2 AM)
   - Headers: `Authorization: Bearer your-secret-key`

### Option 3: External Cron Service

Use services like:
- EasyCron (easycron.com)
- Cron-job.org
- AWS EventBridge

Configure to call:
```
GET https://your-domain.com/api/cron/send-reminders
Header: Authorization: Bearer your-secret-key
```

---

## 🧪 Testing Locally

### Test 1: Manual Cron Trigger

```bash
# Without authentication
curl -X GET http://localhost:3000/api/cron/send-reminders

# With authentication
curl -X GET http://localhost:3000/api/cron/send-reminders \
  -H "Authorization: Bearer your-secret-key-here"
```

### Test 2: Create Test Launch

1. Visit http://localhost:3000/launches
2. Create a new launch
3. Set launch date to today
4. Set task due dates to today, 1 day ago, 3 days ago, 7 days ago
5. Run cron endpoint
6. Check logs for email sending

### Test 3: Verify Email Sending

Check the response logs:

```json
{
  "success": true,
  "emailsSent": 5,
  "logs": [
    {
      "timestamp": "2025-11-08T10:30:00.000Z",
      "message": "Starting reminder cron job",
      "status": "info"
    },
    {
      "timestamp": "2025-11-08T10:30:01.000Z",
      "message": "Found 1 active launch(es)",
      "status": "info"
    },
    {
      "timestamp": "2025-11-08T10:30:02.000Z",
      "message": "Reminder email sent to user@example.com",
      "status": "success"
    }
  ]
}
```

---

## 📋 Reminder Schedule

### Task Reminders
- **7 days before due date** - "Your task is due in 7 days"
- **3 days before due date** - "Your task is due in 3 days"
- **1 day before due date** - "Your task is due tomorrow"

### Launch Day
- **On launch date** - "Your book is launching today!"

---

## 🔐 Security

### Cron Secret

Protect your cron endpoint with a secret:

```bash
# Generate a random secret
openssl rand -base64 32
```

Add to `.env.local`:
```bash
CRON_SECRET=your-generated-secret
```

The endpoint will verify:
```
Authorization: Bearer your-generated-secret
```

### Email Validation

- Emails only sent to authenticated users
- Only for active launches
- Only for incomplete tasks
- Only on scheduled reminders

---

## 📊 Email Sending Flow

```
Cron Job Triggered
    ↓
Get all active launches
    ↓
For each launch:
  - Check if launch day
  - Check each task for reminders (1, 3, 7 days)
    ↓
For each reminder:
  - Get user email
  - Generate HTML email
  - Send via Resend API
    ↓
Log results
```

---

## 🚀 Production Setup

### Step 1: Deploy to Vercel

```bash
git push origin main
# Vercel auto-deploys
```

### Step 2: Configure Environment

In Vercel dashboard:
1. Go to Settings > Environment Variables
2. Add:
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `CRON_SECRET`

### Step 3: Verify Cron

Check Vercel Cron Logs:
1. Go to Deployments
2. Click latest deployment
3. Go to Cron Jobs
4. View logs

---

## 🧪 Testing Checklist

- [ ] Resend API key configured
- [ ] Environment variables set
- [ ] Cron endpoint accessible
- [ ] Manual cron trigger works
- [ ] Emails received in test inbox
- [ ] HTML renders correctly
- [ ] Links work in emails
- [ ] Cron schedule configured
- [ ] Production deployment verified

---

## 📚 Related Files

- `lib/email/resend.ts` - Email service
- `app/api/cron/send-reminders/route.ts` - Cron endpoint
- `components/launches/RemindersToggle.tsx` - UI toggle
- `vercel.json` - Vercel cron config

---

## ✅ Verification Steps

### Local Testing

1. Set environment variables
2. Create test launch with tasks
3. Run: `curl -X GET http://localhost:3000/api/cron/send-reminders`
4. Check response logs
5. Verify emails sent

### Production Testing

1. Deploy to Vercel
2. Wait for cron to run (2 AM UTC)
3. Check Vercel cron logs
4. Verify emails received

---

## 🐛 Troubleshooting

### "RESEND_API_KEY not configured"
- Add `RESEND_API_KEY` to `.env.local`
- Restart dev server

### "Unauthorized cron request"
- Check `Authorization` header
- Verify `CRON_SECRET` matches

### "Failed to send email"
- Check Resend API key validity
- Verify email address is valid
- Check Resend dashboard for errors

### "No emails sent"
- Verify launches are active
- Check task due dates
- Ensure tasks are incomplete

---

**Email reminders are ready!** 🎉

Test locally with curl, then deploy to production.
