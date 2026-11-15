/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1F1219',
          maroon: '#3A1830',
          deep: '#2A1220',
          rose: '#C8325F',
          roseHover: '#A3244B',
          roseLight: '#FCEEF1',
          pinkSubtle: '#FFF7F8',
          pinkBg: '#FFF9FA',
          muted: '#6E5A63',
          border: '#F1E4E8',
          borderDark: '#EADBE0',
          gold: '#FFC439',
          green: '#2E6B45',
          greenLight: '#E4F2E9',
          lightMuted: '#E6D3DA',
          accentPink: '#F4A9C0',
          darkCard: '#52283F'
        }
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'var(--font-anek-bangla)', 'Anek Bangla', 'var(--font-hind-siliguri)', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        display: ['var(--font-bricolage)', 'Bricolage Grotesque', 'var(--font-anek-bangla)', 'Anek Bangla', 'var(--font-hind-siliguri)', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        heading: ['var(--font-bricolage)', 'Bricolage Grotesque', 'var(--font-anek-bangla)', 'Anek Bangla', 'var(--font-hind-siliguri)', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Instrument Serif', 'Georgia', 'serif'],
        bengali: ['var(--font-anek-bangla)', 'Anek Bangla', 'var(--font-hind-siliguri)', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        bangla: ['var(--font-anek-bangla)', 'Anek Bangla', 'var(--font-hind-siliguri)', 'Hind Siliguri', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        'site': '1440px',
        '7xl': '1440px',
      }
    },
  },
  plugins: [],
};

