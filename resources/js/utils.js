function progress(from, to, current) {
	return 1 - ((to - current) / (to - from));
}

/**
 * 2D distance
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 *
 * @return {Number}
 */
function distance(x1, y1, x2, y2) {
	const xD = x2 - x1;
	const yD = y2 - y1;

	return Math.sqrt((xD * xD) + (yD * yD));
}

export {
	distance,
	progress
}