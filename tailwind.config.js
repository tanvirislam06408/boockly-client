/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — warm amber/copper, like aged leather and bookstore wood
        brand: {
          50: '#FDF6EE',
          100: '#F9E5CE',
          200: '#F0C99A',
          300: '#E6A864',
          400: '#D8893D',
          500: '#C47225',  // primary
          600: '#A75A1C',
          700: '#8A4518',
          800: '#6E3515',
          900: '#5A2B14',
        },
        // Accent — deep olive/sage, like library cloth bindings
        olive: {
          50: '#F3F6F4',
          100: '#E1E8E2',
          200: '#C4D1C6',
          300: '#9DB4A1',
          400: '#72917A',
          500: '#4F7558',  // accent
          600: '#3D6B4F',
          700: '#315540',
          800: '#2A4435',
          900: '#23382C',
        },
        // Neutral background — warm cream, like aged parchment
        parchment: {
          50: '#FDFBF7',
          100: '#FBF7F0',  // page background
          200: '#F5EDE3',  // card surface
          300: '#E5D9CB',  // borders / dividers
          400: '#CFC0AE',
          500: '#B5A28C',
          600: '#9A8670',
          700: '#7D6B59',
          800: '#6B5C4E',  // secondary text
          900: '#2C1E10',  // primary text
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(44, 30, 16, 0.06), 0 1px 2px rgba(44, 30, 16, 0.04)',
        'card-hover': '0 4px 12px rgba(44, 30, 16, 0.1), 0 2px 4px rgba(44, 30, 16, 0.06)',
        'card-active': '0 8px 24px rgba(44, 30, 16, 0.12), 0 4px 8px rgba(44, 30, 16, 0.06)',
      },
    },
  },
  plugins: [],
}
