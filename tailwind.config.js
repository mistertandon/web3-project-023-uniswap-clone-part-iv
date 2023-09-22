/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
    visibility: false,
  },
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      container: {
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
          "3xl": "1940px",
        },
      },
      colors: {
        primary: "#4c51bf",
        secondary: "#8f9094",
      },
      fontSize: {
        mini: [
          "10px",
          {
            lineHeight: "1rem",
          },
        ],
        mini_bold: [
          "0.5rem",
          {
            lineHeight: "1rem",
            fontWeight: 700,
          },
        ],
        xs_bold: [
          "0.75rem",
          {
            lineHeight: "1rem",
            fontWeight: 700,
          },
        ],
        sm_bold: [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            fontWeight: 700,
          },
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
