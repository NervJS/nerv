let widgets = {};

export function createWidget (Ctor, props, context) {
  let instance = new Ctor(props, context);
  let list = widgets[Ctor.name];
  Ctor.call(instance, props, context);
  if (list) {
    for (let i = list.length; i--;) {
      if (list[i].constructor === Ctor) {
				instance.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
    }
  }
  return instance;
}