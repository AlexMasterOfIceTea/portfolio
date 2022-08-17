import { off } from "process";
import { FC, useEffect, useState } from "react";

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians)
	};
}

function describeArc(x, y, radius, startAngle, endAngle) {
	var start = polarToCartesian(x, y, radius, endAngle);
	var end = polarToCartesian(x, y, radius, startAngle);

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

	var d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(
		" "
	);

	return d;
}

const proficencyLevels = ["No Proficency", "Elementary", "Limited", "Fluent", "Native"];

const getProficencyLevel = (progress: number) => {
	const n = proficencyLevels.length;
	let index = progress >= 100 ? n - 1 : Math.floor((progress / 100) * (n - 1) + 0.5);
	return proficencyLevels[index];
};

const Tooltip: FC = ({ children }) => (
	<div className="relative overflow-visible rounded-md bg-black px-4 py-2 text-center">
		{children}
		<div className="absolute inset-x-0 -bottom-1 mx-auto h-2 w-2 rotate-45 bg-black"></div>
	</div>
);

export type LanguageData = {
	language: string;
	progress: number;
	color: string;
};

type LanguageProps = {
	data: LanguageData[];
};

export const LanguageLegend: FC<LanguageProps> = ({ data }) => (
	<div>
		{data.map(({ color, language, progress }) => (
			<div className="flex flex-row items-baseline gap-x-6 text-lg">
				<svg width={16} height={16} viewBox="0 0 16 16" strokeWidth={8}>
					<rect x={4} y={4} width={8} height={8} className={color} />
				</svg>
				<h4>
					{language} ·{" "}
					<span className="text-base italic text-gray-400">
						{getProficencyLevel(progress)}
					</span>
				</h4>
			</div>
		))}
	</div>
);

export const LanguageChart: FC<LanguageProps> = ({ data }) => {
	const [hoverState, setHoverState] = useState(-1);
	//total path length for progress = 100%
	const strokeWidth = 40 / data.length;

	return (
		<svg
			data-inviewport="dash-in"
			width={200}
			height={200}
			viewBox="-2 -2 104 104"
			fill="transparent"
			strokeWidth={strokeWidth}
			onMouseLeave={() => setHoverState(-1)}
		>
			<circle cx={50} cy={50} r={50} className="fill-transparent" />
			<g id="chart-dividers" stroke="white" strokeWidth={1}>
				{[0, 12.5, 37.5, 62.5, 87.5]
					.map((v) => 3.6 * v)
					.map((deg) => (
						<line
							transform={`rotate(${deg} 50 50)`}
							className="stroke-slate-200"
							strokeWidth={1}
							x1={50}
							y1={0}
							x2={50}
							y2={-2}
						/>
					))}
			</g>
			<g id="chart-indicators">
				{data.map((data, i) => {
					const r = 45 - i * strokeWidth;
					//approximate a circle or draw an arc
					const path =
						data.progress >= 99
							? describeArc(50, 50, r, 0, 359) + " z"
							: describeArc(50, 50, r, 0, data.progress * 3.6);

					const id = `indicator-${data.language}`;
					return (
						<path
							id={id}
							d={path}
							onMouseEnter={() => setHoverState(i)}
							className={`transition-[filter] duration-500 ${data.color} ${
								hoverState === -1 || hoverState === i ? "" : "brightness-50"
							}`}
						/>
					);
				})}
			</g>
		</svg>
	);
};
