/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
        secondary: '#64748b',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f97316',
        light: '#f8fafc',
        dark: '#0f172a',
      },
    },
  },
  plugins: [],
}