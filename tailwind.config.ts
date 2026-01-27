import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        espresso: {
          50: '#F5F0EB',
          100: '#E8DFD5',
          200: '#D1C0AC',
          300: '#B09A80',
          400: '#8A7560',
          500: '#6B5E54',
          600: '#4A3728',
          700: '#3B2A1A',
          800: '#2D2016',
          900: '#1A1714',
        },
        burnt: {
          50: '#FFF4ED',
          100: '#FFE4D1',
          200: '#FFC9A3',
          300: '#FFA56B',
          400: '#E07A3E',
          500: '#C4581A',
          600: '#A34512',
          700: '#7D3510',
        },
      },
    },
  },
  plugins: [],
};

export default config;
