import Rainbow from 'rainbowvis.js';
import {
	progress,
	distance
} from './utils';
import StarField from './entities/star-field';
import Planet from './entities/planet';
import Clouds from './entities/clouds';
import BuildingCollection from './entities/building-collection';
import VerticalGradient from './entities/vertical-gradient';
import SkewedGradient from './entities/skewed-gradient';

const canvas = document.querySelector('canvas');
const ctx = window.ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const HORIZON_LINE = 0.7;
const HORIZON = canvas.height * HORIZON_LINE;

const sunset = new VerticalGradient({
	cFrom: '#004655', cTo: 'red',
	from: 0, to: HORIZON, lineStep: 40,
	width: canvas.width
});
const water = new VerticalGradient({
	cFrom: '#F29492', cTo: '#114357',
	from: HORIZON, to: canvas.height, lineStep: 25,
	width: canvas.width
});

const buildingsColorRange1 = new Rainbow();
buildingsColorRange1.setSpectrum('#4B6A77', '#A3966B');

const buildingsColorRange2 = new Rainbow();
buildingsColorRange2.setSpectrum('#6E7E85', '#BFB48F');

const buildingCollection1 = new BuildingCollection({
	startX: canvas.width * 0.65,
	ground: HORIZON,
	width: 20,
	spacing: 20,
	n: 6,
	colorRange: buildingsColorRange1
});
buildingCollection1.generate();

const buildingCollection2 = new BuildingCollection({
	startX: canvas.width * 0.8,
	ground: HORIZON,
	width: 20,
	spacing: 20,
	n: 6,
	colorRange: buildingsColorRange2
});
buildingCollection2.generate();

const starField = new StarField({
	n: 20,
	width: canvas.width,
	height: canvas.height,
	horizon: HORIZON
});

const sun = new Planet({
	r: 40,
	x: canvas.width * (Math.random() * 0.15 + 0.2),
	y: canvas.height * (Math.random() * 0.5 + 0.2),
	horizon: HORIZON,
});

const moon = new Planet({
	r: 20,
	x: canvas.width * (Math.random() * 0.15 + 0.2),
	y: canvas.height * (Math.random() * 0.5 + 0.2),
	horizon: HORIZON,
});

const clouds = new Clouds({
	width: canvas.width,
	horizon: HORIZON
});

const entities = [sun, moon];

const mountains1 = new SkewedGradient({
	color: '#77567A',
	horizonX: canvas.width * 0.6,
	start: HORIZON,
	end: canvas.height * 0.2,
	slope: 10,
	slopeMin: 5,
	lineHeight: 5,
	width: canvas.width,
	direction: -1
});

const mountains2 = new SkewedGradient({
	color: '#AB4E68',
	horizonX: canvas.width * 0.65,
	start: HORIZON,
	end: canvas.height * 0.2,
	slope: 20,
	slopeMin: 5,
	lineHeight: 5,
	width: canvas.width,
	direction: -1
});

const mountains3 = new SkewedGradient({
	color: '#6E7E85',
	horizonX: canvas.width * 0.75,
	start: HORIZON,
	end: canvas.height * 0.2,
	slope: 30,
	slopeMin: 5,
	lineHeight: 5,
	width: canvas.width,
	direction: -1
});

const beach = new SkewedGradient({
	color: '#BFB48F',
	horizonX: canvas.width * 0.8,
	start: HORIZON,
	end: canvas.height,
	slope: -30,
	slopeMin: -15,
	lineHeight: 10,
	width: canvas.width,
});

const scene = entities.concat([
	beach,
	buildingCollection1,
	buildingCollection2,
	clouds,
	mountains1,
	mountains2,
	mountains3,
	starField,
	sunset,
	water,
]);

function waterLandscape(horizon) {
	sunset.render(ctx);
	starField.renderStars(ctx);

	clouds.render(ctx);

	mountains1.render(ctx);
	buildingCollection1.render(ctx);

	mountains2.render(ctx);
	buildingCollection2.render(ctx);

	mountains3.render(ctx);

	entities.forEach(entity => {
		entity.renderBody(ctx);
	});
	water.render(ctx);
	starField.renderReflection(ctx);
	entities.forEach(entity => {
		entity.renderReflection(ctx);
	})

	beach.render(ctx);
}

function updateScene() {
	starField.update();
}

function renderScene() {
	waterLandscape(HORIZON);

	// requestAnimationFrame(renderScene);
}

requestAnimationFrame(renderScene);

document.body.addEventListener('keypress', e => {
	if (e.keyCode === 32) {
		updateScene();
		renderScene();
	}
});

let dragging = false;
let targetEntity = undefined;

canvas.addEventListener('mousedown', e => {
	for (let i = 0; i < entities.length; ++i) {
		const entity = entities[i];

		if (distance(
			entity.config.x,
			entity.config.y,
			e.offsetX,
			e.offsetY
		) < entity.config.r) {
			targetEntity = entity;
			dragging = true

			return;
		}
	}
});
canvas.addEventListener('mouseup', () => dragging = false);
canvas.addEventListener('mousemove', e => {
	if (dragging && targetEntity) {
		targetEntity.config.x = e.offsetX;
		targetEntity.config.y = e.offsetY;

		renderScene();
	}
});

document.querySelector('.js-download').addEventListener('click', event => {
	event.target.href = canvas.toDataURL();
	event.target.download = 'download-file.jpg';
});