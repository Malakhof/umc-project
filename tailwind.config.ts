import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1f7e9f', hover: '#1a6b86' },
        accent: { DEFAULT: '#2ebc7e' },
        'text-main': '#1a1a1a',
        'text-light': '#666',
        bg: '#f8fafb',
        surface: '#ffffff',
        border: '#e0e0e0',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out',
        slideUp: 'slideUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
