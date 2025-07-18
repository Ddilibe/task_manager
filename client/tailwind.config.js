// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2563EB", // Tailwind blue-600
                    light: "#3B82F6",   // blue-500
                    dark: "#1E40AF",    // blue-800
                },
                background: "#ffffff",
                foreground: "#f1f5f9",
            },
        },
    },
    plugins: [],
}
