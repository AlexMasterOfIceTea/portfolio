import {
	MutableRefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from "react";
import { Point, Vector } from "../utils/Vector";
import { Circle } from "./circle";
import { WordData } from "./circleData";
import {
	addRandomOpacity,
	clamp,
	getGlobalCoords,
	perm,
	randomPointOnEdge,
	useThrottle
} from "./utils";

type WordWithCircles = {
	id: string;
	data: WordData;
	element: HTMLElement;
	currentBoundingBox: DOMRect;
	circles: Circle[];
};

export type Dimensions = { width: number; height: number };

/*
	TODO
		-abstract managing code away [X]
			-add floating circles [X]
		-add origin to circle  [X]
		-startAtRandom option   [X]
*/
const circleRadius = 12;
const getRandomRadius = () => circleRadius + Math.random() * 8 - 4;

const normalizeRadius = (word: WordWithCircles) =>
	clamp(0.5, word.currentBoundingBox.width / word.data.width, 1.5);

//updating and rendering code goes here
export const useManager = () => {
	const canvas = useRef<HTMLCanvasElement>();
	const dimensions = useRef<Dimensions>({ width: 0, height: 0 });

	const unboundCircles = useRef<Circle[]>([]);
	const floatingCircles = useRef<Circle[]>([]);
	const floatingAmount = 15;

	const allCircles = useRef<Circle[]>([]);
	const words = useRef<WordWithCircles[]>([]);

	const wordsMoved = useCallback(() => {
		words.current.forEach((word) => {
			word.currentBoundingBox = word.element.getBoundingClientRect();

			perm(word.circles.length).forEach((n, i) => {
				word.circles[i].globalTarget = getGlobalCoords(word.data, word.currentBoundingBox, {
					x: word.data.points[2 * n],
					y: word.data.points[2 * n + 1]
				});
			});
		});
	}, []);

	const resizeListener = useRef(
		useThrottle(() => {
			wordsMoved();

			dimensions.current = {
				width: canvas.current.clientWidth,
				height: canvas.current.clientHeight
			};

			canvas.current.width = dimensions.current.width;
			canvas.current.height = dimensions.current.height;
		}, 200)
	);
	const scrollListener = useRef(useThrottle(wordsMoved, 200));

	useEffect(() => {
		document.addEventListener("scroll", scrollListener.current);
		window.addEventListener("resize", resizeListener.current);
		resizeListener.current();

		return () => {
			document.removeEventListener("scroll", scrollListener.current);
			window.removeEventListener("resize", resizeListener.current);
		};
	}, []);

	const manage = useCallback(() => {
		//kill all invisible circles
		unboundCircles.current = unboundCircles.current.filter((circle) =>
			circle.isVisible(dimensions.current)
		);
		floatingCircles.current = floatingCircles.current.filter((circle) =>
			circle.isVisible(dimensions.current)
		);

		//keep amount of floating circles constant
		while (floatingCircles.current.length < floatingAmount) {
			const r = circleRadius + Math.random() * 20;
			const circle = new Circle(
				randomPointOnEdge(r, dimensions.current),
				r,
				addRandomOpacity("#21AFFF", 32, 64)
			);
			circle.velocity.x = Math.random() * 2 - 1;
			circle.velocity.y = Math.random() * 2 - 1;
			floatingCircles.current.push(circle);
		}

		allCircles.current = [
			...unboundCircles.current,
			...words.current.flatMap((word) => word.circles),
			...floatingCircles.current
		];

		words.current.forEach((word) =>
			word.circles.forEach(
				(circle) =>
					(circle.radius +=
						(normalizeRadius(word) * circle.originalRadius - circle.radius) * 0.02)
			)
		);
	}, []);

	//call on mount, register new circleWord and start managing iT
	//returns a cleanup function
	const registerWord = useCallback(
		(data: WordData, element: HTMLElement, startOnEdge: boolean = false) => {
			const id: string = element.id;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) addWord(data, element, startOnEdge);
					else removeWord(id);
				},
				{
					root: null,
					rootMargin: "0px",
					threshold: 0
				}
			);

			observer.observe(element);
			return () => {
				observer.disconnect();
				removeWord(id);
			};
		},
		[]
	);

	const addWord = useCallback(
		(data: WordData, element: HTMLElement, startOnEdge: boolean = false) => {
			const id = element.id;
			if (words.current.find((word) => word.id === id)) return;
			const circleWord: WordWithCircles = {
				id,
				data,
				element,
				currentBoundingBox: element.getBoundingClientRect(),
				circles: []
			};

			perm(data.points.length / 2).forEach((index) =>
				addCircle(index, circleWord, startOnEdge)
			);
			words.current.push(circleWord);
			wordsMoved();
		},
		[]
	);

	const removeWord = useCallback((id: string) => {
		const index = words.current.findIndex((word) => word.id === id);
		if (index === -1) return;
		const word = words.current[index];
		word.circles.forEach((circle) => {
			unboundCircles.current.push(circle);
			circle.globalTarget.x = Math.random() > 0.5 ? dimensions.current.width + 400 : -400;

			circle.globalTarget.y = Math.random() * dimensions.current.height;
		});
		//unboundCircles.current.push(...word.circles);
		words.current.splice(index, 1);
		wordsMoved();
	}, []);

	const addCircle = useCallback(
		(index: number, word: WordWithCircles, startOnEdge: boolean = false) => {
			if (unboundCircles.current.length) {
				const index = Math.floor(Math.random() * unboundCircles.current.length);
				const circle = unboundCircles.current[index];
				unboundCircles.current.splice(index, 1);
				word.circles.push(circle);
			} else {
				const r = normalizeRadius(word) * getRandomRadius();
				const pos = startOnEdge
					? randomPointOnEdge(r + Math.random() * 200, dimensions.current)
					: getGlobalCoords(word.data, word.currentBoundingBox, {
							x: word.data.points[2 * index],
							y: word.data.points[2 * index + 1]
					  });
				const circle = new Circle(pos, r);
				word.circles.push(circle);
			}
		},
		[]
	);

	const MyCanvas = useCallback(
		() => <canvas ref={canvas} className="pointer-events-none fixed min-h-full w-full" />,
		[]
	);
	return {
		registerWord,
		manage,
		circles: allCircles,
		canvasRef: canvas,
		MyCanvas,
		dimensions
	};
};
