import { FC, useEffect } from "react";
import Image from "next/image";
import profilePic from "../public/pp.jpg";
import { CircleText } from "../circles/CircleText";
import { AiOutlineArrowRight } from "react-icons/ai";
import { SectionContent, SectionTransition } from "./Section";
import { DesktopNavbar, MobileNavbar, Navbar } from "../components/Navbar";

const ActionButton: FC = () => {
	return (
		<a href="#about" className="group block max-w-fit">
			<div
				className="
            textborder-orange-300 flex flex-row gap-x-4 rounded-lg border
            px-4 py-6 text-3xl
            transition-[transform_color]
            group-hover:bg-slate-800
            md:text-4xl 
        "
			>
				View my Work
				<div className="hidden md:block">
					<AiOutlineArrowRight
						size="40"
						className="rotate-0 transition-all group-hover:rotate-90"
					/>
				</div>
				<div className="md:hidden">
					<AiOutlineArrowRight
						size="30"
						className="rotate-0 transition-all group-hover:rotate-90"
					/>
				</div>
			</div>
		</a>
	);
};

export const Hero: FC = () => {
	return (
		<section id="hero_section" className="bg-gradient-to-b from-slate-600 to-slate-800">
			<SectionContent className="-mt-12 min-h-[calc(100vh+100px)] items-center gap-y-4">
				<DesktopNavbar />
				<div className="flex w-full flex-row flex-wrap-reverse justify-end">
					<h1 className="mt-0 shrink-0 grow text-center text-3xl md:mt-12 md:text-5xl">
						Hello, I am
						<CircleText
							id="name-header"
							className="ml-4 text-6xl md:ml-8 md:text-8xl"
							startOnEdge
						>
							Alex
						</CircleText>
					</h1>
					<div className="shrink">
						<MobileNavbar />
					</div>
				</div>
				<h2 className="mb-12 font-roboto text-lg italic text-gray-400 md:text-xl">
					Fullstack Web Developer
				</h2>
				<ActionButton />
			</SectionContent>
		</section>
	);
};
