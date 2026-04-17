/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        wrap: {
          bg: '#0b0b10',
          cream: '#f7efe2',
          coral: '#ff5a5f',
          lime: '#c9ff4d',
          blue: '#4d7cff',
          plum: '#6b2dd1',
          pink: '#ff7ac6',
          sun: '#ffc94d',
        },
      },
    },
  },
  plugins: [],
}
