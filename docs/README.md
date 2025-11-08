# AuthorStack

All-in-one SaaS dashboard for indie authors to manage their book business.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Fill in your environment variables in .env.local
# See CONTEX.md for detailed setup instructions
```

### Development

```bash
# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Run linter
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

## 📁 Project Structure

```
authorstack/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   └── auth/              # Authentication pages
│       ├── login/
│       └── signup/
├── components/            # Reusable React components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Skeleton.tsx
│   └── index.ts
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── styles/               # Additional styles (if needed)
├── scripts/              # Build and utility scripts
├── public/               # Static assets
├── .env.local           # Environment variables (gitignored)
├── .env.example         # Environment template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── next.config.js       # Next.js config
├── .eslintrc.json       # ESLint config
├── .prettierrc           # Prettier config
└── CONTEX.md            # Project context & specs
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui patterns
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **State Management:** React Context + TanStack Query
- **Charts:** Recharts
- **Icons:** Lucide React
- **Payments:** Whop
- **Email:** Resend
- **Caching:** Upstash Redis
- **Background Jobs:** Upstash QStash
- **Hosting:** Vercel
- **Monitoring:** Sentry

## 📚 Documentation

- **Project Specs:** See `CONTEX.md` for detailed feature breakdown, database schema, and development workflow
- **Environment Setup:** See `.env.example` for required environment variables
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

## 🔐 Environment Variables

Required environment variables are listed in `.env.example`. Copy this file to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

**Key services to set up:**
- Supabase (database & auth)
- Whop (payments)
- Resend (email)
- Upstash Redis (caching)
- Upstash QStash (background jobs)

## 🎯 Development Workflow

1. **Create feature branch:** `git checkout -b feature/feature-name`
2. **Make changes:** Follow the code style guidelines
3. **Test locally:** `pnpm dev`
4. **Lint & format:** `pnpm lint && pnpm format`
5. **Commit:** Use descriptive commit messages
6. **Push & create PR:** Push to origin and create a pull request

## 📝 Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier (100 char line width)
- **Linting:** ESLint with Next.js rules
- **Components:** Keep under 200 lines, extract reusable logic
- **Naming:** camelCase for functions/variables, PascalCase for components

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push to main
# Configure environment variables in Vercel dashboard
```

### Manual Deployment

```bash
# Build
pnpm build

# Deploy to your hosting provider
```

## 🐛 Troubleshooting

**Port 3000 already in use:**
```bash
pnpm dev -- -p 3001
```

**Module not found errors:**
```bash
rm -rf node_modules .next
pnpm install
```

**Environment variables not loading:**
- Ensure `.env.local` exists in project root
- Restart dev server after updating `.env.local`
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser

## 📞 Support

For issues or questions:
1. Check `CONTEX.md` for project specifications
2. Review Next.js and Supabase documentation
3. Check existing GitHub issues
4. Create a new issue with detailed description

## 📄 License

MIT License - See LICENSE file for details

---

**Ready to build?** Start with `pnpm install && pnpm dev` 🚀
