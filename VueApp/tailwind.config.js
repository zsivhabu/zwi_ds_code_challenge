/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      colors: {
        "city-blue": "var(--city-blue)",
        "city-green": "var(--city-green)",
        "city-pink": "var(--city-pink)",
        "city-orange": "var(--city-orange)",
        "city-black": "var(--city-black)",
        "city-light-black": "var(--city-light-black)",
        "city-dark-blue": "var(--city-dark-blue)",
      },
    },
  },
  plugins: [],
}

