/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        sans: ['Comic Neue', 'cursive'],
        magical: ['Fredoka One', 'cursive'],
        display: ['Comic Neue', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'rotate': 'rotate 20s linear infinite',
        'bounce-slight': 'bounce 1s infinite',
      },
      backgroundImage: {
        'magical-pattern': 'radial-gradient(circle at 50% 50%, rgba(88, 28, 135, 0.15), rgba(15, 23, 42, 0.3))',
      },
      boxShadow: {
        'magical': '0 0 10px rgba(168, 85, 247, 0.3), 0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 10px rgba(168, 85, 247, 0.2)',
      },
    },
  },
  plugins: [],
};