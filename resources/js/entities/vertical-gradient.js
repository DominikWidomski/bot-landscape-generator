import { progress } from '../utils';
import Rainbow from 'rainbowvis.js';

const defaults = {
	cFrom: '#000000',
	cTo: '#FFFFFF',
	start: 0,
	end: 0,
	lineStep: 1,
};

export default class VerticalGradient {
	constructor(config) {
		this.config = Object.assign({}, defaults, config);

		this.config.palette = new Rainbow();
		this.config.palette.setSpectrum(this.config.cFrom, this.config.cTo);
	}

	render(ctx) {
		const { from, to } = this.config;
		const start = Math.min(from, to);
		const end = Math.max(from, to);
		const palette = this.config.palette;
		const lineStep = this.config.lineStep;

		// @TODO: may be too wide
		const width = this.config.width;

		for (let y = start; y <= end; y += lineStep) {
			const p = progress(start, end, y) * 100;
			ctx.fillStyle = '#' + palette.colourAt(p);
			ctx.fillRect(0, y, width, y + lineStep);
		}
	}
}