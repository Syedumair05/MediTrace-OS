import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bin-yellow': '#EAB308',
        'bin-red': '#EF4444',
        'bin-blue': '#3B82F6',
        'bin-white': '#F8FAFC',
      },
    },
  },
  plugins: [],
};
export default config;
