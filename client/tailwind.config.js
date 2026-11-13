/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // --- Simple Professional Color Palette ---
      colors: {
        white: '#ffffff',
        dark: '#222222',
        lightGrey: '#f4f4f4',
        borderGrey: '#dddddd',
        blue: {
          DEFAULT: '#2563eb',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        brand: {
          50:  '#f4f4f4',
          100: '#f4f4f4',
          200: '#dddddd',
          300: '#cccccc',
          400: '#999999',
          500: '#2563eb',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#222222',
          900: '#222222',
        },
      },

      // --- Typography ---
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },

      // --- Content max-widths ---
      maxWidth: {
        content: '1280px',
        article: '780px',
      },

      // --- Reading rhythm spacing ---
      lineHeight: {
        relaxed: '1.75',
        loose: '2',
      },

      // --- Subtle, Non-Flashy Shadows ---
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
      },
    },
  },

  plugins: [],
};
