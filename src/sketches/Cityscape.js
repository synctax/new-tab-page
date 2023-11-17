import crtFrag from "../assets/shaders/crt.frag";
import crtVert from "../assets/shaders/crt.vert";

const STAR_WIDTH = 5;
const STAR_HEIGHT = 4;
const STAR_TWINKLE_AMPLITUDE = 3;
const STAR_TWINKLE_LENGTH = 20;
const STAR_SCROLL_TIME = 10;

const MAX_BUILDINGS = 25;
const MIN_BUILDINGS = 10;

const MAX_BUILDING_WIDTH = 200;
const MIN_BUILDING_WIDTH = 50;

const MAX_BUILDING_HEIGHT = 600;
const MIN_BUILDING_HEIGHT = 100;

const MAX_WINDOW_WIDTH = 30;
const MIN_WINDOW_WIDTH = 5;

const MAX_WINDOW_MARGIN_BASE = 2;
const MIN_WINDOW_MARGIN_BASE = 8;

const MAX_WINDOW_MARGIN_DOM = 15;
const MIN_WINDOW_MARGIN_DOM = 2;

const Cityscape = (p5) => {
	const stars = [];
	const buildings = [];
	let cnv;
	let crtShader;
	let cleanBuffer;
	let blurBuffer;

	p5.preload = () => {
		crtShader = p5.loadShader(crtVert, crtFrag);
	};

	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		cnv = p5.createGraphics(p5.windowWidth, p5.windowHeight);
		blurBuffer = p5.createGraphics(p5.windowWidth, p5.windowHeight);
		cleanBuffer = p5.createGraphics(
			p5.windowWidth,
			p5.windowHeight,
			p5.WEBGL
		);

		//generate stars
		for (let i = 0; i < 2000; i++) {
			const y = p5.min(p5.random(), p5.random()) * p5.height; //min() of two random() creates linear probability distribution
			const x = p5.random() * (p5.width + STAR_WIDTH);

			stars.push([x, y]);
		}

		//generate buildings
		const numBuildings =
			p5.random() * (MAX_BUILDINGS - MIN_BUILDINGS) + MIN_BUILDINGS;
		for (let i = 0; i < numBuildings; i++) {
			let building = {};

			building.x = p5.random() * p5.width;
			building.width =
				p5.random() * (MAX_BUILDING_WIDTH - MIN_BUILDING_WIDTH) +
				MIN_BUILDING_WIDTH;
			building.height =
				p5.random() * (MAX_BUILDING_HEIGHT - MIN_BUILDING_HEIGHT) +
				MIN_BUILDING_HEIGHT;

			building.windowWidth =
				p5.random() * (MAX_WINDOW_WIDTH - MIN_WINDOW_WIDTH) +
				MIN_WINDOW_WIDTH;

			const dominantAxis = p5.random() < 0.5;
			const marginBase =
				p5.random() *
					(MAX_WINDOW_MARGIN_BASE - MIN_WINDOW_MARGIN_BASE) +
				MIN_WINDOW_MARGIN_BASE;
			const marginDominant =
				p5.random() * (MAX_WINDOW_MARGIN_DOM - MIN_WINDOW_MARGIN_DOM) +
				MIN_WINDOW_MARGIN_DOM;

			//BLEH
			building.windowMargins = [];
			building.windowMargins[Number(dominantAxis)] = marginDominant;
			building.windowMargins[Number(!dominantAxis)] = marginBase;

			building.windowHeight =
				(1 - p5.random() * p5.random()) * building.windowWidth;

			buildings.push(building);
		}
	};

	p5.draw = () => {
		cnv.background(0, 0, 0, 50);

		//render stars
		for (let i = 0; i < stars.length; i++) {
			const star = stars[i];
			const starHeight =
				p5.sin((p5.frameCount + i) / STAR_TWINKLE_LENGTH) *
					STAR_TWINKLE_AMPLITUDE +
				STAR_HEIGHT; //star twinkle
			const starX =
				((star[0] + p5.frameCount / STAR_SCROLL_TIME) %
					(p5.width + STAR_WIDTH)) -
				STAR_WIDTH;
			cnv.noStroke();
			cnv.fill(255);
			cnv.rect(starX, star[1], STAR_WIDTH, starHeight);
		}

		//render buildings
		for (let i = 0; i < buildings.length; i++) {
			p5.randomSeed(i);
			const building = buildings[i];
			cnv.noStroke();
			cnv.fill(0, 0, 0);
			cnv.rect(
				building.x,
				p5.height - building.height,
				building.width,
				building.height
			);

			const windowBoundWidth =
				building.windowWidth + building.windowMargins[0] * 2;
			const windowBoundHeight =
				building.windowWidth + building.windowMargins[1] * 2;
			const columns = p5.int(building.width / windowBoundWidth);
			const marginX =
				(p5.fract(building.width / windowBoundWidth) *
					windowBoundWidth) /
				2;

			const rows = p5.int(building.height / windowBoundHeight);
			const marginY =
				(p5.fract(building.height / windowBoundHeight) *
					windowBoundHeight) /
				2;
			for (let j = 0; j < rows; j++) {
				for (let k = 0; k < columns; k++) {
					cnv.fill(255);
					cnv.rect(
						k * windowBoundWidth +
							building.x +
							building.windowMargins[0],
						p5.height -
							(j * windowBoundHeight +
								building.windowMargins[1] +
								marginY),
						building.windowWidth,
						building.windowWidth * (1 - p5.random() * p5.random()),
						3,
						3,
						3,
						3
					);
				}
			}
		}
		cleanBuffer.shader(crtShader);
		crtShader.setUniform("uTexture", cnv);
		crtShader.setUniform("curvature", [4.5, 4.5]);
		crtShader.setUniform("screenResolution", [p5.width / 3, p5.height / 3]);
		crtShader.setUniform("scanLineOpacity", [0.25, 0.25]);
		crtShader.setUniform("vignetteOpacity", 1);
		crtShader.setUniform("brightness", 2);
		crtShader.setUniform("vignetteRoundness", 1);

		cleanBuffer.quad(-1, -1, 1, -1, 1, 1, -1, 1);

		//makeshift bloom. probably excessivley slow
		blurBuffer.drawingContext.filter = `blur(5px)`;
		blurBuffer.image(cleanBuffer, 0, 0);
		p5.image(cleanBuffer, 0, 0);
		p5.tint(255, 80);
		p5.image(blurBuffer, 0, 0);
	};
};

export default Cityscape;
