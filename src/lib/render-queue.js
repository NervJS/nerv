import nextTick from './util/next-tick'
import { updateComponent} from './lifecycle'
let items = []

export function enqueueRender (component) {
  if (items.push(component) === 1) {
    nextTick(rerender)
  }
}

export function rerender () {
  let p, list = items
  items = []
  while ((p = list.pop())) {
    updateComponent(p)
  }
}
