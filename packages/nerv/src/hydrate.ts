// tslint:disable:no-conditional-assignment
import { render } from './render'

export function hydrate (vnode, container: Element, callback?: Function) {
  if (container !== null) {
    // lastChild causes less reflow than firstChild
    let dom = container.lastChild as Element
    // there should be only a single entry for the root
    while (dom) {
      const next = dom.previousSibling
      container.removeChild(dom)
      dom = next as Element
    }
    return render(vnode, container, callback)
  }
}
