import { progress } from '../utils';
import Rainbow from 'rainbowvis.js';
import Building from './building';

const defaults = {
	startX: 0,
	ground: 0,
	width: 20,
	spacing: 20,
	n: 1,
	colorRange: undefined
};

export default class BuildingCollection {
	constructor(config) {
		this.config = Object.assign({}, defaults, config);	
	}

	generate() {
		this.buildings = [];

		const { width, spacing, startX } = this.config;

		for(let i = 0; i < this.config.n; i++) {
			const color = '#' + this.config.colorRange.colorAt(Math.random() * 100 | 0);
			const height = Math.random() * 30 + 50;

			this.buildings.push(new Building({
				color,
				x: startX + spacing * i,
				y: this.config.ground,
				w: width,
				h: height
			}));
		}
	}

	render(ctx) {
		for (let i = 0; i < this.buildings.length; ++i) {
			this.buildings[i].render(ctx);
		}
	}
}