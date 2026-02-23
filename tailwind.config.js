/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ダークテーマ（深紺）+ ゴールドアクセント
        'dark-navy': '#0f172a',
        'navy': '#1e293b',
        'light-navy': '#334155',
        'gold': '#f59e0b',
        'gold-light': '#fbbf24',
      },
      fontFamily: {
        serif: ['"Zen Kaku Gothic New"', '"Noto Sans JP"', 'sans-serif'],
        sans: ['Inter', '"Noto Sans JP"', 'sans-serif'],
      },
      animation: {
        'smooth-fade': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
