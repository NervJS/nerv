import nextTick from './util/next-tick'
import { updateComponent } from './lifecycle'

let items = []

export function enqueueRender (component) {
  if (!component._dirty && (component._dirty = true) && items.push(component) === 1) {
    nextTick(rerender)
  }
}

export function rerender () {
  let p
  const list = items
  items = []
  while ((p = list.pop())) {
    if (p._dirty) {
      updateComponent(p)
    }
  }
}
