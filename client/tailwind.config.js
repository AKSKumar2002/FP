/** @type {import('tailwindcss').Config} */
module.exports = {
    // Enable dark mode via class strategy
    darkMode: 'class',
  
    // Scan these files for Tailwind classes
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html',
    ],
  
    theme: {
      extend: {
        colors: {
          primary: '#4CAF50',           // Custom green
          'primary-dull': '#3e9441',    // Slightly darker green
        },
        borderRadius: {
          full: '9999px',               // For fully rounded pills
        },
        boxShadow: {
          glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
        backdropBlur: {
          sm: '4px',
          md: '8px',
          lg: '12px',
          xl: '20px',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'], // Optional: replace with your desired font
        },
      },
    },
  
    plugins: [],
  }
  