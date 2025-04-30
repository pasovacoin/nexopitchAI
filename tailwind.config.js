/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', 
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    
    theme: {
      extend: {
        colors: {
          primary: {
            50:  '#e4f4fd',
            100: '#c8e8fb',
            200: '#9fdaf8',
            300: '#75cbf4',
            400: '#4cbdf1',
            500: '#25a2eb', // your main brand colors
            600: '#1c81bc',
            700: '#14608d',
            800: '#0c3f5e',
            900: '#041f2f',
          },
          secondary: {
            50:  '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb', // your secondary color
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
        },
        fontFamily: {
          sans: ['var(--font-geist-sans)', 'sans-serif'],
          mono: ['var(--font-geist-mono)', 'monospace'],
        },
      },
    },
    plugins: [],
  }