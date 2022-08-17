import { FC } from "react";

const Tooltip: FC = ({ children }) => (
	<div className="relative overflow-visible rounded-md bg-black px-4 py-2 text-center">
		{children}
		<div className="absolute inset-x-0 -bottom-1 mx-auto h-2 w-2 rotate-45 bg-black"></div>
	</div>
);

export type TechnologyData = { name: string; progress: number };

export type TechnologyChartProps = TechnologyData & { scale: string[] };

export const TechnologyChart: FC<TechnologyChartProps> = ({ name, progress, scale }) => {
	let index =
		progress >= 100
			? scale.length - 1
			: Math.floor((progress / 100) * (scale.length - 1) + 0.5);
	const level = scale[index];

	return (
		<div className="group relative h-8 w-full">
			<h3 className="absolute inset-y-auto left-2 z-10 inline-block text-lg font-medium text-black">
				{name}
			</h3>
			<div className="absolute inset-0 flex h-full w-full flex-row justify-around">
				{scale.map((_, i) =>
					!i ? null : <div className="-mt-1 h-[calc(100%+8px)] w-[1px] bg-white"></div>
				)}
			</div>
			<div className="absolute inset-0 h-full w-full overflow-hidden rounded-md bg-slate-700">
				<div
					data-inviewport="scale-in-ltr"
					style={{ width: progress + "%" }}
					className="absolute inset-0 h-full rounded-l-md bg-orange-500 duration-1000"
				></div>
			</div>
			<div className="absolute inset-x-0 top-0 mx-auto max-w-min opacity-0 transition-all duration-300 group-hover:-top-8 group-hover:opacity-100">
				<Tooltip>{level}</Tooltip>
			</div>
		</div>
	);
};
