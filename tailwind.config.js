/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./circles/**/*.{js,ts,jsx,tsx}",
		"./sections/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			colors: {
				accent: "#F27047",
				slate: {
					850: "#192335"
				}
			},
			keyframes: {
				dash: {
					"100%": { strokeDashoffset: 0 }
				}
			},
			animation: {
				"dash-in": "dash 2s ease-in-out forwards"
			},

			fontFamily: {
				roboto: ["Roboto", "sans-serif"]
			}
		}
	},
	plugins: [require("tailwindcss-scoped-groups")]
};
