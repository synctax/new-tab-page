let palettes = [
	["#ffbc42", "#d81159", "#8f2d56", "#218380", "#73d2de"],
	["#201e1f", "#ff4000", "#faaa8d", "#feefdd", "#50b2c0"],
	[
		"#7400b8",
		"#6930c3",
		"#5e60ce",
		"#5390d9",
		"#4ea8de",
		"#48bfe3",
		"#56cfe1",
		"#64dfdf",
		"#72efdd",
		"#80ffdb",
	],
];

let layers = [];

const MomCircles = (p5) => {
	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.angleMode(p5.DEGREES);

		layers = [];

		var l1 = new Layer(
			p5.min(p5.width, p5.height) * 0.62,
			p5.min(p5.width, p5.height) * 0.99,
			palettes[0]
		);
		var l2 = new Layer(
			p5.min(p5.width, p5.height) * 1.1,
			p5.min(p5.width, p5.height) * 1.4,
			palettes[1]
		);
		var l3 = new Layer(
			p5.min(p5.width, p5.height) * 1.5,
			p5.min(p5.width, p5.height) * 3,
			palettes[2]
		);

		layers.push(l1);
		layers.push(l2);
		layers.push(l3);
	};

	p5.draw = () => {
		p5.background(0);

		for (var i = 0; i < layers.length; i++) {
			let layer = layers[i];
			p5.push();
			p5.translate(p5.width / 2, p5.height / 2);
			//rotate((2*(i%2==0)-1)*millis()/5000);
			layer.render(p5);
			p5.pop();
		}
	};
};

class Layer {
	constructor(r1, r2, colors) {
		this.r1 = r1;
		this.r2 = r2;
		this.colors = colors;
		this.circles = [];
	}

	render(p5) {
		let total = 5;
		let count = 0;
		let attempts = 0;

		while (count < total && this.circles.length <= 2000) {
			let newC = this.newCircle(p5);
			if (newC !== null) {
				this.circles.push(newC);
				count++;
			}
			attempts++;
			if (attempts > 100) {
				p5.noLoop();
				console.log("finished");
				break;
			}
		}

		for (let i = 0; i < this.circles.length; i++) {
			let circl = this.circles[i];
			circl.render(p5);
		}
	}

	newCircle(p5) {
		var r = p5.random(this.r1, this.r2);
		var a = p5.random(-180, 180);
		var x = p5.int((p5.cos(a) * r) / 2);
		var y = p5.int((p5.sin(a) * r) / 2);

		var initR = p5.min(this.r2 - r, r - this.r1) / 2;

		var valid = true;
		for (var i = 0; i < this.circles.length; i++) {
			var circle = this.circles[i];
			var d = p5.dist(x, y, circle.x, circle.y);
			if (d - circle.r < initR) initR = d - circle.r;
			if (d < circle.r) {
				valid = false;
				break;
			}
		}
		if (valid) {
			let c = this.colors[p5.int(p5.random(0, this.colors.length))];
			return new Circle(x, y, initR, c, this.r1, this.r2, p5);
		} else {
			return null;
		}
	}
}

class Circle {
	constructor(x, y, r, c, r1, r2, p5) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = c;
		this.r1 = r1;
		this.r2 = r2;
		this.currentRadius = 1;
	}

	render(p5) {
		this.currentRadius < this.r
			? (this.currentRadius += 5)
			: (this.currentRadius = this.r);
		p5.noStroke();
		p5.fill(this.color);
		p5.ellipse(this.x, this.y, this.currentRadius * 2);
	}
}

export default MomCircles;
