import { progress } from '../utils';
import Rainbow from 'rainbowvis.js';

const defaults = {
	cFrom: '#000000',
	cTo: '#FFFFFF',
	lineHeight: 1,
	horizonX: 0,
	start: 0,
	end: 0,
	slope: 0,
	slopeVariance: 0,
	direction: 1 // 1 || -1
};

export default class SkewedGradient {
	constructor(config) {
		this.config = Object.assign({}, defaults, config);

		this.config.palette = new Rainbow();
		this.config.palette.setSpectrum(this.config.cFrom, this.config.cTo);

		this.generate();

		this.ignoreProps = [
			'label'
		];
	}

	generate() {
		this.shapes = [];
		const {
			slope, slopeVariance
		} = this.config;
		let { horizonX: lastX } = this.config;
		let { start, end, lineHeight } = this.config;
		lineHeight = Math.max(1, lineHeight);

		// @TODO: it's too much, should be width of block;
		let width = this.config.width;

		[start, end] = [Math.min(start, end), Math.max(start, end)];

		// Trying to consolidate the loops
		// if (this.config.direction > 0) {
		// 	[start, end] = [end, start];
		// 	lineHeight *= -1;
		// }

		// @TODO: Refactor
		if (this.config.direction < 0) {
			for (let y = end; y >= start; y -= lineHeight) {
				lastX += ((Math.random() * slopeVariance) + slope);
				
				this.shapes.push({
					x: lastX,
					y,
				});
			}
		} else {
			for (let y = start; y <= end; y += lineHeight) {
				lastX += ((Math.random() * slopeVariance) + slope);

				this.shapes.push({
					x: lastX,
					y,
				});
			}
		}
	}

	render(ctx) {
		const {
			color, width,
		} = this.config;
		let { horizonX: lastX } = this.config;
		let { lineHeight } = this.config;
		lineHeight = Math.max(1, lineHeight);

		for (let i = 0; i < this.shapes.length; ++i) {
			const { x, y } = this.shapes[i];

			ctx.fillStyle = color;
			// @TODO: Gotta watch out that y doesn't overflow the lower boundary
			ctx.fillRect(x, y, width, y - lineHeight);
		}
	}
}