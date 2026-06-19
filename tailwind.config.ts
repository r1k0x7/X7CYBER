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
      animation: {
        'pulse-attack': 'pulseAttack 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'glow-intense': 'glowIntense 1.5s ease-in-out infinite',
        'beam-travel': 'beamTravel 1.9s ease-out forwards',
        'impact-ripple': 'impactRipple 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'scan-line': 'scanLine 3s linear infinite',
        'threat-pulse': 'threatPulse 2s ease-in-out infinite',
        'shader-flow': 'shaderFlow 2.5s linear infinite',
        'attack-spark': 'attackSpark 0.8s ease-out forwards',
      },
      keyframes: {
        pulseAttack: {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
        glowIntense: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(255, 59, 78, 0.4), 0 0 20px rgba(58, 160, 255, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 59, 78, 0.8), 0 0 40px rgba(58, 160, 255, 0.4)',
          },
        },
        beamTravel: {
          '0%': {
            strokeDashoffset: '1000',
          },
          '100%': {
            strokeDashoffset: '0',
          },
        },
        impactRipple: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        scanLine: {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
        threatPulse: {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1)',
          },
        },
        shaderFlow: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '100%': {
            backgroundPosition: '100% 50%',
          },
        },
        attackSpark: {
          '0%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translate(var(--tx), var(--ty))) scale(0)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
