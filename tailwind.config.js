const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      'dark-primary': '#000',
      'dark-bg': '#121212',
      'white': colors.white,
      'black': colors.black,
      'gray': colors.gray,
      'indigo': colors.indigo,
      'purple': colors.purple,
      'red': colors.red,
      'yellow': colors.amber,
      'fb': '#1877f2',
      'twitter': '#1da1f2',
      'yt': '#ff0000',
      'ig': '#c32aa3',
      'linkedin': '#0a66c2',
      'tiktok': '#010101',
      'telegram': '#0088cc',
      'line': '#0caa41'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
