/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warna utama branding
        primary: '#e60000',      // Merah Pertamina
        secondary: '#0073c6',    // Biru Pertamina
        accent: '#00b050',       // Hijau Pertamina
        warning: '#f59e0b',      // Kuning
        danger: '#dc2626',       // Merah tua
        info: '#3b82f6',         // Biru info
        muted: '#6b7280',        // Abu abu
        base: '#f9fafb',         // Background dasar
        card: '#ffffff',

        // Variasi oklch kalau diperlukan
        'primary-light': '#fca5a5',
        'secondary-light': '#93c5fd',
        'accent-light': '#86efac',
      },
      backgroundImage: {
        'login-bg': "url('/image/bg-login-viana.png')",
      },
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        pertamina: {
          primary: "#e60000",
          secondary: "#0073c6",
          accent: "#00b050",
          neutral: "#3d4451",
          "base-100": "#ffffff",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#dc2626",
          hijau: "#abc62b"
        },
      },
    ],
  },
}
