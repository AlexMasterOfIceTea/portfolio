export type Point = { x: number; y: number };

let count = 0;

export class Vector {
	public x: number;
	public y: number;

	constructor();
	constructor(v?: Point);
	constructor(x?: number, y?: number);

	constructor(x?: number | Point, y?: number) {
		if (x === undefined && y === undefined) {
			this.x = 0;
			this.y = 0;
		} else if (typeof x === "number") {
			this.x = x;
			this.y = y;
		} else {
			const v = x;
			this.x = v.x;
			this.y = v.y;
		}
	}

	add(v: Point): Vector;
	add(x?: number, y?: number): Vector;
	add(x?: number | Point, y?: number) {
		if (typeof x === "number") {
			this.x += x;
			this.y += y;
		} else {
			this.x += x.x;
			this.y += x.y;
		}

		return this;
	}

	subtract(v: Point): Vector;
	subtract(x?: number, y?: number): Vector;
	subtract(x?: number | Point, y?: number) {
		if (typeof x === "number") {
			this.x -= x;
			this.y -= y;
		} else {
			this.x -= x.x;
			this.y -= x.y;
		}
		return this;
	}

	scale(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	//normalize a vector to a unit vector
	norm() {
		this.scale(1 / this.mag());
		return this;
	}

	magSquare() {
		return this.x * this.x + this.y * this.y;
	}

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	setMag(mag: number) {
		return this.scale(mag / this.mag());
	}

	limit(maxMag: number) {
		const mag = this.mag();
		if (maxMag > mag) return this;
		return this.scale(maxMag / mag);
	}

	clone() {
		return new Vector(this);
	}
}
