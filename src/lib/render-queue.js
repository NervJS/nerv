let items = [];

export function enqueueRender (component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) === 1) {
		setTimeout(rerender);
	}
}

export function rerender () {
	let p, list = items;
	items = [];
	while ((p = list.pop())) {
		if (p._dirty) {
			p.update();
		}
	}
}