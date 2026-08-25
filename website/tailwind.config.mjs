import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Primary brand palette ──────────────────────────────────────
        // Deep navy — primary brand surface, headlines, dark sections
        navy: {
          DEFAULT: '#0B132B',
          deep: '#050B1A',
        },
        // Surface tokens — kept under the legacy `cream` name so existing
        // markup keeps working; values are now neutral light-grays that
        // pair cleanly with the new tech palette.
        cream: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
        },
        // Accent — blue/purple gradient pair.
        // `brass` (legacy alias) now resolves to the brand blue;
        // `brass-light` resolves to the brand violet for hover states
        // and gradient companions.
        brass: {
          DEFAULT: '#2563EB',
          light: '#7C3AED',
        },
        // Direct semantic tokens for new components
        electric: '#2563EB',
        violet: '#7C3AED',
        cyan: {
          DEFAULT: '#22D3EE',
        },
        fog: '#E5E7EB',
        ink: '#0B132B',
        slate: {
          DEFAULT: '#475569',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SF Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.75rem, 7vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2rem, 4.2vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.125rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        'prose': '72ch',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(120deg, #2563EB 0%, #7C3AED 60%, #22D3EE 100%)',
        'gradient-mesh': 'radial-gradient(at 18% 12%, rgba(37,99,235,0.18) 0px, transparent 55%), radial-gradient(at 82% 18%, rgba(124,58,237,0.18) 0px, transparent 55%), radial-gradient(at 50% 90%, rgba(34,211,238,0.18) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-blue': '0 12px 48px -16px rgba(37,99,235,0.55)',
        'glow-violet': '0 12px 48px -16px rgba(124,58,237,0.55)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#0B132B',
            '--tw-prose-headings': '#0B132B',
            '--tw-prose-links': '#2563EB',
            '--tw-prose-bold': '#0B132B',
            '--tw-prose-quotes': '#475569',
            '--tw-prose-quote-borders': '#2563EB',
            'h1, h2, h3, h4': {
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            },
            a: {
              textDecoration: 'underline',
              textDecorationColor: '#7C3AED',
              textUnderlineOffset: '0.2em',
              '&:hover': {
                textDecorationColor: '#2563EB',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
