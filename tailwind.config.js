/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    screens: {
      "2xs": "375px",
      xs: "425px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1700px",
    },
    extend: {
      colors: {
        transparent: "transparent",
        woodsmoke: {
          50: "#f7f7f8",
          100: "#f0eef0",
          200: "#dcd9de",
          300: "#bdb8c1",
          400: "#99919f",
          500: "#7d7483",
          600: "#655e6b",
          700: "#534c58",
          800: "#47424a",
          900: "#3e3a40",
          950: "#1b191c",
        },
        white: {
          50: "#ffffff",
          100: "#efefef",
          200: "#dcdcdc",
          300: "#bdbdbd",
          400: "#989898",
          500: "#7c7c7c",
          600: "#656565",
          700: "#525252",
          800: "#464646",
          900: "#3d3d3d",
          950: "#292929",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        "science-blue": {
          50: "#ecfaff",
          100: "#d4f2ff",
          200: "#b2eaff",
          300: "#7de0ff",
          400: "#40cbff",
          500: "#14abff",
          600: "#008aff",
          700: "#0072ff",
          800: "#0062db", // main color
          900: "#084fa0",
          950: "#0a3161",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        "red-damask": {
          50: "#fdf4ef",
          100: "#fae4da",
          200: "#f3c7b5",
          300: "#eba286",
          400: "#e06646",
          500: "#dc4f33",
          600: "#cd3929",
          700: "#ab2a23",
          800: "#892423",
          900: "#6e2120",
          950: "#3b0f11",
        },
      },
      fontFamily: {
        montserrat: ['"Montserrat"', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        contact: "url('./src/assets/images/Contact-Me.png')",
      },
      backgroundPosition: {
        "pos-20": "20% 20%",
        "pos-80": "80% 80%",
      },
      backgroundSize: {
        "size-150": "150% 150%",
      },
      keyframes: {
        "one-time-pulse": {
          "75%": { transform: "scale(1.5)"},
          "75%, 100%": { transform: "scale(2)"},
        },
      },
      animation: {
        "one-time-pulse": "one-time-pulse 1s cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("partNative", "&::part(native)");
      addVariant("partArrow", "&::part(arrow)");
      addVariant("partBackground", "&::part(background)");
      addVariant("partText", "&::part(text)");
      addVariant("partContent", "&::part(content)");
      addVariant("partProgress", "&::part(progress)");
      addVariant("partStream", "&::part(stream)");
      addVariant("partTrack", "&::part(track)");
      addVariant("partContainer", "&::part(container)");
      addVariant("partScroll", "&::part(scroll)");
      addVariant("partSeparator", "&::part(separator)");
      addVariant("partIcon", "&::part(icon)");
      addVariant("partPlaceholder", "&::part(placeholder)");
      addVariant("partMark", "&::part(mark)");
      addVariant("partCollapsedIndicator", "&::part(collapsed-indicator)");
      addVariant("partHeader", "&::part(header)");
    }),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
          width: 0,
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          overflow: "-moz-scrollbars-none",
        },
      };

      addUtilities(newUtilities);
    }),
  ],}

