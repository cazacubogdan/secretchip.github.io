import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#0A9EFC',
        brandPurple: '#680AFC',
        panel: '#0f1625'
      },
      boxShadow: {
        glow: '0 0 50px rgba(10, 158, 252, 0.12)'
      },
      backgroundImage: {
        glow:
          'radial-gradient(circle at 20% 10%, rgba(10,158,252,0.16), transparent 40%), radial-gradient(circle at 80% 15%, rgba(104,10,252,0.16), transparent 30%)'
      }
    }
  },
  plugins: []
} satisfies Config;
