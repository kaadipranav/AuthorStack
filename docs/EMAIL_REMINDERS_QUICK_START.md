# Email Reminders - Quick Start

Fast setup and testing for email reminders.

## 🚀 5-Minute Setup

### Step 1: Get Resend API Key
```
https://resend.com → Sign up → API Keys → Copy key
```

### Step 2: Add to .env.local
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-secret-key
```

### Step 3: Test Locally
```bash
# Start dev server
pnpm dev

# In another terminal, trigger cron
curl -X GET http://localhost:3000/api/cron/send-reminders \
  -H "Authorization: Bearer your-secret-key"
```

---

## 📧 Email Types

### Task Reminder
- 7 days before due date
- 3 days before due date
- 1 day before due date

### Launch Day
- On launch date
- Celebration + action items

---

## 🧪 Test Flow

1. Create launch with tasks
2. Set task due dates (today, -1, -3, -7 days)
3. Run cron endpoint
4. Check response logs
5. Verify emails sent

---

## 🔧 Cron Configuration

### Vercel (vercel.json)
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

### Upstash QStash
```
URL: https://your-domain.com/api/cron/send-reminders
Schedule: 0 2 * * *
Header: Authorization: Bearer your-secret-key
```

---

## 📊 Reminder Schedule

| Days Until Due | Email Sent |
|---|---|
| 7 | ✓ |
| 3 | ✓ |
| 1 | ✓ |
| 0 | Launch Day Email |

---

## 🔐 Security

```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
CRON_SECRET=generated-secret

# Use in curl
curl -H "Authorization: Bearer generated-secret" ...
```

---

## 📚 Files

| File | Purpose |
|---|---|
| `lib/email/resend.ts` | Email service |
| `app/api/cron/send-reminders/route.ts` | Cron endpoint |
| `components/launches/RemindersToggle.tsx` | UI toggle |

---

## ✅ Checklist

- [ ] Resend account created
- [ ] API key added to .env.local
- [ ] Cron secret generated
- [ ] Dev server running
- [ ] Cron endpoint tested
- [ ] Emails received
- [ ] Cron job configured (Vercel/Upstash)
- [ ] Production deployed

---

## 🐛 Quick Fixes

**"RESEND_API_KEY not configured"**
→ Add to .env.local and restart

**"Unauthorized cron request"**
→ Check Authorization header matches CRON_SECRET

**"No emails sent"**
→ Verify launch is active and tasks are incomplete

---

**Ready to test!** 🎉

```bash
curl -X GET http://localhost:3000/api/cron/send-reminders \
  -H "Authorization: Bearer your-secret-key"
```
