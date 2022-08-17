import { FC } from "react";
import { Project } from "../components/Project";
import { SectionContent, SectionTitle } from "./Section";
import { Divider } from "../components/Divider";
import { Tag } from "../utils/constants";
import { projects } from "../utils/constants";

export const ProjectCollection: FC = () => (
	<section id="projects" className="-mt-4 bg-slate-900">
		<SectionContent>
			<SectionTitle title="Projects" id="projects-header" />
			<Divider />
			<div className="mt-8 columns-sm">
				{projects.map((p) => (
					<Project {...p} />
				))}
			</div>
		</SectionContent>
	</section>
);
