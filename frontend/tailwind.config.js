/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette beige/noir professionnelle
        sand: {
          50: '#fdfbf7',
          100: '#f7f3eb',
          200: '#ede7d7',
          300: '#e3dac3',
          400: '#d4c5a3',
          500: '#c5b083',
          600: '#a89263',
          700: '#8a7447',
          800: '#6d5a33',
          900: '#4a3c22',
        },
        ink: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0a0908',
        },
      },
      borderRadius: {
        'sm': '2px',
        DEFAULT: '3px',
        'md': '4px',
        'lg': '6px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
