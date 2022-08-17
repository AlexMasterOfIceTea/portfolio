class Circle {
	constructor(oX, oY, w, h, r, c = "#ea580c") {
		this.oX = oX;
		this.oY = oY;
		if (Math.random() < 0.5) {
			this.x = Math.random() < 0.5 ? -0.1 * margin : w + 0.1 * margin;
			this.y = Math.random() * w;
		} else {
			this.y = Math.random() < 0.5 ? -0.1 * margin : h + 0.1 * margin;
			this.x = Math.random() * h;
		}

		this.vX = Math.random() * 4 - 2;
		this.vY = Math.random() * 4 - 2;
		this.aX = 0;
		this.aY = 0;
		this.r = r;
		this.originalR = this.r;
		this.c = c;
		this.targetR = this.r;
	}

	getMass() {
		return this.r * this.r * 0.1;
	}

	applyForce(fx, fy) {
		this.aX += fx / this.getMass();
		this.aY += fy / this.getMass();
	}

	seek(targetX, targetY) {
		if (!targetX || !targetY) return;
		let desiredX = targetX - this.x;
		let desiredY = targetY - this.y;
		const maxSpeed = 15;
		const maxForce = 5;
		const r = 200;

		//set magnitude to maxSpeed
		const mag = Math.sqrt(desiredX * desiredX + desiredY * desiredY);
		let speed = maxSpeed;
		if (mag < 0.0001) return;
		if (mag < r) speed = (mag / r) * maxSpeed;
		desiredX /= mag / speed;
		desiredY /= mag / speed;

		let steerX = desiredX - this.vX;
		let steerY = desiredY - this.vY;
		const forceMag = Math.sqrt(steerX * steerX + steerY * steerY);
		if (forceMag > maxForce) {
			steerX /= forceMag / maxForce;
			steerY /= forceMag / maxForce;
		}

		this.applyForce(steerX, steerY);
	}

	isVisible(w, h) {
		return this.x > -margin && this.x < w + margin && this.y > -margin && this.y < h + margin;
	}

	update() {
		this.x += this.vX;
		this.y += this.vY;
		this.vX += this.aX;
		this.vY += this.aY;
		this.aX = 0;
		this.aY = 0;
		this.targetR = Math.max(this.targetR, 3);
		if (Math.abs(this.targetR - this.r) > 0.001) this.r += (this.targetR - this.r) * 0.02;
	}

	render(ctx) {
		ctx.fillStyle = this.c;
		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
	}

	repell(x, y, r, f) {
		const [dx, dy] = [this.x - x, this.y - y];
		const mag2 = dx * dx + dy * dy;
		if (mag2 < r * r && mag2 > 0.00001) this.applyForce((dx / Math.sqrt(mag2)) * f, (dy / Math.sqrt(mag2)) * f);
	}
}

let circles;
const margin = 400;

export const initCircles = () => {
	circles = {
		Alex: new Array(data.Alex.data.length / 2).fill(null),
		Projects: new Array(data.Projects.data.length / 2).fill(null),
		//Technologies: new Array(data.Technologies.data.length / 2).fill(null),
		Contact: new Array(data.Contact.data.length / 2).fill(null),
		"About me": new Array(data["About me"].data.length / 2).fill(null),
		soonDeleted: [],
		floating: []
	};

	var canvas = document.getElementById("myCanvas");
	const targets = document.getElementsByClassName("target");
	let mouseCoords = {};
	document.onmousemove = (e) =>
		(mouseCoords = {
			x: e.clientX,
			y: e.clientY
		});
	window.setInterval(() => main(canvas, targets, mouseCoords, canvas.clientWidth, canvas.clientHeight), 17);
};

const main = (canvas, targets, mouse, width, height) => {
	const ctx = canvas.getContext("2d");

	if (canvas.clientWidth != canvas.width || canvas.clientHeight != canvas.height) {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	}

	draw(ctx, targets, width, height, mouse);
	createNewCircles(targets, width, height);
};

const draw = (ctx, targets, w, h, mouse) => {
	ctx.clearRect(0, 0, w, h);

	ctx.beginPath();
	for (const key of Object.keys(circles)) {
		const list = circles[key];
		let dx = 0,
			dy = 0,
			scaleX = 1,
			scaleY = 1;
		if (key !== "soonDeleted" && key !== "floating") {
			const target = Object.values(targets).filter((t) => t.innerHTML == key)[0];
			if (!target) continue;
			//translate and scale using domElement as a reference
			const domRect = target.getBoundingClientRect();
			dx = domRect.x;
			dy = domRect.y;

			//only scale using scaleX, as to maintain aspect ratio
			scaleX = domRect.width / data[key].width;
			scaleY = domRect.height / 200;

			//font specific madness
			const fontHeightScale = 1.3;
			const fontHeightOffset = -0.02;

			scaleY *= fontHeightScale;
			dy += 200 * fontHeightOffset;
		}

		for (let i = 0; i < list.length; i++) {
			if (key === "floating") {
				ctx.fill();
				ctx.beginPath();
			}
			const circle = list[i];
			if (!circle) continue;
			circle.update();

			if (!circle.isVisible(w, h)) {
				if (key === "soonDeleted" || key === "floating") list.splice(i, 1);
				else list[i] = null;
			}
			circle.targetR = circle.originalR * Math.min(scaleX, scaleY);
			circle.render(ctx);
			circle.seek(dx + circle.oX * scaleX, dy + circle.oY * scaleY);
			if (mouse) circle.repell(mouse.x, mouse.y, 100, 20);
		}
	}
	ctx.fill();
};

const isVisible = (rect) =>
	rect.right > -margin / 2 &&
	rect.left < window.innerWidth + margin / 2 &&
	rect.bottom > -margin / 2 &&
	rect.top < window.innerHeight + margin / 2;

const createNewCircles = (targets, width, height) => {
	//push all circles of invisible targets into soonDeleted
	for (const target of targets) {
		const key = target.innerHTML;
		if (!isVisible(target.getBoundingClientRect())) {
			for (let i = 0; i < circles[key].length; i++) {
				const circle = circles[key][i];
				if (!circle) continue;
				circles[key][i] = null;
				circle.oY = circle.y < height / 2 ? -2 * margin : height + 2 * margin;
				circles.soonDeleted.push(circle);
			}
		}
	}

	//refill all circles from visible targets,
	//first draw from soonDeleted, then create new circles
	for (const target of targets) {
		const key = target.innerHTML;
		if (isVisible(target.getBoundingClientRect())) {
			for (const i of perm(circles[key].length)) {
				const circle = circles[key][i];
				if (circle) continue;
				if (circles.soonDeleted.length > 0) {
					const newCircle = circles.soonDeleted.pop();
					newCircle.oX = data[key].data[2 * i];
					newCircle.oY = data[key].data[2 * i + 1];
					circles[key][i] = newCircle;
				} else {
					circles[key][i] = new Circle(
						data[key].data[2 * i],
						data[key].data[2 * i + 1],
						width,
						height,
						Math.random() * 5 + 5
					);
				}
			}
		}
	}

	while (circles.floating.length < 15)
		circles.floating.push(
			new Circle(
				undefined,
				undefined,
				width,
				height,
				5 + Math.random() * 25,
				`#21AFFF${Number(Math.floor(Math.random() * 64)).toString(16)}`
			)
		);
};

const perm = (n) => {
	const v = [...Array(n).keys()];
	const out = [];
	while (v.length > 0) {
		const i = Math.floor(Math.random() * v.length);
		out.push(v[i]);
		v.splice(i, 1);
	}
	return out;
};

export const data = {
	Alex: {
		width: 296,
		data: [
			8, 135, 13, 127, 18, 119, 21, 109, 25, 96, 29, 87, 33, 77, 38, 69, 38, 59, 42, 47, 46, 37, 54, 37, 58, 48,
			60, 56, 63, 62, 66, 71, 68, 78, 72, 82, 74, 91, 77, 101, 80, 107, 82, 113, 84, 117, 85, 124, 88, 132, 31,
			103, 38, 105, 47, 103, 53, 104, 60, 104, 67, 104, 123, 32, 125, 42, 123, 51, 123, 61, 123, 68, 123, 78, 123,
			86, 123, 95, 123, 100, 121, 112, 123, 119, 122, 128, 123, 133, 161, 96, 168, 96, 175, 97, 185, 97, 196, 98,
			206, 97, 214, 97, 218, 89, 217, 78, 213, 68, 203, 63, 188, 61, 181, 66, 173, 71, 167, 80, 162, 90, 159, 103,
			159, 111, 164, 120, 169, 124, 172, 131, 182, 136, 193, 137, 200, 134, 209, 135, 219, 132, 248, 58, 255, 64,
			257, 68, 261, 74, 266, 81, 270, 90, 275, 96, 281, 103, 284, 109, 292, 115, 295, 125, 300, 130, 304, 136,
			247, 136, 251, 128, 257, 123, 265, 113, 272, 106, 283, 89, 288, 81, 296, 71, 304, 60
		]
	},
	Projects: {
		width: 559,
		data: [
			22, 38, 22, 45, 21, 55, 21, 63, 21, 72, 19, 82, 22, 87, 22, 97, 24, 103, 23, 110, 22, 119, 19, 129, 19, 134,
			32, 38, 45, 36, 52, 38, 61, 37, 68, 40, 71, 45, 71, 53, 75, 62, 78, 52, 72, 73, 68, 80, 61, 86, 53, 89, 41,
			93, 31, 90, 108, 61, 107, 69, 108, 78, 108, 87, 108, 92, 105, 98, 105, 106, 107, 115, 105, 123, 107, 130,
			107, 138, 116, 75, 125, 67, 132, 62, 141, 61, 177, 68, 169, 75, 162, 82, 162, 92, 162, 99, 161, 110, 166,
			117, 168, 124, 174, 129, 181, 132, 190, 137, 199, 131, 211, 127, 219, 113, 204, 136, 222, 101, 223, 90, 220,
			77, 213, 67, 203, 63, 194, 62, 183, 63, 218, 119, 255, 28, 257, 38, 263, 30, 260, 64, 260, 70, 260, 77, 260,
			85, 258, 94, 257, 102, 258, 110, 258, 117, 258, 124, 256, 133, 259, 139, 259, 147, 259, 158, 252, 163, 245,
			165, 237, 163, 296, 96, 309, 97, 316, 96, 323, 97, 332, 96, 337, 95, 348, 99, 358, 96, 360, 87, 354, 78,
			349, 67, 340, 60, 330, 59, 319, 62, 310, 66, 305, 73, 300, 82, 296, 90, 297, 102, 297, 109, 297, 120, 302,
			124, 309, 131, 318, 133, 325, 134, 334, 137, 343, 135, 351, 134, 357, 130, 443, 69, 436, 66, 425, 64, 412,
			63, 405, 68, 400, 73, 393, 78, 390, 86, 390, 95, 390, 102, 392, 111, 394, 118, 397, 124, 401, 129, 408, 132,
			415, 136, 423, 137, 432, 134, 442, 128, 462, 65, 468, 65, 477, 64, 485, 63, 492, 64, 501, 63, 473, 38, 475,
			48, 475, 55, 473, 62, 474, 72, 473, 80, 473, 89, 473, 96, 472, 103, 472, 113, 474, 120, 474, 128, 477, 132,
			485, 136, 496, 139, 505, 134, 578, 66, 568, 63, 559, 61, 550, 60, 537, 65, 530, 72, 530, 79, 530, 89, 536,
			92, 548, 94, 553, 96, 562, 101, 574, 105, 575, 112, 575, 122, 571, 130, 562, 135, 553, 139, 542, 139, 529,
			133
		]
	},
	Technologies: {
		width: 949,
		data: [
			1, 37, 8, 36, 17, 36, 27, 36, 35, 36, 44, 37, 54, 37, 62, 37, 69, 37, 81, 37, 89, 37, 45, 45, 45, 55, 46,
			64, 46, 71, 45, 82, 45, 89, 46, 98, 45, 106, 45, 115, 46, 124, 47, 132, 47, 138, 84, 95, 92, 95, 103, 96,
			115, 96, 126, 96, 136, 96, 146, 95, 146, 87, 141, 78, 134, 69, 127, 61, 114, 61, 102, 63, 95, 69, 87, 76,
			85, 85, 81, 101, 83, 110, 86, 118, 93, 127, 101, 133, 110, 137, 120, 137, 127, 135, 138, 133, 143, 128, 228,
			69, 219, 63, 211, 62, 200, 62, 190, 65, 184, 72, 179, 78, 175, 87, 175, 97, 175, 104, 175, 113, 177, 118,
			182, 124, 189, 129, 197, 134, 207, 136, 218, 134, 228, 130, 261, 29, 260, 37, 260, 43, 263, 55, 260, 66,
			262, 77, 260, 88, 260, 95, 260, 103, 260, 115, 260, 123, 260, 131, 270, 71, 279, 63, 287, 61, 297, 62, 304,
			65, 310, 70, 317, 80, 319, 89, 319, 99, 317, 108, 317, 116, 316, 129, 316, 135, 355, 61, 355, 68, 356, 74,
			356, 82, 357, 89, 357, 98, 357, 107, 355, 117, 357, 124, 357, 132, 365, 72, 370, 69, 377, 63, 387, 64, 394,
			64, 403, 68, 408, 74, 411, 84, 411, 94, 411, 103, 411, 112, 411, 123, 412, 132, 474, 62, 467, 64, 459, 66,
			453, 72, 449, 80, 445, 90, 446, 99, 449, 110, 450, 119, 457, 127, 466, 133, 473, 136, 485, 133, 494, 128,
			502, 118, 507, 107, 510, 96, 506, 84, 502, 72, 494, 66, 483, 62, 543, 28, 544, 37, 544, 45, 544, 53, 544,
			61, 544, 69, 543, 76, 543, 88, 545, 94, 544, 103, 543, 114, 545, 124, 545, 134, 613, 61, 603, 61, 594, 66,
			587, 71, 582, 81, 581, 91, 581, 100, 581, 109, 582, 114, 586, 122, 591, 127, 594, 132, 603, 134, 612, 136,
			620, 136, 628, 129, 636, 121, 637, 111, 639, 99, 639, 88, 637, 79, 630, 69, 623, 63, 726, 75, 718, 68, 709,
			61, 696, 61, 685, 65, 679, 72, 674, 82, 671, 95, 673, 106, 676, 119, 685, 128, 699, 133, 712, 130, 723, 121,
			727, 109, 733, 99, 733, 87, 733, 62, 733, 55, 735, 72, 732, 106, 732, 120, 729, 131, 731, 139, 729, 151,
			721, 160, 713, 163, 701, 164, 690, 163, 679, 158, 771, 61, 771, 73, 772, 81, 771, 90, 773, 97, 771, 104,
			771, 111, 770, 120, 771, 126, 771, 135, 768, 30, 774, 38, 778, 27, 809, 98, 817, 97, 827, 96, 836, 99, 847,
			96, 857, 95, 869, 96, 870, 87, 868, 77, 863, 68, 854, 62, 845, 62, 832, 62, 822, 65, 815, 73, 809, 81, 809,
			89, 808, 108, 810, 116, 816, 124, 823, 129, 831, 133, 838, 136, 849, 136, 860, 135, 869, 129, 950, 66, 943,
			64, 929, 62, 918, 62, 908, 67, 900, 76, 902, 86, 911, 94, 923, 99, 935, 99, 942, 104, 950, 116, 947, 124,
			939, 131, 930, 137, 920, 139, 910, 136, 898, 129
		]
	},
	"About me": {
		width: 710,
		data: [
			8, 133, 11, 123, 17, 113, 21, 104, 27, 93, 31, 82, 34, 72, 39, 60, 40, 50, 48, 37, 54, 38, 58, 46, 63, 56,
			63, 65, 68, 72, 72, 79, 73, 87, 77, 97, 81, 105, 83, 115, 88, 124, 91, 133, 32, 103, 41, 105, 49, 104, 60,
			105, 69, 105, 123, 27, 122, 38, 122, 45, 123, 52, 123, 61, 123, 70, 122, 81, 122, 88, 122, 97, 121, 104,
			121, 111, 123, 121, 123, 129, 121, 135, 132, 121, 137, 130, 145, 133, 158, 135, 168, 132, 176, 123, 182,
			110, 183, 98, 182, 84, 177, 74, 170, 66, 160, 62, 148, 60, 138, 65, 130, 73, 246, 62, 233, 61, 225, 67, 218,
			75, 214, 87, 212, 93, 212, 103, 215, 113, 217, 121, 225, 129, 237, 134, 252, 134, 262, 127, 270, 118, 274,
			107, 276, 94, 274, 83, 269, 75, 262, 66, 253, 61, 309, 60, 307, 65, 309, 76, 309, 87, 310, 95, 310, 103,
			310, 112, 310, 121, 315, 130, 323, 133, 335, 135, 348, 129, 359, 122, 362, 112, 366, 100, 366, 86, 366, 77,
			366, 65, 367, 127, 366, 137, 367, 107, 404, 37, 406, 47, 406, 57, 406, 65, 404, 75, 406, 86, 406, 95, 404,
			103, 406, 114, 406, 124, 411, 130, 422, 134, 431, 130, 394, 60, 414, 61, 425, 61, 433, 61, 512, 61, 513, 71,
			512, 81, 512, 87, 512, 97, 511, 106, 511, 113, 512, 122, 513, 131, 513, 136, 521, 70, 529, 65, 540, 62, 550,
			62, 559, 70, 565, 78, 565, 89, 565, 99, 563, 107, 563, 117, 566, 128, 566, 135, 574, 74, 581, 67, 592, 64,
			603, 63, 611, 67, 614, 74, 617, 85, 616, 92, 619, 102, 617, 111, 617, 117, 616, 126, 616, 135, 658, 98, 667,
			98, 677, 98, 688, 97, 700, 97, 707, 98, 718, 97, 717, 87, 712, 75, 701, 68, 691, 62, 679, 62, 669, 64, 662,
			71, 656, 82, 655, 90, 651, 105, 654, 115, 658, 121, 665, 127, 671, 132, 680, 136, 690, 135, 702, 135, 711,
			133, 716, 126
		]
	},
	Contact: {
		width: 558,
		data: [
			96, 126, 88, 132, 73, 139, 52, 139, 63, 137, 42, 129, 29, 123, 21, 114, 19, 104, 19, 89, 17, 73, 24, 54, 42,
			44, 56, 37, 78, 32, 88, 42, 64, 31, 32, 42, 41, 31, 19, 61, 18, 85, 16, 109, 51, 28, 82, 42, 36, 128, 155,
			58, 141, 64, 134, 68, 128, 71, 120, 82, 120, 94, 118, 111, 122, 119, 127, 124, 137, 133, 116, 102, 151, 138,
			160, 134, 178, 126, 177, 116, 181, 101, 181, 87, 174, 77, 173, 68, 162, 64, 182, 106, 166, 131, 217, 62,
			216, 72, 216, 78, 219, 91, 217, 99, 218, 112, 218, 119, 218, 129, 216, 137, 225, 76, 235, 64, 245, 61, 257,
			62, 266, 70, 270, 77, 272, 90, 276, 101, 274, 109, 274, 119, 274, 128, 276, 136, 311, 39, 312, 51, 312, 63,
			312, 71, 312, 81, 310, 98, 313, 91, 315, 106, 314, 117, 314, 124, 321, 128, 331, 137, 341, 136, 322, 64,
			334, 62, 344, 63, 299, 59, 367, 64, 374, 64, 393, 61, 388, 61, 402, 62, 415, 68, 419, 79, 421, 86, 427, 98,
			423, 109, 423, 119, 425, 128, 424, 136, 412, 122, 397, 136, 405, 131, 388, 136, 378, 130, 368, 123, 366,
			115, 368, 106, 380, 95, 395, 90, 411, 93, 371, 95, 514, 68, 503, 64, 489, 62, 474, 62, 464, 73, 460, 80,
			458, 88, 454, 98, 457, 108, 462, 116, 468, 124, 474, 130, 483, 137, 494, 137, 507, 134, 545, 37, 545, 49,
			546, 59, 559, 62, 572, 64, 536, 63, 547, 67, 547, 79, 545, 88, 545, 96, 544, 108, 548, 123, 552, 130, 560,
			135, 574, 136, 546, 115
		]
	}
};
