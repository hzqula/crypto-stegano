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

        secBlue: "#00CCDD",
        secPurple: "#B100DD",
        background: "#111111",
      },
    },
  },
  plugins: [],
};
