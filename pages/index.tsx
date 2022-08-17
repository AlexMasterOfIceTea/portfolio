import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { Hero } from "../sections/Hero";
import { Navbar } from "../components/Navbar";
import { initCircles } from "../circles";
import { CircleText } from "../circles/CircleText";
import { AboutMe } from "../sections/AboutMe";
import { ProjectCollection } from "../sections/ProjectCollection";
import { Divider } from "../components/Divider";
import { Contact } from "../sections/Contact";
import { initObserver } from "../utils/observer";
import { SectionTransition } from "../sections/Section";
import { colors } from "../utils/constants";
import { CirclesProvider } from "../circles/CirclesProvider";
import { ClipboardProvider } from "../sections/useCopyToClipboard";

const IndexPage = () => {
	useEffect(() => {
		//Start the circles skript
		//initCircles();

		//start observing elements (animate when in view)
		initObserver();
	}, []);

	return (
		<CirclesProvider>
			<ClipboardProvider>
				<Hero />
				<SectionTransition from={colors["slate-800"]} to={colors["slate-850"]} />
				<AboutMe />
				<SectionTransition
					fromTopRight
					from={colors["slate-850"]}
					to={colors["slate-900"]}
				/>
				<ProjectCollection />
				<SectionTransition from={colors["slate-900"]} to={"#000000"} />
				<Contact />
			</ClipboardProvider>
		</CirclesProvider>
	);
};

export default IndexPage;
