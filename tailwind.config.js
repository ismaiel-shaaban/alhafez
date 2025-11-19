/** @type {import('tailwindcss').Config} */

/*
 * ===================================================
 * IMPORTANT: Colors must match app/globals.css
 * ===================================================
 * 
 * When changing colors, update BOTH:
 * 1. app/globals.css (CSS variables)
 * 2. This file (Tailwind config)
 * 
 * Components use Tailwind classes that reference these colors.
 */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f9',
          100: '#b3e8ed',
          200: '#80d9e1',
          300: '#4dcad5',
          400: '#26bbc8',
          500: '#00acbb',
          600: '#009aa7',
          700: '#006873',
          800: '#004d55',
          900: '#003237',
          950: '#00191c',
        },
        accent: {
          green: '#059669',
          'green-light': '#10b981',
          'green-dark': '#047857',
          gold: '#d97706',
          'gold-light': '#f59e0b',
          amber: '#ea580c',
          blue: '#2563eb',
          purple: '#7c3aed',
        },
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'Arial', 'sans-serif'],
        english: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
