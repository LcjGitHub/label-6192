/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f2d9bd',
          300: '#e8bf94',
          400: '#dc9d66',
          500: '#d18044',
          600: '#c36838',
          700: '#a25130',
          800: '#83432d',
          900: '#6b3828',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
