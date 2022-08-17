export const tags = [
	"React",
	"Typescript",
	"Tailwind",
	"Next.js",
	"Redis",
	"Redis-Graph",
	"Postgres",
	"Cypher",
	"Headless-UI"
] as const;
export type Tag = typeof tags[number];

export type Headline = "About me" | "Projects" | "Contact";

//use these in js
export const colors = {
	"slate-800": "#1e293b",
	"slate-850": "#192335",
	"slate-900": "#0f172a"
};

export type Project = {
	title: string;
	description: string | JSX.Element;
	tags: Tag[];
	source: string;
	live: string;
	img: string;
};

export const contact = {
	adress: "Hamburg, Germany",
	phone: "+49 1743504268",
	email: "alex.masterOfIceTea@gmail.com",
	github: "https://github.com/AlexMasterOfIceTea",
	linkedIn: "https://www.linkedin.com/in/alexander-schneider-285b80248/"
};

export const projects: Project[] = [
	{
		title: "Financial Landing Page",
		description: `
            A Financial Landing Page for BigFinance.com. Recreated a Design from Dribble using React.js and Tailwindcss
        `,
		tags: ["React", "Tailwind"],
		source: "https://github.com/AlexMasterOfIceTea/FinancialLandingPage",
		live: "https://king-prawn-app-gy878.ondigitalocean.app/",
		img: "Flp-pic.png"
	},
	{
		title: "Chess",
		description: `           
            A Singleplayer chess-app build with Next, Typescript and Tailwindscc. Planned to build a backend using redis pub/sub for multiplayer  
        `,
		tags: ["Next.js", "Tailwind"],
		source: "https://github.com/AlexMasterOfIceTea/chess_web_app",
		live: "https://vocal-rabanadas-dfc8cd.netlify.app",
		img: "Chess-pic.png"
	},
	{
		title: "Weather App",
		description:
			"A simple Weather App build with React, using data from the Open Weather Api. Also my first React Project )",
		tags: ["React"],
		source: "https://github.com/AlexMasterOfIceTea/weather-app",
		live: "https://weather-app-kuuya.ondigitalocean.app/",
		img: "Weather-app-screenshot.png"
	},
	{
		title: "Solitaire Game",
		description: "A birthday present for my Grandpa. Also a great Game",
		tags: ["React"],
		source: "https://github.com/AlexMasterOfIceTea/solitaire",
		live: "https://solitaire-ertux.ondigitalocean.app/",
		img: "Solitaire.png"
	},
	{
		title: "Uphome Constructions",
		description: (
			<>
				A Website for a construction Company. Recreated{" "}
				<a className="underline" href="https://uphome.webflow.io/">
					this
				</a>{" "}
				design found on dribbble
			</>
		),
		tags: ["Next.js", "Tailwind", "Headless-UI", "Typescript"],
		source: "#",
		live: "https://benevolent-churros-b5ddcb.netlify.app",
		img: "uphome.png"
	}
];
