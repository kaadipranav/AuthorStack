import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // AuthorStack Design Tokens from UI_CONTEXT.md
      colors: {
        // shadcn/ui semantic colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // AuthorStack brand colors
        paper: '#FAF7F1',
        ink: '#11110F',
        charcoal: '#3C3B39',
        burgundy: '#8A1B2E',
        tannin: '#6B3A2E',
        forest: '#1F6F4F',
        amber: '#C79B17',
        danger: '#B33A3A',
        surface: '#FFFFFF',
        glass: 'rgba(17,17,15,0.03)',
        stroke: 'rgba(17,17,15,0.06)',
      },
      fontFamily: {
        heading: ['Merriweather', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['40px', { lineHeight: '1.05', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.12', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.25', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'elevated': '0 6px 18px rgba(17,17,15,0.06)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.24s cubic-bezier(.2,.9,.2,1)",
      },
      transitionTimingFunction: {
        'authorstack': 'cubic-bezier(.2,.9,.2,1)',
      },
      transitionDuration: {
        'fast': '120ms',
        'normal': '200ms',
        'slow': '320ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
