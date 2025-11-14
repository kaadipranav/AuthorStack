import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AuthorStack Design Tokens - "modern literary newsroom + financial command center"
        paper: '#FAF7F1',        // off-white paper background
        ink: '#11110F',          // near-black ink text
        charcoal: '#3C3B39',     // secondary text
        burgundy: '#8A1B2E',     // deep burgundy accent
        'burgundy-dark': '#7a1225', // darker burgundy for contrast (4.5:1 on paper)
        tannin: '#6B3A2E',       // complementary tannin
        forest: '#1F6F4F',       // muted forest green (success)
        amber: '#C79B17',        // desaturated amber (warning)
        danger: '#B33A3A',       // muted red
        surface: '#FFFFFF',      // card surface
        glass: 'rgba(17,17,15,0.03)', // subtle overlay
        stroke: 'rgba(17,17,15,0.06)', // thin rules
        
        // Legacy aliases for compatibility
        primary: '#8A1B2E',
        accent: '#8A1B2E',
        success: '#1F6F4F',
        warning: '#C79B17',
      },
      fontFamily: {
        heading: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['40px', { lineHeight: '1.05', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.12', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.25', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      boxShadow: {
        'elevated': '0 6px 18px rgba(17,17,15,0.06)',
      },
      borderRadius: {
        'card': '8px',
        'modal': '12px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(.2,.9,.2,1)',
      },
      transitionDuration: {
        'fast': '120ms',
        'normal': '200ms',
        'slow': '320ms',
      },
      maxWidth: {
        'content': '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
