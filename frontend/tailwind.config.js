/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            'red-dark': '#BF3B44',
            'red-mid': '#F3BABD',
            'red-light': '#F4E6E7',
            'green-dark': '#639339',
            'green-mid': '#CBE4B4',
            'green-light': '#E5F0DB',
            'gray-1': '#1B1D1E',
            'gray-2': '#333638',
            'gray-3': '#5C6265',
            'gray-4': '#5C6265',
            'gray-5': '#DDDEDF',
            'gray-6': '#EFF0F0',
            'gray-7': '#FAFAFA',
            'white': '#FFFFFF'
        },
    },
  },
  plugins: [],
}

