import Entity from './entity';

const defaults = {
	n: 0,
	width: 0,
	height: 0,
	horizon: 0,
};

export default class StarField {

	constructor(config) {
		this.config = Object.assign({}, defaults, config);

		this.stars = [];

		this.generateStars(this.config.n);
	}

	render(ctx) {

	}

	update() {
		for (let i = 0; i < this.stars.length; ++i) {
			const [x, y] = this.stars[i];
			this.stars[i] = [
				(x + 1) % this.config.width,
				(y + 2) % this.config.height
			];
		}
	}

	generateStars(n) {
		for (let i = 0; i < n; ++i) {
			const x = Math.random() * this.config.width | 0;
			const y = Math.random() * this.config.horizon | 0;

			this.stars.push([x, y]);
		}
	}

	renderStars(ctx) {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

		for (let i = 0; i < this.stars.length; ++i) {
			const [x, y] = this.stars[i];

			ctx.fillRect(x, y, 4, 4);
		}
	}

	renderReflection(ctx, horizon = this.config.horizon) {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

		for (let i = 0; i < this.stars.length; ++i) {
			const [x, y] = this.stars[i];
			// Reflected y coord
			const _y = horizon + (horizon - y);

			// @TODO: Doesn't make them clip, makes them not render completely ofcs
			if (_y > horizon) {
				ctx.fillRect(x, _y, 4, 4);
			}
		}
	}
}