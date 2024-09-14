/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Add this line for light and dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        default: "1rem",
        md: "2rem",
      }
    },
  },
  plugins: [],
};
