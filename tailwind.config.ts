import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        threat: {
          bg: '#05070d',
          panel: 'rgba(10, 16, 28, 0.72)',
          border: 'rgba(80, 110, 160, 0.25)',
          source: '#ff3b4e',
          target: '#3aa0ff',
          text: '#c7d3e6',
          dim: '#7c8aa5',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
