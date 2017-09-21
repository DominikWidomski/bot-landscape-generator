import Rainbow from 'rainbowvis.js';
import {
	progress,
	distance
} from './utils';
import StarField from './entities/star-field';
import Planet from './entities/planet';
import Clouds from './entities/clouds';
import BuildingCollection from './entities/building-collection';

const canvas = document.querySelector('canvas');
const ctx = window.ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function drawVerticalGradient(cFrom, cTo, from, to, lineStep = 50) {
	const start = Math.min(from, to);
	const end = Math.max(from, to);
	const rainbow = new Rainbow();
	rainbow.setSpectrum(cFrom, cTo);

	for (let y = start; y <= end; y += lineStep) {
		const p = progress(start, end, y) * 100;
		ctx.fillStyle = '#' + rainbow.colourAt(p);
		ctx.fillRect(0, y, canvas.width, y + lineStep);
	}
}

const sunset = drawVerticalGradient.bind(this, '#004655', 'red');
const water = drawVerticalGradient.bind(this, '#F29492', '#114357');

function beach(color, horizonX, start, end, slope = 0, slopeMin = 0) {
	const lineHeight = 10;
	let lastX = horizonX;

	for (let y = start; y <= end; y += lineHeight) {
		ctx.fillStyle = color;
		lastX -= (Math.random() * slope) + slopeMin;
		// @TODO: Gotta watch out that y doesn't overflow the lower boundary
		ctx.fillRect(lastX, y, canvas.width, y + lineHeight);
	}
}

// Going UP!
function mountains(color, horizonX, start, end, slope = 0, slopeMin = 0) {
	const lineHeight = 5;
	let lastX = horizonX;

	for (let y = start; y >= end; y -= lineHeight) {
		ctx.fillStyle = color;
		lastX += (Math.random() * slope) + slopeMin;
		// @TODO: Gotta watch out that y doesn't overflow the lower boundary
		ctx.fillRect(lastX, y, canvas.width, y - lineHeight);
	}
}

const HORIZON_LINE = 0.7;
const HORIZON = canvas.height * HORIZON_LINE;

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

function waterLandscape(horizon) {
	const time = 50 * 5;

	sunset(0, HORIZON, 40);

	clouds.render(ctx);

	mountains('#77567A', canvas.width * 0.6, horizon, canvas.height * 0.2, 10, 5);
	buildingCollection1.render(ctx);

	mountains('#AB4E68', canvas.width * 0.65, horizon, canvas.height * 0.2, 20, 5);
	buildingCollection2.render(ctx);

	mountains('#6E7E85', canvas.width * 0.75, horizon, canvas.height * 0.2, 30, 5);

	starField.renderStars(ctx);
	entities.forEach(entity => {
		entity.renderBody(ctx);
	});
	water(horizon, canvas.height, 25);
	starField.renderReflection(ctx);
	entities.forEach(entity => {
		entity.renderReflection(ctx);
	})

	beach('#BFB48F', canvas.width * 0.8, horizon, canvas.height, 30, 15);
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