/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          bg: '#F6FBF5',
          alt: '#EEF7ED',
          border: '#D9E8D7',
          primary: '#78B890',
          dark: '#38543B',
          deep: '#233826',
          soft: '#D9F2D9',
          leaf: '#5E9E76',
          wood: '#F4ECE1',
          bark: '#8C6239',
          amber: '#FFEAA7',
          gold: '#FFA502'
        }
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ]
      },
      boxShadow: {
        'forest-sm': '0 2px 8px rgba(56, 84, 59, 0.06)',
        'forest-md': '0 8px 24px rgba(56, 84, 59, 0.08)',
        'forest-lg': '0 16px 36px rgba(56, 84, 59, 0.12)',
        'wood': '0 4px 16px rgba(140, 98, 57, 0.12)'
      },
      borderRadius: {
        'leaf': '18px 4px 18px 4px',
        'leaf-reverse': '4px 18px 4px 18px'
      }
    },
  },
  plugins: [],
}
