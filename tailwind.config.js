/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-hover': '#4f46e5',
        secondary: '#ec4899',
        accent: '#8b5cf6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        'text-main': '#1e293b',
        'text-light': '#64748b',
        border: 'rgba(255, 255, 255, 0.5)',
        'border-solid': '#e2e8f0',
        'surface': 'rgba(255, 255, 255, 0.7)',
        'surface-solid': '#ffffff',
        'surface-hover': 'rgba(255, 255, 255, 0.9)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.05)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
      }
    },
  },
  plugins: [],
}
