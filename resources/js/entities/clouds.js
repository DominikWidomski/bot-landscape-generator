import { progress } from '../utils';
import Rainbow from 'rainbowvis.js';

export default class Clouds {
	constructor(config) {
		this.config = Object.assign({}, config);

		this.palette = new Rainbow();
		this.palette.setSpectrum('#006655', '#EE6644');

		this.generate();
	}

	generate() {
		this.shapes = [];

		for (let y = 0; y < this.config.horizon; ++y) {
			if (Math.random() > 0.95) {
				const x = Math.random() * this.config.width | 0;
				const fill = '#' + this.palette.colorAt(progress(0, this.config.horizon, y) * 100);
				const w = Math.random() * this.config.width * 0.4;
				const h = 10;

				this.shapes.push({
					x, y, w, h, fill
				});

				if (Math.random() > 0.5) {
					const p = progress(0, this.config.horizon, y)
					const fill = '#' + this.palette.colorAt(p * 100 + (100 - (p * 100) * 0.5));

					this.shapes.push({
						x,
						y: y + 6,
						w: Math.random() * this.config.width * 0.4,
						h: 4,
						fill
					});
				}
			}
		}
	}

	render(ctx) {
		for (let i = 0; i < this.shapes.length; ++i) {
			const {x, y, w, h, fill} = this.shapes[i];

			ctx.fillStyle = fill;
			ctx.fillRect(x, y, w, h);
		}
	}
}