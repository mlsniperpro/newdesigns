/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "Coporativo1":"var(--corporativo1)",
        "Coporativo2":"var(--corporativo2)",
        "Oscuro1":"var(--oscuro1)",
        "Claro1":"var(--claro1)",
        "Blanco":"var(--blanco)",
        "Advertencia":"var(--advertencia)"
      }
    },
  },
  plugins: [],
}
