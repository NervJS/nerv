import { isValidElement } from 'nerv-shared'
import { render } from './render'
import { unmount } from './vdom/unmount'

export function unmountComponentAtNode (dom) {
  const component = dom._component
  if (isValidElement(component)) {
    unmount(component, dom)
    delete dom._component
    return true
  }
  return false
}

export function findDOMNode (component) {
  return component || (component.dom && component)
}

export function createPortal (vnode, container: Element) {
  // mountVNode can handle array of vnodes for us
  render(vnode, container)
  return null
}
