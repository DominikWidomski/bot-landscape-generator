const Rainbow = require('rainbowvis.js');

const canvas = document.querySelector('canvas');
const ctx = window.ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function progress(from, to, current) {
	return 1 - ((to - current) / (to - from));
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

const sunR = 40;

function drawSun(x, y, horizonY) {
	const r = sunR;
	const lineHeight = 4;
	
	// force to integers to avoid subpixel blending
	x = x | 0;
	y = y | 0;
	
	// ctx.strokeStyle = '#FAFAC8';
	ctx.fillStyle = '#FAFAC8';

	for (let _y = -r; _y < r; _y += lineHeight) {
		const _x = Math.sqrt((r * r) - (_y * _y));

		const left = x - _x;
		const top = y + _y;
		const width = (x + _x) - left;
		const height = lineHeight;
		ctx.fillRect(left, top, width, height);
	}

	ctx.strokeStyle = '#FAAAC8';
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	ctx.stroke();
}

function drawSunReflection(x, y, horizonY) {
	const r = sunR;

	ctx.strokeStyle = '#FAFAC8';
	ctx.fillStyle = '#FAFAC8';

	const numLines = 20;
	y = horizonY + (horizonY - y);

	for (let i = 0; i <= numLines; i++) {
		const _y = -r + (i * 2 * r) / numLines;
		const _x = Math.sqrt((r * r) - (_y * _y)) + (Math.sin(i * 2) * 10) ;

		// Don't draw above horizon
		if (y + _y < horizonY) {
			continue;
		}

		ctx.beginPath();
		ctx.moveTo(x + _x, y + _y);
		ctx.lineTo(x - _x, y + _y);
		ctx.stroke();
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

const stars = [];
function generateStars() {
	for (let i = 0; i < 20; ++i) {
		const x = Math.random() * canvas.width | 0;
		const y = Math.random() * HORIZON | 0;

		stars.push([x, y]);
	}
}

function moveStars() {
	for (let i = 0; i < stars.length; ++i) {
		const [x, y] = stars[i];
		stars[i] = [
			(x + 1) % canvas.width,
			(y + 2) % canvas.height
		];
	}
}

function drawStars() {
	ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

	for (let i = 0; i < stars.length; ++i) {
		const [x, y] = stars[i];

		ctx.fillRect(x, y, 4, 4);
	}
}

function drawStarsReflection(horizon = HORIZON) {
	ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

	for (let i = 0; i < stars.length; ++i) {
		const [x, y] = stars[i];
		// Reflected y coord
		const _y = horizon + (horizon - y);

		// @TODO: Doesn't make them clip, makes them not render completely ofcs
		if (_y > horizon) {
			ctx.fillRect(x, _y, 4, 4);
		}
	}
}

function drawClouds() {
	const palette = new Rainbow();
	palette.setSpectrum('#006655', '#EE6644');

	for (let y = 0; y < HORIZON; ++y) {
		if (Math.random() > 0.9) {
			ctx.fillStyle = '#' + palette.colorAt(progress(0, HORIZON, y) * 100);
			ctx.fillRect(Math.random() * canvas.width | 0, y, canvas.width * 0.4, 10);
		}
	}
}

const HORIZON_LINE = 0.7;
const HORIZON = canvas.height * HORIZON_LINE;

generateStars();

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

	moveStars();
	drawStars();
	const sunY = window.sunY || canvas.height * (Math.random() * 0.5 + 0.2);
	const sunX = window.sunX || canvas.width * (Math.random() * 0.15 + 0.2);
	drawSun(sunX, sunY);
	water(horizon, canvas.height, 25);
	drawStarsReflection();
	drawSunReflection(sunX, sunY, HORIZON);

	beach('#BFB48F', canvas.width * 0.8, horizon, canvas.height, 30, 15);
}

function update() {
	waterLandscape(HORIZON);

	// requestAnimationFrame(update);
}

requestAnimationFrame(update);

document.body.addEventListener('keypress', e => {
	if (e.keyCode === 32) {
		update();
	}
});

let dragging = false;

canvas.addEventListener('mousedown', () => dragging = true);
canvas.addEventListener('mouseup', () => dragging = false);
canvas.addEventListener('mousemove', e => {
	if (dragging) {
		window.sunX = e.offsetX;
		window.sunY = e.offsetY;
		update();
	}
});

document.querySelector('.js-download').addEventListener('click', event => {
	event.target.href = canvas.toDataURL();
	event.target.download = 'download-file.jpg';
});