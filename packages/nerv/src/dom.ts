import { isVNode, isWidget } from 'nerv-shared'
import { updateVNode } from './lifecycle'
import { render } from './render'

export function unmountComponentAtNode (dom) {
  const component = dom._component
  if (isWidget(component)) {
    component.destroy(dom.firstChild)
    delete dom._component
    return true
  } else if (isVNode(component)) {
    updateVNode(null, component, dom.firstChild, {})
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
