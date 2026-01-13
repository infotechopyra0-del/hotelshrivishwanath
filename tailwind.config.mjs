/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        varanasi: {
          maroon: '#6B1A1A',
          'maroon-light': '#8B2424',
          'maroon-dark': '#4A0E0E',
          gold: '#E8B923',
          'gold-light': '#F4D96E',
          'gold-dark': '#C89A1A',
          cream: '#FFF8E7',
          'cream-dark': '#F5E6D3',
          brown: '#3E1F0D',
          'brown-light': '#5C2D15',
          silver: '#C0B5A4',
          'ganga-blue': '#2C3E50',
          sacred: '#8B4513',
        },
        luxury: {
          dark: '#1a1a1a',
          gray: '#2d2d2d',
          tan: '#d4c5a9',
          cream: '#f5f1e8',
          brown: '#8b7355',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(232, 185, 35, 0.3), 0 0 40px rgba(232, 185, 35, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(232, 185, 35, 0.5), 0 0 60px rgba(232, 185, 35, 0.2)' 
          },
        },
      },
      backdropBlur: {
        glass: '10px',
      },
      backgroundImage: {
        'ghat-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"ghat\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"%3E%3Cpath d=\"M0 50 Q25 40 50 50 T100 50\" stroke=\"%23E8B92330\" stroke-width=\"0.5\" fill=\"none\"/%3E%3Cpath d=\"M0 30 Q25 20 50 30 T100 30\" stroke=\"%23E8B92320\" stroke-width=\"0.5\" fill=\"none\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100\" height=\"100\" fill=\"%23FFF8E7\" /%3E%3Crect width=\"100\" height=\"100\" fill=\"url(%23ghat)\" /%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}

export default config
