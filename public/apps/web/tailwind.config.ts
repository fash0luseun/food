import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware CSS variable aliases
        bg:        'var(--bg)',
        'bg-nav':  'var(--bg-nav)',
        surface:   'var(--surface)',
        's2':      'var(--surface-2)',
        border:    'var(--border)',
        'border-s':'var(--border-subtle)',
        tx:        'var(--text)',
        'tx-2':    'var(--text-2)',
        'tx-3':    'var(--text-3)',
        gold:      'var(--gold)',
        'gold-h':  'var(--gold-hover)',
      },
      keyframes: {
        'orb-1': {
          '0%,100%': { transform: 'translate(0%,0%) scale(1)',       opacity: '0.13' },
          '25%':     { transform: 'translate(6%,-10%) scale(1.12)',   opacity: '0.20' },
          '50%':     { transform: 'translate(12%,-4%) scale(0.93)',   opacity: '0.10' },
          '75%':     { transform: 'translate(3%,7%) scale(1.06)',     opacity: '0.17' },
        },
        'orb-2': {
          '0%,100%': { transform: 'translate(0%,0%) scale(1)',        opacity: '0.09' },
          '30%':     { transform: 'translate(-8%,7%) scale(1.15)',    opacity: '0.16' },
          '60%':     { transform: 'translate(-4%,-8%) scale(0.88)',   opacity: '0.07' },
        },
        'orb-3': {
          '0%,100%': { transform: 'translate(0%,0%) scale(1)',        opacity: '0.07' },
          '40%':     { transform: 'translate(5%,10%) scale(1.10)',    opacity: '0.14' },
          '70%':     { transform: 'translate(-6%,3%) scale(0.92)',    opacity: '0.05' },
        },
        'grid-drift': {
          '0%,100%': { backgroundPosition: '0px 0px' },
          '50%':     { backgroundPosition: '14px 14px' },
        },
      },
      animation: {
        'orb-1': 'orb-1 18s ease-in-out infinite',
        'orb-2': 'orb-2 24s ease-in-out infinite',
        'orb-3': 'orb-3 30s ease-in-out infinite',
        'grid-drift': 'grid-drift 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
