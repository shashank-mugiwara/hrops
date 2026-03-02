/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#1515f9",
        "primary-hover": "#0F62FE", // From Screen 11/13
        "primary-dark": "#0a0abf",
        "background-light": "#f4f7fb",
        "background-dark": "#0f0f23",
        "surface": "#ffffff",
        "surface-dark": "#1a1a2e",
        "text-main": "#161616",
        "text-secondary": "#525252",
        "border-subtle": "#e0e6ed",
        "border-dark": "#2d2d42",
        "success": "#198038",
        "success-bg": "#defbe6",
        "warning": "#b28600",
        "warning-bg": "#fff8e1",
        "error": "#da1e28",
        "error-bg": "#ffd7d9",
      },
      fontFamily: {
        "display": ["IBM Plex Sans", "Inter", "sans-serif"],
        "body": ["IBM Plex Sans", "Inter", "sans-serif"],
        "sans": ["IBM Plex Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        "DEFAULT": "4px",
        "lg": "6px",
        "xl": "8px",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
