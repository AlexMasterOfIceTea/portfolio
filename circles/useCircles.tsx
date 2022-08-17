import { useCallback, useEffect, useRef } from "react";

import { useManager } from "./useManager";
import { clamp, normalizeFactor } from "./utils";

//updating and rendering code goes here
export const useCircles = () => {
	const { circles, manage, registerWord, MyCanvas, canvasRef, dimensions } = useManager();

	const lastUpdateTime = useRef(0);
	const lastScrollTime = useRef(Date.now());
	const scrollEndThreashold = 100;

	const mouse = useRef({ x: 0, y: 0 });
	const millisPerTick = 7;
	const idleThreashold = 3000;

	const touchListener = useCallback((e: TouchEvent) => {
		if (Date.now() - lastScrollTime.current > scrollEndThreashold)
			mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
	}, []);

	useEffect(() => {
		const mouseMoveListener = (e: MouseEvent) => {
			mouse.current = { x: e.clientX, y: e.clientY };
		};

		const touchStartListener = (e: TouchEvent) => {
			if (Date.now() - lastScrollTime.current > scrollEndThreashold) {
				mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
				document.addEventListener("touchmove", touchMoveListener);
			}
		};

		const touchMoveListener = (e: TouchEvent) => {
			if (Date.now() - lastScrollTime.current > scrollEndThreashold)
				mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		};

		const touchEndListener = (e: TouchEvent) => {
			mouse.current = { x: 100000, y: 100000 };
		};

		const scrollListener = () => {
			document.removeEventListener("touchmove", touchListener);
		};

		document.addEventListener("scroll", scrollListener);
		document.addEventListener("touchstart", touchStartListener);
		document.addEventListener("touchmove", touchMoveListener);
		document.addEventListener("touchend", touchEndListener);
		document.addEventListener("mousemove", mouseMoveListener);

		return () => {
			document.removeEventListener("touchmove", touchListener);
		};
	}, []);

	const update = useCallback(() => {
		manage();
		const factor = clamp(0.5, normalizeFactor(dimensions.current), 1.5);
		circles.current.forEach((circle) => {
			circle.repell(mouse.current, 60 * factor, (2 + Math.random() * 8) * factor);
			circle.update(1);
			if (circle.globalTarget) {
				circle.seek(circle.globalTarget, factor);
			}
		});
	}, []);

	const render = useCallback(() => {
		const ctx = canvasRef.current.getContext("2d");
		ctx.clearRect(0, 0, dimensions.current.width, dimensions.current.height);

		let currentColor;
		circles.current.forEach((circle) => {
			if (circle.color !== currentColor) {
				ctx.fill();
				ctx.beginPath();
			}
			circle.render(ctx);
		});
		ctx.fill();
	}, []);

	const gameLoop = useCallback((time: number) => {
		if (time - lastUpdateTime.current > idleThreashold) lastUpdateTime.current = time;
		while (time - lastUpdateTime.current > millisPerTick) {
			update();
			lastUpdateTime.current += millisPerTick;
		}
		render();
		requestAnimationFrame(gameLoop);
	}, []);

	useEffect(() => {
		gameLoop(0);
	}, []);

	return {
		registerWord,
		MyCanvas
	};
};
