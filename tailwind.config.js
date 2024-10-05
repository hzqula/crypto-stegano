/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        text: ["Space Grotesk, sans-serif"],
        code: ["IBM Plex Mono, courier new"],
        display: ["Unbounded, sans-serif"],
      },
      colors: {
        primary: "#04e762",
        secBlue: "#0904E7",
        secPurple: "#9104E7",
        background: "#111111",
      },
    },
  },
  plugins: [],
};
