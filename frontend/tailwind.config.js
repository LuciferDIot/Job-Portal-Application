/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    margin: {
      // Add any custom margin values you want to keep here
      'auto': 'auto',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.5rem',
      '6': '2rem',
      '7': '2.5rem',
      '8': '3rem',
      // Set all margins to 0
      '0': '0',
    },
    extend: {
      screens: {
        '2md': '950px'
      },
      maxWidth: {
        '2md': '950px'
      },
    }
  },
  variants: {
    extends: {
      '@variants child': ['& > *'],
      '@variants child-hover': ['& > *:hover'],
    }
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
      addVariant('child-section', '& > section')
      addVariant('child-section-n', '& > section > :nth-child(n)')
      addVariant('child-div-p', '& > div > p')
      addVariant('child-section-line', '& > section > .line-f')
      addVariant('child-img', '& > img')
    }
  ],
}

