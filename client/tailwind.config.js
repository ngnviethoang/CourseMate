/** @type {import('tailwindcss').Config} */

import PrimeUI from 'tailwindcss-primeui';

module.exports = {
  prefix: 'tw-',
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: [PrimeUI]
};

