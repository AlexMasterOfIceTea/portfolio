import Image from "next/image";
import { Children, FC } from "react";
import { Divider } from "../components/Divider";
import { LanguageChart, LanguageData, LanguageLegend } from "../components/LanguageChart";
import { TechnologyChart, TechnologyData } from "../components/TechnologyChart";
import { SectionContent, SectionTitle, SectionTransition } from "./Section";
import profilePicture from "../public/pp.jpg";

/*
    Hello There
    <p>A bit about myself</p>

    Age, 

    Language skills

    Professional skills

	HTML
	CSS
	JavaScript
	Typescript
	React
	Next
	Node.js
	Postgres
	Redis
	Redis Graph
*/

const languages: LanguageData[] = [
	{
		language: "German",
		progress: 100,
		color: "stroke-green-500"
	},
	{
		language: "English",
		progress: 85,
		color: "stroke-teal-500"
	},
	{
		language: "Russian",
		progress: 80,
		color: "stroke-orange-500"
	},
	{
		language: "Spanish",
		progress: 30,
		color: "stroke-red-500"
	}
];

const technologyScale = ["Beginner", "Intermediate", "Advanced", "Proficient", "Expert"];

const technologies: TechnologyData[] = [
	{
		name: "HTML",
		progress: 80
	},
	{
		name: "CSS",
		progress: 60
	},
	{
		name: "Tailwindcss",
		progress: 95
	},
	{
		name: "Java Script",
		progress: 85
	},
	{
		name: "Typescript",
		progress: 70
	},
	{
		name: "React",
		progress: 75
	},
	{
		name: "Next",
		progress: 60
	},
	{
		name: "Node.js",
		progress: 60
	},
	{
		name: "Postgres",
		progress: 71
	},
	{
		name: "Redis - Core",
		progress: 75
	},
	{
		name: "Redis - Graph",
		progress: 58
	}
];

const SectionWrapper: FC<{ className: string }> = ({ children, className }) => (
	<article className="my-8 break-inside-avoid md:mx-4">
		<div className={"mx-auto max-w-lg rounded-lg " + className}>{children}</div>
	</article>
);

const Profile: FC = () => (
	<SectionWrapper className="bg-cyan-700">
		<Image
			src={profilePicture}
			width="200"
			height="200"
			layout="responsive"
			objectFit="cover"
			className="rounded-t-lg"
		/>
		<div className="mt-2 flex flex-col items-center p-6 text-center">
			<h2 className="text-3xl">Alexander Schneider</h2>
			<p className="text-xl font-light italic">Fullstack Developer</p>
			<a
				href="/lebenslauf.pdf"
				target="_blank"
				className="my-8 block rounded-full bg-orange-500 px-4 py-2 text-center text-xl text-black transition-transform hover:scale-125"
			>
				Download CV
			</a>
		</div>
	</SectionWrapper>
);

const Languages: FC = () => (
	<SectionWrapper className="bg-sky-900 p-6">
		<h2 className="text-center text-3xl ">Languages</h2>
		<div className="mt-8 flex flex-col items-center gap-x-8 md:flex-row">
			<LanguageChart data={languages} />
			<LanguageLegend data={languages} />
		</div>
	</SectionWrapper>
);

const Technologies: FC = () => (
	<SectionWrapper className="bg-cyan-800 p-6">
		<h2 className="text-center text-3xl">Technologies</h2>
		<div className="mt-6 flex flex-col gap-y-2">
			{technologies.map((tech) => (
				<TechnologyChart {...tech} scale={technologyScale} />
			))}
		</div>
	</SectionWrapper>
);

const ParagraphAboutMyself: FC = () => (
	<SectionWrapper className="bg-sky-800 p-6">
		<h2 className="text-center text-4xl text-white">Hello There !</h2>
		<p className="mt-8 text-justify text-lg font-light">
			My Name is Alexander Schneider. I am a self taught Web Developer from Hamburg, Germany.
			I have a passion for implementing Intuitive and beautiful UI, creating animations and
			making scalable Applications. Interested ?
			<a
				className="mt-8 inline-block font-bold underline transition-colors hover:text-orange-500"
				href="mailto:alex.masterOfIcedTea@gmail.com?subject = Job%20Application"
			>
				Let's work together
			</a>
		</p>
	</SectionWrapper>
);

export const AboutMe: FC = () => (
	<section id="about" className="bg-slate-850">
		<SectionContent>
			<SectionTitle title="About me" id="about-header" />
			<Divider ltr />
			<div className="mt-12 columns-1 md:columns-lg">
				<ParagraphAboutMyself />
				<Profile />
				<Languages />
				<Technologies />
			</div>
		</SectionContent>
	</section>
);
