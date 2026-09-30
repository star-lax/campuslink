/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          DEFAULT: '#F4F4F0',
          50: '#FAFBF8',
          100: '#F4F4F0',
          200: '#EAEAE4',
          300: '#DFDFD8',
          400: '#CFCFC6',
        },
        charcoal: {
          DEFAULT: '#111111',
          50: '#777777',
          100: '#555555',
          200: '#3D3D3D',
          300: '#2A2A2A',
          400: '#1A1A1A',
          900: '#111111',
        },
        rust: {
          DEFAULT: '#C84B31',
          hover: '#B53E26',
          dark: '#932E19',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px #111111',
        'brutal-sm': '2px 2px 0px 0px #111111',
        'brutal-lg': '6px 6px 0px 0px #111111',
        'brutal-rust': '4px 4px 0px 0px #C84B31',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '0px',
      },
    },
  },
  plugins: [],
}
