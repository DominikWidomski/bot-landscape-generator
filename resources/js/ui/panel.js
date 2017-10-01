function createTextInput() {
	const input = document.createElement('input');
	input.type = 'text';

	return input;
}

function createRangeInput(min = 0, max = 100, step = 0.1) {
	const input = document.createElement('input');
	input.type = 'range';
	input.step = step;
	input.min = min;
	input.max = max;

	return input;
}

function castToTypeOf(value, object) {
	return object.constructor(value);
}

export default class Panel {
	constructor() {
		this.root = document.createElement('div');
		this.root.classList.add('panel');

		document.body.appendChild(this.root);
	}

	init(scene) {
		this.scene = scene;

		for(let entity of this.scene) {
			this.addEntityControlPanel(entity);
		}
	}

	addEntityControlPanel(entity) {
		const name = entity.__proto__.constructor.name;
		const div = document.createElement('div');
		
		div.innerHTML = `
			<div class="element">${name} ("${entity.config.label}")</div>
		`;

		for (let key in entity.config) {
			if (entity.ignoreProps && entity.ignoreProps.includes(key)) {
				continue;
			}

			const control = this.createControlForProp(key, entity.config[key]);

			if (control) {	
				const valueLabel = document.createElement('span');
				valueLabel.innerHTML = entity.config[key];

				control.addEventListener('input', e => {
					const oldValue = entity.config[key];
					const newValue = e.target.value;

					const canChange = (
						entity.onPreChange
						&& entity.onPreChange(key, oldValue, newValue)
						) || false;
					
					if (!canChange) {
						return;
					}
					
					this.onChange(entity, key, oldValue, newValue);
					
					entity.config[key] = castToTypeOf(newValue, entity.config[key]);
					valueLabel.innerHTML = newValue;

					if (entity.onPostChange) {
						entity.onPostChange(key, oldValue, newValue)
					}
				});

				const d = document.createElement('div');
				d.innerHTML = key;
				d.appendChild(control);
				d.appendChild(valueLabel);
				div.firstElementChild.appendChild(d);
			}
		}

		this.root.appendChild(div.firstElementChild);
	}

	createControlForProp(key, value, valueConf = {}) {
		const type = value.__proto__.constructor.name;
		let control;

		switch (type) {
			case "Number":
				control = createRangeInput(Math.min(0, value), Math.max(100, value));

				break;
			case "String":
				control = createTextInput();

				break;
			default:
				console.warn(`Control for type ${type} not supported.`);
				break;
		}

		if (control) {
			control.value = value;
		}

		return control;
	}

	on(eventType, handler) {
		this.eventHandlers = this.eventHandlers || [];
		this.eventHandlers[eventType] = this.eventHandlers[eventType] || [];

		this.eventHandlers[eventType].push(handler);
	}

	onChange(entity, prop, oldVal, newVal) {
		for (let handler of this.eventHandlers['change']) {
			handler.call(this, ...arguments);
		}
	}
}