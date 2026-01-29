/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0056B8",
          "blue-dark": "#003D85",
          "blue-light": "#0066D9",
        },
        dark: {
          bg: "#0A0A0A",
          card: "#1A1A1A",
          border: "#2A2A2A",
        },
      },
    },
  },
  plugins: [],
};
