import { useEffect, useRef, useState } from "react";
import { Point, Vector } from "../utils/Vector";
import { Circle } from "./circle";
import { WordData } from "./circleData";
import { Dimensions } from "./useManager";

export const clamp = (lower: number, x: number, upper: number) =>
	Math.max(Math.min(x, upper), lower);

export const perm = (n: number) => {
	const v = Array.from(Array(n).keys());
	const out = [];
	while (v.length > 0) {
		const i = Math.floor(Math.random() * v.length);
		out.push(v[i]);
		v.splice(i, 1);
	}
	return out;
};

export const useThrottle = (cb: (...args: any[]) => any, delay: number) => {
	const lastCall = useRef(0);
	const lastArgs = useRef([]);

	return async (...args: any[]) => {
		const lastCallVar = lastCall.current;
		if (Date.now() - lastCall.current > delay) {
			lastCall.current = Date.now();
			lastArgs.current = args;
			cb(...args);
		}

		await new Promise((res) => setTimeout(res, delay));
		//last function call
		if (lastCallVar === lastCall.current) {
			lastCall.current = Date.now();
			lastArgs.current = args;
			cb(...args);
		}
	};
};

//use forces and velocities relative to vmin
export const normalizeFactor = ({ width, height }: Dimensions) => {
	const out = Math.min(width + height) * 0.001;
	return out;
};

//scale and translate
export const getGlobalCoords = (word: WordData, domRect: DOMRect, local: Point) => {
	let scaleX = 1,
		scaleY = 1;
	let translateX = 0,
		translateY = 0;

	//font specific madness
	const fontHeightScale = 1.3;
	const fontHeightOffset = -0.02;

	translateX = domRect.x;
	translateY = domRect.y;

	scaleX = domRect.width / word.width;
	scaleY = domRect.height / word.height;

	scaleY *= fontHeightScale;
	translateY += domRect.height * fontHeightOffset;

	return new Vector(translateX + local.x * scaleX, translateY + local.y * scaleY);
};

export const addRandomOpacity = (color: string, min: number = 0, max: number = 255) =>
	color + Math.floor(min + Math.random() * (max - min)).toString(16);

export const randomPointOnEdge = (radius: number, { width, height }: Dimensions) => {
	const circumference = 2 * (width + height) + 8 * radius;
	let ind = Math.random() * circumference;
	if (ind < width + 2 * radius) {
		return {
			x: ind - radius,
			y: -radius
		};
	}
	ind -= 2 * radius + width;
	if (ind < height + 2 * radius) {
		return {
			x: width + radius,
			y: ind - radius
		};
	}
	ind -= 2 * radius + height;
	if (ind < width + 2 * radius) {
		return {
			x: ind - radius,
			y: height + radius
		};
	}
	ind -= 2 * radius + width;
	return {
		x: -radius,
		y: ind - radius
	};
};
