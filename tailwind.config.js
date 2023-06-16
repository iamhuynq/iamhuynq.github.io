/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        cyan: "#19FFFF",
        black: "#2F2F2F",
      },
      fontFamily: {
        mont: "Montserrat, sans-serif",
        inter: "Inter, sans-serif",
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1700px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
};
