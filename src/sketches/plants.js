import LSystem from "lindenmayer";

const Plants = (p5) => {
	let ls = new LSystem({
		axiom: "F++F++F",
		productions: { F: "F-F++F-F" },
		finals: {
			"+": () => {
				p5.rotate((Math.PI / 180) * 60);
			},
			"-": () => {
				p5.rotate((Math.PI / 180) * -60);
			},
			F: () => {
				p5.stroke(255);
				p5.line(0, 0, 0, 40 / (ls.iterations + 1));
				p5.translate(0, 40 / (ls.iterations + 1));
			},
		},
	});

	p5.preload = () => {};

	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		ls.iterate(3);
		p5.translate(p5.windowWidth / 2, p5.windowHeight / 4);
		p5.background(0);
		p5.strokeWeight(1);
		ls.final();
	};

	p5.draw = () => {};
};

export default Plants;
