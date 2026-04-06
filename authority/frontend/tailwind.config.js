/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#F8FAFC",
        steel: "#FFFFFF",
        panel: "#FFFFFF",
        borderline: "#D9E1E8",
        state: {
          navy: "#0B1F3A",
          slate: "#5B6B79",
          ivory: "#0B1F3A",
          gold: "#c6a96a",
          ink: "#0B1F3A",
        },
      },
      boxShadow: {
        panel: "0 8px 22px rgba(15, 31, 58, 0.08)",
      },
      backgroundImage: {
        "grid-overlay":
          "linear-gradient(rgba(47,62,70,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(47,62,70,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
