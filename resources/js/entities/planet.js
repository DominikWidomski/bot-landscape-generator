import Entity from './entity';

const defaults = {
	x: 0,
	y: 0,
	r: 40,
	horizon: 0,
	fill: '#FFF',
};

export default class Planet {

	constructor(config) {
		this.config = Object.assign({}, defaults, config);
	}

	render(ctx) {
	}

	update(config) {
		const {x, y} = config;

		this.x = x;
		this.y = y;
	}

	renderBody(ctx) {
		const lineHeight = 4;
		
		// force to integers to avoid subpixel blending
		const x = this.config.x | 0;
		const y = this.config.y | 0;
		const r = this.config.r;
		
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

		if (this.debug) {
			ctx.strokeStyle = '#FAAAC8';
			ctx.beginPath();
			ctx.arc(x,y,r,0,2*Math.PI);
			ctx.stroke();
		}
	}

	renderReflection(ctx) {
		ctx.strokeStyle = '#FAFAC8';
		ctx.fillStyle = '#FAFAC8';

		const horizonY = this.config.horizon;
		const y = horizonY + (horizonY - this.config.y);
		const r = this.config.r;
		const x = this.config.x;
		const numLines = r / 2;

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
}