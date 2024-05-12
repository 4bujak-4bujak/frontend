import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'space-purple': '#4E32BB',
        'space-purple-light': '#EDEBF8',
        'space-purple-light-hover': '#E4E0F5',
        'space-purple-light-active': '#C8BFEA',
        'space-purple-normal': '#4E32BB',
        'space-purple-normal-hover': '#462DA8',
        'space-purple-normal-active': '#3E2896',
        'space-purple-dark': '#3B268C',
        'space-purple-dark-hover': '#2F1E70',
        'space-purple-dark-active': '#231654',
        'space-purple-darker': '#1B1241',

        'space-blue': '#3248E2',
        'space-blue-light': '#EBEEFF',
        'space-blue-light-hover': '#E1E5FE',
        'space-blue-light-active': '#C1C9FE',
        'space-blue-normal': '#3850FB',
        'space-blue-normal-hover': '#3248E2',
        'space-blue-normal-active': '#2D40C9',
        'space-blue-dark': '#2A3CBC',
        'space-blue-dark-hover': '#223097',
        'space-blue-dark-active': '#192471',
        'space-blue-darker': '#141C58',

        'space-black': '#212121',

        'gray-50': '#f8f8f8',
        'gray-100': '#f0f0f0',
        'gray-200': '#e6e6e6',
        'gray-300': '#d5d5d5',
        'gray-400': '#b1b1b1',
        'gray-500': '#919191',
        'gray-600': '#696969',
        'gray-700': '#565656',
        'gray-800': '#373737',
        'gray-900': '#212121'
      },

      fontFamily: {
        pretendard: ['var(--font-pretendard)']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
};
export default config;
