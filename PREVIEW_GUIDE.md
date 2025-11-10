# AuthorStack UI Preview Guide

## Quick Start

### 1. Install Dependencies (if needed)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## What to Preview

### 🎨 **Login Page** - Editorial Design Showcase
**URL:** `http://localhost:3000/auth/login`

**What to look for:**
- Off-white paper background (#FAF7F1)
- Serif heading "Welcome Back" (Merriweather font)
- Burgundy "Sign In" button
- Google OAuth button with proper styling
- Smooth transitions on hover
- Focus rings on form inputs (try tabbing through)

**Test interactions:**
- Hover over buttons
- Tab through form fields (notice burgundy focus rings)
- Click "Sign in with Google" to see OAuth flow

---

### 📊 **Dashboard** - Full Layout Implementation
**URL:** `http://localhost:3000/dashboard`

**What to look for:**

#### Sidebar (Left)
- Collapsible sidebar (click arrow button to toggle)
- Active page indicator (burgundy bar on left)
- Icons with labels when expanded
- Keyboard shortcuts hint at bottom
- Smooth collapse animation

#### Topbar (Top)
- Search bar with Cmd+K hint
- "New Book" burgundy button
- Sync button with icon
- Notifications bell with badge
- User menu with avatar

#### Main Content
- Serif heading "Sales Dashboard" (Merriweather)
- Revenue cards with:
  - Mono font numbers (JetBrains Mono)
  - Burgundy icons
  - Hover shadow effect
  - Trend indicators

**Test interactions:**
- Press `Cmd+K` (or `Ctrl+K` on Windows) to open search
- Press `Cmd+1` to navigate to dashboard
- Click sidebar collapse button
- Hover over revenue cards
- Click user avatar to open menu

---

## Keyboard Shortcuts to Test

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open global search |
| `Cmd/Ctrl + 1` | Navigate to Dashboard |
| `Cmd/Ctrl + 2` | Navigate to Books |
| `Cmd/Ctrl + 3` | Navigate to Launches |
| `Cmd/Ctrl + N` | New Book |
| `ESC` | Close search modal |
| `Tab` | Navigate through focusable elements |

---

## Design System Verification

### Typography Check
1. **Headings should use Merriweather** (serif font)
   - Look at "Welcome Back" on login
   - Look at "Sales Dashboard" on dashboard
   
2. **Body text should use Inter** (sans-serif)
   - All paragraph text
   - Button labels
   - Navigation items

3. **Numbers should use JetBrains Mono** (monospace)
   - Revenue amounts on dashboard cards
   - Any data/metrics

### Color Check
1. **Background:** Off-white paper (#FAF7F1)
2. **Primary accent:** Deep burgundy (#8A1B2E)
   - Primary buttons
   - Active navigation indicator
   - Icons in topbar
3. **Text:** Near-black ink (#11110F)
4. **Secondary text:** Charcoal (#3C3B39)

### Interaction Check
1. **Hover states:** Buttons should slightly darken
2. **Focus states:** Burgundy ring around focused elements
3. **Transitions:** Smooth cubic-bezier easing
4. **Card hover:** Subtle shadow increase

---

## Responsive Testing (Desktop Only - Mobile TBD)

### Test at Different Widths
1. **1920px (Large Desktop)**
   - Content should be centered with max-width
   - Sidebar fully visible
   
2. **1280px (Standard Desktop)**
   - Optimal viewing experience
   - All elements properly spaced

3. **1024px (Small Desktop/Tablet)**
   - Layout should still work
   - Sidebar might need to collapse

---

## Browser Testing

### Chrome/Edge
- ✅ Should work perfectly
- Test backdrop-blur on search modal

### Firefox
- ✅ Should work perfectly
- Verify font rendering

### Safari
- ✅ Should work
- Check backdrop-blur support
- Verify smooth transitions

---

## Visual Comparison

### Before (Generic Blue Theme)
- Blue primary color
- Generic sans-serif everywhere
- Standard shadows
- No editorial feel

### After (Editorial Newsroom)
- Burgundy accent color
- Serif headings (Merriweather)
- Mono numbers (JetBrains Mono)
- Paper texture background
- Elevated shadows
- Smooth transitions
- Literary aesthetic

---

## Common Issues & Solutions

### Fonts Not Loading
**Issue:** Headings appear in fallback font (Georgia)
**Solution:** Check internet connection - fonts load from Google Fonts CDN

### Sidebar Not Visible
**Issue:** Sidebar is off-screen
**Solution:** Refresh page, check browser width > 1024px

### Keyboard Shortcuts Not Working
**Issue:** Cmd+K doesn't open search
**Solution:** Make sure you're on the dashboard page, not login

### Colors Look Different
**Issue:** Colors don't match specification
**Solution:** Check browser color profile, try different browser

---

## Screenshots to Take

For documentation/presentation:

1. **Login page** - Full screen
2. **Dashboard with sidebar expanded** - Full screen
3. **Dashboard with sidebar collapsed** - Full screen
4. **Search modal open** (Cmd+K) - Full screen
5. **User menu dropdown** - Focused on topbar
6. **Revenue card hover state** - Close-up
7. **Sidebar active indicator** - Close-up
8. **Form input focus state** - Close-up

---

## Performance Check

### Load Time
- Initial page load should be < 2s
- Navigation between pages should be instant (client-side routing)

### Animations
- All transitions should be smooth (60fps)
- No layout shift during page load
- Sidebar collapse should be fluid

---

## Accessibility Check

### Keyboard Navigation
1. Tab through all interactive elements
2. Verify focus is visible (burgundy ring)
3. Test keyboard shortcuts
4. Ensure modals can be closed with ESC

### Screen Reader (Optional)
1. Use VoiceOver (Mac) or NVDA (Windows)
2. Navigate through page
3. Verify labels are announced
4. Check form field descriptions

---

## Next Steps After Preview

### If Everything Looks Good
1. Test on mobile devices (responsive work pending)
2. Refactor remaining pages (Books, Launches, etc.)
3. Implement advanced components (Tables, Modals)
4. Add micro-interactions and polish

### If Issues Found
1. Document specific issues
2. Check browser console for errors
3. Verify environment variables are set
4. Check that all dependencies are installed

---

## Getting Help

### Check Documentation
- `docs/UI_REFACTOR_SUMMARY.md` - Complete implementation details
- `ui_context.md` - Original design specification
- `docs/GOOGLE_OAUTH_SETUP.md` - OAuth configuration

### Common Commands
```bash
# Restart dev server
npm run dev

# Clear cache and restart
rm -rf .next && npm run dev

# Check for TypeScript errors
npm run type-check

# Run linter
npm run lint
```

---

## Feedback Checklist

When reviewing, consider:
- [ ] Does it feel like a "literary newsroom"?
- [ ] Are the serif headings elegant and readable?
- [ ] Does the burgundy accent feel premium?
- [ ] Are transitions smooth and purposeful?
- [ ] Is the layout clean and organized?
- [ ] Are interactive elements obvious?
- [ ] Does the paper background add warmth?
- [ ] Are numbers easy to read (mono font)?

---

_Ready to preview! Start the dev server and explore the new editorial design._
