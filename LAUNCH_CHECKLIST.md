# AuthorStack - Soft Launch Checklist

Complete checklist for launching on Indie Hackers and Product Hunt.

---

## 📋 Pre-Launch Preparation (1-2 Weeks Before)

### Week 1: Foundation

- [ ] **Verify Production Deployment**
  - [ ] All tests passing: `pnpm test`
  - [ ] Build successful: `pnpm build`
  - [ ] No console errors in production
  - [ ] Sentry configured and monitoring
  - [ ] Database backups running

- [ ] **Security Check**
  - [ ] All environment variables set in Vercel
  - [ ] RLS policies enabled and tested
  - [ ] No secrets exposed in code
  - [ ] HTTPS enforced
  - [ ] Security headers configured

- [ ] **Performance Optimization**
  - [ ] Run Lighthouse audit
  - [ ] Optimize images
  - [ ] Enable caching headers
  - [ ] Test page load times
  - [ ] Monitor Core Web Vitals

- [ ] **Create Test Accounts**
  - [ ] Account 1: demo1@authorstack.com (Pro tier)
  - [ ] Account 2: demo2@authorstack.com (Pro tier)
  - [ ] Account 3: demo3@authorstack.com (Pro tier)
  - [ ] Account 4: demo4@authorstack.com (Pro tier)
  - [ ] Account 5: demo5@authorstack.com (Pro tier)
  - [ ] Password: `DemoPassword123!` (same for all)
  - [ ] Note: Store credentials securely

- [ ] **Seed Test Data**
  - [ ] Run: `pnpm db:seed`
  - [ ] Verify data in each demo account
  - [ ] Create additional sample books if needed
  - [ ] Add realistic sales data
  - [ ] Create launch checklists with tasks
  - [ ] Add competitor tracking data

- [ ] **Test Demo Accounts**
  - [ ] Login with each account
  - [ ] Verify data isolation (can't see other accounts)
  - [ ] Test all main features
  - [ ] Check dashboard loads quickly
  - [ ] Verify charts render correctly
  - [ ] Test export functionality

---

## 🎥 Demo Video Preparation (3-5 Days Before)

### Video Script (30 seconds)

**[0-5 seconds] - Hook**
"Managing multiple book sales platforms is a nightmare. Here's AuthorStack."

**[5-15 seconds] - Problem**
"Authors spend hours manually tracking sales across Amazon, Gumroad, and other platforms. No unified view. No insights. No time for writing."

**[15-25 seconds] - Solution**
*[Show dashboard with sales data]*
"AuthorStack connects all your platforms in one place. Real-time sales, revenue tracking, competitor insights, and launch planning—all automated."

**[25-30 seconds] - CTA**
"Join the beta. It's free. Let's get back to writing."

### Video Production Checklist

- [ ] **Script & Planning**
  - [ ] Write 30-second script
  - [ ] Plan shots/transitions
  - [ ] Create storyboard
  - [ ] Gather assets (logo, screenshots)

- [ ] **Recording**
  - [ ] Record screen at 1080p
  - [ ] Use demo account with sample data
  - [ ] Show key features:
    - [ ] Dashboard overview (5 sec)
    - [ ] Sales chart (3 sec)
    - [ ] Competitor tracking (3 sec)
    - [ ] Launch checklist (2 sec)
    - [ ] Settings/export (2 sec)
  - [ ] Speak clearly and confidently
  - [ ] Use professional background

- [ ] **Editing**
  - [ ] Add intro/outro (2 sec each)
  - [ ] Add background music (royalty-free)
  - [ ] Add text overlays for key points
  - [ ] Add captions (for accessibility)
  - [ ] Color grade for consistency
  - [ ] Export at 1080p, 30fps, MP4

- [ ] **Upload & Optimize**
  - [ ] Upload to YouTube (unlisted)
  - [ ] Add title: "AuthorStack - Book Sales Dashboard for Indie Authors"
  - [ ] Add description with link
  - [ ] Generate thumbnail
  - [ ] Add to Product Hunt post
  - [ ] Add to Indie Hackers post

- [ ] **Quality Check**
  - [ ] Watch full video
  - [ ] Check audio levels
  - [ ] Verify no glitches
  - [ ] Test on mobile
  - [ ] Get feedback from 2-3 people

---

## ✍️ Copy Preparation (3-5 Days Before)

### Indie Hackers Post (See separate section below)

- [ ] **Write Main Post**
  - [ ] Hook/problem statement
  - [ ] Solution explanation
  - [ ] Key features list
  - [ ] Demo video embedded
  - [ ] Call to action
  - [ ] Invite feedback

- [ ] **Prepare Responses**
  - [ ] Common questions & answers
  - [ ] Feature roadmap talking points
  - [ ] Pricing explanation
  - [ ] Beta access details
  - [ ] Feedback collection process

### Product Hunt Post

- [ ] **Prepare Product Hunt Assets**
  - [ ] Product name: "AuthorStack"
  - [ ] Tagline (60 chars max): "All-in-one dashboard for indie book authors"
  - [ ] Description (160 chars max): "Track sales across platforms, monitor competitors, plan launches. One dashboard for all your book business needs."
  - [ ] Gallery images (3-5):
    - [ ] Dashboard screenshot
    - [ ] Sales chart screenshot
    - [ ] Competitor tracking screenshot
    - [ ] Mobile view screenshot
    - [ ] Settings screenshot
  - [ ] Demo video (30 sec)
  - [ ] Thumbnail image (1200x630px)

- [ ] **Write Product Hunt Description**
  - [ ] Problem statement (1-2 paragraphs)
  - [ ] Solution explanation (2-3 paragraphs)
  - [ ] Key features (5-7 bullet points)
  - [ ] Pricing (free beta)
  - [ ] Call to action
  - [ ] Roadmap preview

- [ ] **Prepare Product Hunt Responses**
  - [ ] Maker introduction
  - [ ] Common questions & answers
  - [ ] Feature requests handling
  - [ ] Bug report process
  - [ ] Feedback collection

---

## 🎯 In-App Onboarding (2-3 Days Before)

### Onboarding Flow

- [ ] **Welcome Screen**
  - [ ] Display on first login
  - [ ] Show 3-5 key benefits
  - [ ] Add "Skip" and "Start Tour" buttons
  - [ ] Include video link

- [ ] **Interactive Tour**
  - [ ] Step 1: Dashboard overview (2 sec)
  - [ ] Step 2: Connect platforms (3 sec)
  - [ ] Step 3: View sales data (2 sec)
  - [ ] Step 4: Track competitors (2 sec)
  - [ ] Step 5: Plan launches (2 sec)
  - [ ] Show tooltips with explanations
  - [ ] Allow skipping individual steps

- [ ] **Setup Wizard**
  - [ ] Step 1: Connect first platform
  - [ ] Step 2: Import initial data
  - [ ] Step 3: Add first book
  - [ ] Step 4: Set up competitor tracking
  - [ ] Step 5: Create first launch checklist

- [ ] **Help Resources**
  - [ ] Add "?" icon in header
  - [ ] Link to documentation
  - [ ] Link to video tutorials
  - [ ] Link to feedback form
  - [ ] Add contact email

- [ ] **Feedback Collection**
  - [ ] Add feedback button (bottom right)
  - [ ] Show feedback form on exit
  - [ ] Ask: "What's missing?"
  - [ ] Ask: "What's confusing?"
  - [ ] Ask: "Would you recommend?"

### Onboarding Implementation

- [ ] **Create Onboarding Component**
  ```typescript
  // components/Onboarding/OnboardingTour.tsx
  // - Display welcome screen
  // - Show interactive tour
  // - Track completion
  // - Allow dismissal
  ```

- [ ] **Add Onboarding State**
  - [ ] Track in database: `onboarding_completed`
  - [ ] Show only on first login
  - [ ] Allow re-triggering from settings

- [ ] **Test Onboarding**
  - [ ] Test with new account
  - [ ] Test skipping steps
  - [ ] Test on mobile
  - [ ] Test on different browsers
  - [ ] Get feedback from 5+ users

---

## 📊 Test Data Seeding (2 Days Before)

### Run Seed Script

```bash
# Seed database with sample data
pnpm db:seed

# Verify data in each demo account
# - 2 books with sales data
# - 56 sales records (14 days)
# - 2 platform connections
# - 1 launch checklist with 5 tasks
# - 2 tracked competitors
# - 4 price history records
```

### Create Additional Demo Data

- [ ] **Book 1: "The Art of Book Marketing"**
  - [ ] ASIN: B0ABC123DEF
  - [ ] Genre: Non-Fiction
  - [ ] Sales: 128 units, $639.12 revenue
  - [ ] Platforms: Amazon, Gumroad

- [ ] **Book 2: "Midnight in the Garden"**
  - [ ] ASIN: B0XYZ789GHI
  - [ ] Genre: Fiction
  - [ ] Sales: 38 units, $189.70 revenue
  - [ ] Platforms: Amazon

- [ ] **Competitors**
  - [ ] "The Complete Guide to Self-Publishing" - $19.99
  - [ ] "Marketing Your Book Successfully" - $24.99

- [ ] **Launch Checklist**
  - [ ] 30 days from now
  - [ ] 5 tasks (2 completed, 3 pending)
  - [ ] Shows progress visually

---

## 🎬 Demo Account Setup (1 Day Before)

### Account 1: demo1@authorstack.com
- [ ] Login and verify access
- [ ] Explore all features
- [ ] Take screenshots for marketing
- [ ] Note any issues
- [ ] Share with team for testing

### Account 2: demo2@authorstack.com
- [ ] Setup for Product Hunt demo
- [ ] Customize with different book
- [ ] Prepare for live demo

### Account 3: demo3@authorstack.com
- [ ] Setup for Indie Hackers demo
- [ ] Show competitor tracking
- [ ] Show launch planning

### Account 4: demo4@authorstack.com
- [ ] Backup demo account
- [ ] Test edge cases
- [ ] Verify error handling

### Account 5: demo5@authorstack.com
- [ ] Mobile testing account
- [ ] Test responsive design
- [ ] Verify mobile experience

---

## 🚀 Launch Day (Day 0)

### Morning (6-8 hours before launch)

- [ ] **Final Checks**
  - [ ] Verify all systems operational
  - [ ] Check Sentry for errors
  - [ ] Monitor database performance
  - [ ] Test all demo accounts
  - [ ] Verify video plays correctly
  - [ ] Check all links work

- [ ] **Team Preparation**
  - [ ] Brief team on launch
  - [ ] Assign response duties
  - [ ] Set up monitoring dashboard
  - [ ] Prepare talking points
  - [ ] Test communication channels

- [ ] **Content Staging**
  - [ ] Indie Hackers post ready
  - [ ] Product Hunt post ready
  - [ ] Social media posts ready
  - [ ] Email announcement ready
  - [ ] Slack/Discord announcement ready

### Launch Time (T-0)

- [ ] **Indie Hackers Launch**
  - [ ] Post to Indie Hackers
  - [ ] Share link on Twitter
  - [ ] Share link on LinkedIn
  - [ ] Share link on Reddit (r/Entrepreneur)
  - [ ] Share link on Slack communities

- [ ] **Product Hunt Launch**
  - [ ] Post to Product Hunt
  - [ ] Share link on Twitter
  - [ ] Share link on LinkedIn
  - [ ] Ask friends/network to upvote
  - [ ] Prepare for questions

- [ ] **Social Media Blitz**
  - [ ] Tweet announcement
  - [ ] LinkedIn post
  - [ ] Facebook post (if applicable)
  - [ ] Instagram story (if applicable)
  - [ ] Email to waitlist

### During Launch (First 24 hours)

- [ ] **Active Monitoring**
  - [ ] Monitor Sentry for errors
  - [ ] Check database performance
  - [ ] Monitor API usage
  - [ ] Track user signups
  - [ ] Monitor server load

- [ ] **Community Engagement**
  - [ ] Respond to comments (Indie Hackers)
  - [ ] Respond to comments (Product Hunt)
  - [ ] Answer questions on Twitter
  - [ ] Answer questions on LinkedIn
  - [ ] Collect feedback

- [ ] **Support**
  - [ ] Monitor support email
  - [ ] Help new users
  - [ ] Fix bugs immediately
  - [ ] Document issues
  - [ ] Prepare fixes

---

## 📈 Post-Launch (Days 1-7)

### Daily Tasks

- [ ] **Monitor Metrics**
  - [ ] Track signups
  - [ ] Track active users
  - [ ] Track feature usage
  - [ ] Track error rates
  - [ ] Track performance

- [ ] **Community Engagement**
  - [ ] Respond to all comments
  - [ ] Answer questions
  - [ ] Collect feedback
  - [ ] Share updates
  - [ ] Thank supporters

- [ ] **Bug Fixes**
  - [ ] Fix critical bugs immediately
  - [ ] Fix non-critical bugs daily
  - [ ] Deploy fixes to production
  - [ ] Communicate fixes to users
  - [ ] Update status page

### Weekly Review (Day 7)

- [ ] **Analyze Results**
  - [ ] Total signups
  - [ ] Conversion rate
  - [ ] Feature usage
  - [ ] User feedback
  - [ ] Common issues

- [ ] **Plan Next Steps**
  - [ ] Prioritize feature requests
  - [ ] Plan next update
  - [ ] Update roadmap
  - [ ] Share results with team
  - [ ] Celebrate wins!

---

## 📝 Copywriting Checklist

### Indie Hackers Post

- [ ] Hook is compelling
- [ ] Problem is relatable
- [ ] Solution is clear
- [ ] Benefits are specific
- [ ] Call to action is clear
- [ ] Demo video embedded
- [ ] Links work correctly
- [ ] No typos or grammar errors
- [ ] Tone is authentic
- [ ] Length is appropriate (500-1000 words)

### Product Hunt Post

- [ ] Tagline is compelling (60 chars)
- [ ] Description is clear (160 chars)
- [ ] Gallery images are high quality
- [ ] Demo video is engaging
- [ ] Description is well-formatted
- [ ] Features are clearly listed
- [ ] Pricing is transparent
- [ ] Call to action is clear
- [ ] No typos or grammar errors

### Social Media Posts

- [ ] Twitter: Catchy, with link, hashtags
- [ ] LinkedIn: Professional, with link
- [ ] Reddit: Authentic, follows subreddit rules
- [ ] Slack: Casual, with link, emoji

---

## ✅ Final Verification Checklist

### 24 Hours Before Launch

- [ ] **Functionality**
  - [ ] All features working
  - [ ] No console errors
  - [ ] No database errors
  - [ ] All links working
  - [ ] Video plays correctly

- [ ] **Performance**
  - [ ] Page load < 3 seconds
  - [ ] Dashboard responsive
  - [ ] Charts render smoothly
  - [ ] Mobile experience good
  - [ ] No memory leaks

- [ ] **Security**
  - [ ] RLS policies enabled
  - [ ] No secrets exposed
  - [ ] HTTPS enforced
  - [ ] Security headers set
  - [ ] Backups running

- [ ] **Content**
  - [ ] Copy is proofread
  - [ ] Images are optimized
  - [ ] Video is uploaded
  - [ ] Links are correct
  - [ ] Demo accounts ready

- [ ] **Team**
  - [ ] Everyone briefed
  - [ ] Roles assigned
  - [ ] Communication channels ready
  - [ ] Monitoring tools set up
  - [ ] Support plan in place

---

## 🎯 Success Metrics

### First 24 Hours
- [ ] Target: 100+ signups
- [ ] Target: 50+ Product Hunt upvotes
- [ ] Target: 20+ Indie Hackers comments
- [ ] Target: 0 critical bugs

### First Week
- [ ] Target: 500+ signups
- [ ] Target: 100+ active users
- [ ] Target: 50% feature adoption
- [ ] Target: 4.5+ star rating

### First Month
- [ ] Target: 1000+ signups
- [ ] Target: 200+ active users
- [ ] Target: 70% retention
- [ ] Target: 10+ testimonials

---

## 🆘 Troubleshooting

### If Signup is Slow
- [ ] Check database performance
- [ ] Check API response times
- [ ] Check email delivery
- [ ] Verify RLS policies aren't blocking

### If Demo Accounts Not Working
- [ ] Verify credentials
- [ ] Check database seed
- [ ] Verify RLS policies
- [ ] Check authentication flow

### If Video Not Playing
- [ ] Check YouTube link
- [ ] Check video permissions
- [ ] Re-upload if necessary
- [ ] Test on different browsers

### If Getting Negative Feedback
- [ ] Listen carefully
- [ ] Acknowledge concerns
- [ ] Explain roadmap
- [ ] Offer to help
- [ ] Follow up after fixes

---

## 📞 Important Contacts

- **Indie Hackers Support:** support@indiehackers.com
- **Product Hunt Support:** support@producthunt.com
- **Your Team:** [Add team contact info]
- **Backup Support:** [Add backup contact info]

---

## 🎉 Launch Day Timeline

| Time | Task | Owner |
|------|------|-------|
| T-6h | Final checks | Tech Lead |
| T-4h | Team briefing | CEO |
| T-2h | Content staging | Marketing |
| T-1h | System verification | Tech Lead |
| T-0 | Indie Hackers post | CEO |
| T+5m | Product Hunt post | CEO |
| T+10m | Social media blitz | Marketing |
| T+30m | Monitor engagement | All |
| T+1h | First response wave | All |
| T+4h | Check metrics | CEO |
| T+8h | Evening check-in | All |
| T+24h | First day review | All |

---

**Status:** ✅ Ready to Copy & Use
**Last Updated:** November 2025
**Version:** 1.0.0
