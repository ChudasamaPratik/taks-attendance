/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JS/TS/JSX/TSX files in src folder
  ],
  darkMode: 'class', // Enable dark mode with a class (class toggle)
  theme: {
    extend: {
      colors: {
        // Custom colors for dark theme
        sky: {
          500: '#0ea5e9', // Primary sky blue color for accents, buttons
          600: '#0284c7', // Hover effect for sky blue elements
        },
        gray: {
          100: '#f3f4f6', // Light gray for background or text
          200: '#e5e7eb', // Light gray for borders or muted elements
          300: '#d1d5db', // Medium gray for borders or text
          400: '#9ca3af', // Darker gray for borders or text
          500: '#6b7280', // Main gray text
          600: '#4b5563', // Darker gray text or elements
          700: '#374151', // For dark mode background
          800: '#1f2937', // Darker gray for elements
          900: '#111827', // Dark background
        },
        accent: '#1F4068', // Accent color for buttons or links
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // Default font for a modern UI
        serif: ['Georgia', 'serif'], // Serif font for headings if required
      },
      spacing: {
        '1/2': '50%', // Custom spacing utility for flexible layouts
      },
      boxShadow: {
        'lg': '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)', // Soft shadow for cards
        'md': '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for smaller elements
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Automatically style form elements
  ],
}
