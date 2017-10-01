import { progress } from '../utils';
import Rainbow from 'rainbowvis.js';
import Building from './building';

// @TODO: Have Color that can be a prop and that can validate input
function isValidHex(color) {
	const chars = '0123456789ABCDEF';
	const lengths = '6';

	const l = color.replace(/^#/, '').toUpperCase().split('').filter(char => {
		return chars.includes(char);
	}).join('').length;

	return lengths.includes(l);
}

const defaults = {
	colorFrom: '#000000',
	colorTo: '#FFFFFF',
	ground: 0,
	n: 1,
	spacing: 20,
	startX: 0,
	width: 20,
};

export default class BuildingCollection {
	constructor(config) {
		this.config = Object.assign({}, defaults, config);	

		this.config.colorRange = new Rainbow();
		this.config.colorRange.setSpectrum(this.config.colorFrom, this.config.colorTo);	
	}

	/**
	 * Is the new value acceptable
	 *
	 * @param {String} prop
	 * @param {String} oldVal
	 * @param {String} newVal
	 *
	 * @return {[type]}
	 */
	onPreChange(prop, oldVal, newVal) {
		if (prop === 'colorTo' || prop === 'colorFrom') {
			return isValidHex(newVal);
		}
		
		return true;
	}

	onPostChange(prop, oldVal, newVal) {
		if (prop === 'colorTo' || prop === 'colorFrom') {
			this.config.colorRange.setSpectrum(this.config.colorFrom, this.config.colorTo);
		}
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