import { FC } from "react";
import { Headline } from "../utils/constants";
import { CircleText } from "../circles/CircleText";

export const SectionTransition: FC<{ fromTopRight?: boolean; from: string; to: string }> = ({
	from,
	to,
	fromTopRight = false
}) =>
	fromTopRight ? (
		<svg
			width="100vw"
			height="5vw"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			strokeWidth={0}
			style={{ background: to }}
		>
			<polygon points="0,0 100,0 0,100" style={{ fill: from }} />
		</svg>
	) : (
		<svg
			width="100vw"
			height="5vw"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			strokeWidth={0}
			style={{ background: from }}
		>
			<polygon points="0,0 0,100 100,100" style={{ fill: to }} />
		</svg>
	);

export const SectionTitle: FC<{ title: Headline; id: string }> = ({ title, id }) => (
	<div className="flex justify-center">
		<CircleText id={id} className="text-6xl sm:text-7xl md:text-8xl">
			{title}
		</CircleText>
	</div>
);

export const SectionContent: FC<{ className?: string }> = ({ children, className = "" }) => (
	<div className="relative mx-auto max-w-screen-xl px-4 py-12 font-roboto text-white">
		<div className={"flex flex-col " + className}>{children}</div>
	</div>
);
