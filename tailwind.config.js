/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      blue: "#0A122A",
      green: "#698F3F",
      cream: "#FBFAF8",
      beige: "#E7DECD",
      brown: "#804E49",
      orange: "#ef745c",
      purple: "#34073d",
    },
    fontFamily: {
      body: ["Quicksand"],
    },
    keyframes: {
      typing: {
        "0%": {
          width: "0ch",
        },
        "100%": {
          width: "27ch",
        },
      },
      blink: {
        "50%": {
          borderColor: "transparent",
        },
        "100%": {
          borderColor: "white",
        },
      },
    },
    animation: {
      typing: "typing 4s steps(32, end) forwards, blink 1s step-end infinite",
    },
  },
  plugins: [],
};
