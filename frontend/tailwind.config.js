/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#b8956a',
          light: '#c9a96e',
          dark: '#a68560',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'hero-text': 'heroTextReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
        'hero-image': 'heroImageReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both',
        'subtitle-slide': 'subtitleSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both',
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'mobile-menu-in': 'mobileMenuIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'confirmation-icon': 'confirmationIcon 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        'confirmation-slide': 'confirmationSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(40px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        heroTextReveal: {
          from: { opacity: 0, transform: 'translateY(50px)', filter: 'blur(10px)' },
          to: { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
        },
        heroImageReveal: {
          from: { opacity: 0, transform: 'translateX(80px) scale(0.9)', filter: 'blur(5px)' },
          to: { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0)' },
        },
        subtitleSlide: {
          from: { opacity: 0, transform: 'translateX(-30px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        goldShimmer: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7, textShadow: '0 0 20px rgba(184,149,106,0.5)' },
        },
        mobileMenuIn: {
          from: { opacity: 0, transform: 'translateX(100%)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        confirmationIcon: {
          from: { opacity: 0, transform: 'scale(0)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        confirmationSlide: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
