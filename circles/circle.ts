import { Point, Vector } from "../utils/Vector";
import { Dimensions } from "./useManager";

export class Circle {
	globalTarget: Vector;
	position: Vector;
	velocity: Vector;
	acceleration: Vector;
	radius: number;
	originalRadius: number;
	color: string;

	constructor(pos: Point, r: number, c = "#ea580c") {
		this.position = new Vector(pos);
		this.velocity = new Vector();
		this.acceleration = new Vector();
		this.originalRadius = r;
		this.radius = r;
		this.color = c;
	}

	getMass() {
		return this.radius ** 2 * 0.5;
	}

	// a = f/m
	applyForce(force: Vector) {
		this.acceleration.add(force.scale(1 / this.getMass()));
	}

	isVisible({ width, height }: Dimensions) {
		return (
			this.position.x > -this.radius &&
			this.position.x < width + this.radius &&
			this.position.y > -this.radius &&
			this.position.y < height + this.radius
		);
	}

	seek(target: Vector, normalizeFactor: number) {
		const maxSpeed = 7 * normalizeFactor;
		const maxForce = 3 * normalizeFactor;
		const r = 200 * normalizeFactor;

		let desiredVelo = target
			.clone()
			.subtract(this.position)
			.scale(maxSpeed / r)
			.limit(maxSpeed);

		let force = desiredVelo.subtract(this.velocity).limit(maxForce);

		if (force.mag() < 0.0001) return;

		this.applyForce(force);
	}

	// isVisible(w, h) {
	// 	return this.position.x > -margin && this.position.x < w + margin && this.position.y > -margin && this.position.y < h + margin;
	// }

	update(normalizeFactor: number) {
		this.acceleration.scale(normalizeFactor);

		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.acceleration.scale(0);
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color;

		/*
		ctx.fillRect(
			this.position.x - this.radius,
			this.position.y - this.radius,
			2 * this.radius,
			2 * this.radius
		);
		*/
		//ctx.moveTo(this.position.x, this.position.y);
		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
	}

	repell(from: Point, distance: number, force: number) {
		//console.log(x, y);
		const forceDir = this.position.clone().subtract(from);
		const distance2 = forceDir.magSquare();
		if (distance2 < distance * distance) this.applyForce(forceDir.setMag(force));
	}

	repellFromCenter(center: Point) {
		const force = this.position.clone().subtract(center).limit(0.5);
		this.applyForce(force);
	}
}
