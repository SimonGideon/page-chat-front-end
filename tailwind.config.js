/* eslint-disable no-undef */
// /** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        persianRed: "#d43231",
        bostonBlue: "#2e9cbb",
        downy: "#6dbcd2",
        pampas: " #ebe8e0",
        body_bg: "#f5f8f8",
        sycamore: "#9b823e",
        loblolly: "#b1c2c8",
        nevada: "#69757c",
        shark: "#262828",
        osloGray: "#899092",
        spray: "#8be4f4",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        action: "#ee3730",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "downy-light": "#d1e6e9",
        "downy-dark": "#4a9ab4",
        "downy-darker": "#367a8a",
        "downy-lightest": "#f0f5f6",
        boxShadow: {
          custom:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        },
        bunker: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d9e3",
          300: "#afb9ca",
          400: "#8493ac",
          500: "#647593",
          600: "#505e79",
          700: "#414c63",
          800: "#394253",
          900: "#333a47",
          950: "#111318",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  plugins: [tailwindcssAnimate],
};
