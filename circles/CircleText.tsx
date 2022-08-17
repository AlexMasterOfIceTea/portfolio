import { FC, useContext, useEffect, useRef } from "react";
import { data } from "./circleData";
import { CirclesContext } from "./CirclesProvider";

export const CircleText: FC<{ id: string; className?: string; startOnEdge?: boolean }> = ({
	id,
	children,
	className = "",
	startOnEdge = false
}) => {
	const { registerWord } = useContext(CirclesContext);
	const ref = useRef<HTMLHeadingElement>();
	useEffect(() => {
		return registerWord(data[children as string], ref.current, startOnEdge);
	}, []);

	return (
		<h3
			id={id}
			ref={ref}
			className={
				"target pointer-events-none inline-block cursor-crosshair select-none text-transparent " +
				className
			}
		>
			{children}
		</h3>
	);
};
