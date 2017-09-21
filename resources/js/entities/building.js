import { progress } from '../utils';
import Rainbow from 'rainbowvis.js';

const defaults = {
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	color: '#000',
	windows: {
		spacing: 10,
		size: 5,
		color: '#F7CFBE'
	}
};

export default class Building {
	constructor(config) {
		this.config = Object.assign({}, defaults, config);
	}

	render(ctx) {
		const {x, y, w, h, color} = this.config;
		const {spacing, size} = this.config.windows;

		ctx.fillStyle = color;
		ctx.fillRect(x, y - h, w, h);
		ctx.fillStyle = this.config.windows.color;

		for (var _x = 0; _x < w; _x += spacing) {
			for (var _y = 0; _y < h - spacing; _y += spacing) {
				ctx.fillRect(x + _x, y - h + _y, size, size);
			}
		}
	}
}