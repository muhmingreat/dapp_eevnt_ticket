/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s ease-in-out infinite', // Custom animation
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)', // Start and end position
          },
          '50%': {
            transform: 'translateY(-10px)', // Bounce up
          },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
