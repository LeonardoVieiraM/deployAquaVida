import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: 'oklch(var(--p) / <alpha-value>)',
				input: 'oklch(var(--s) / <alpha-value>)',
				ring: 'oklch(var(--in) / <alpha-value>)',
				background: 'oklch(var(--b1) / <alpha-value>)',
				foreground: 'oklch(var(--bc) / <alpha-value>)',
				primary: {
					DEFAULT: 'oklch(var(--p) / <alpha-value>)',
					foreground: 'oklch(var(--pc) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'oklch(var(--s) / <alpha-value>)',
					foreground: 'oklch(var(--sc) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'oklch(var(--er) / <alpha-value>)',
					foreground: 'oklch(var(--erc) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'oklch(var(--n) / <alpha-value>)',
					foreground: 'oklch(var(--nc) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'oklch(var(--a) / <alpha-value>)',
					foreground: 'oklch(var(--ac) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'oklch(var(--b2) / <alpha-value>)',
					foreground: 'oklch(var(--bc) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'oklch(var(--n) / <alpha-value>)',
					foreground: 'oklch(var(--nc) / <alpha-value>)'
				},
				sidebar: {
					DEFAULT: 'oklch(var(--b2) / <alpha-value>)',
					foreground: 'oklch(var(--bc) / <alpha-value>)',
					primary: 'oklch(var(--p) / <alpha-value>)',
					'primary-foreground': 'oklch(var(--pc) / <alpha-value>)',
					accent: 'oklch(var(--p) / <alpha-value>)',
					'accent-foreground': 'oklch(var(--pc) / <alpha-value>)',
					border: 'oklch(var(--bc) / <alpha-value>)',
					ring: 'oklch(var(--bc) / <alpha-value>)'
				}
			},
			borderRadius: {
				xl: 'calc(var(--rounded-btn) + 4px)',
				lg: 'var(--rounded-btn)',
				md: 'calc(var(--rounded-btn) - 2px)',
				sm: 'calc(var(--rounded-btn) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' }
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite'
			}
		}
	},
	daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
	plugins: [require('daisyui'),require("@tailwindcss/typography"),tailwindcssAnimate],
};

export default config;
