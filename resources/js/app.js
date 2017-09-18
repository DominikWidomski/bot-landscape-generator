import Rainbow from 'rainbowvis.js';
import StarField from './entities/star-field';
import Planet from './entities/planet';

const canvas = document.querySelector('canvas');
const ctx = window.ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function progress(from, to, current) {
	return 1 - ((to - current) / (to - from));
}

/**
 * 2D distance
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 *
 * @return {Number}
 */
function distance(x1, y1, x2, y2) {
	const xD = x2 - x1;
	const yD = y2 - y1;

	return Math.sqrt((xD * xD) + (yD * yD));
}

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

function building(color, x, y, w, h) {
	const spacing = 10;
	const size = 5;

	ctx.fillStyle = color;
	ctx.fillRect(x, y - h, w, h);
	ctx.fillStyle = '#F7CFBE';

	for (var _x = 0; _x < w; _x += spacing) {
		for (var _y = 0; _y < h - spacing; _y += spacing) {
			ctx.fillRect(x + _x, y - h + _y, size, size);
		}
	}
}

function drawBuildings(colorRange, startX, n = 1) {
	const width = 20;
	const spacing = 20;

	for(let i = 0; i < n; i++) {
		building(
			'#' + colorRange.colorAt(Math.random() * 100 | 0),
			startX + spacing * i,
			HORIZON,
			width,
			Math.random() * 30 + 50);
	}
}

function drawClouds() {
	const palette = new Rainbow();
	palette.setSpectrum('#006655', '#EE6644');

	for (let y = 0; y < HORIZON; ++y) {
		if (Math.random() > 0.95) {
			const x = Math.random() * canvas.width | 0;

			ctx.fillStyle = '#' + palette.colorAt(progress(0, HORIZON, y) * 100);
			ctx.fillRect(x, y, Math.random() * canvas.width * 0.4, 10);

			if (Math.random() > 0.5) {
				const p = progress(0, HORIZON, y)
				ctx.fillStyle = '#' + palette.colorAt(p * 100 + (100 - (p * 100) * 0.5));
				ctx.fillRect(x, y + 6, Math.random() * canvas.width * 0.4, 4);
			}
		}
	}
}

const HORIZON_LINE = 0.7;
const HORIZON = canvas.height * HORIZON_LINE;


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

const entities = [sun, moon];

function waterLandscape(horizon) {
	const time = 50 * 5;

	sunset(0, HORIZON, 40);

	drawClouds();

	const buildingsColorRange1 = new Rainbow();
	buildingsColorRange1.setSpectrum('#4B6A77', '#A3966B');

	const buildingsColorRange2 = new Rainbow();
	buildingsColorRange2.setSpectrum('#6E7E85', '#BFB48F');

	mountains('#77567A', canvas.width * 0.6, horizon, canvas.height * 0.2, 10, 5);
	drawBuildings(buildingsColorRange1, canvas.width * 0.65, 6);

	mountains('#AB4E68', canvas.width * 0.65, horizon, canvas.height * 0.2, 20, 5);
	drawBuildings(buildingsColorRange2, canvas.width * 0.8, 6);

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