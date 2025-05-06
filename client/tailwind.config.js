/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fff8e7",
        "primary-foreground": "#FFFFFF",
        secondary: "#FFD93B",
        "secondary-foreground": "#333333",
        accent: "#FF6F61",
        "accent-foreground": "#FFFFFF",
        background: "#FFF8E7",
      },
    },
  },
  plugins: [],
};
