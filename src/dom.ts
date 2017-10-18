import { isWidget } from './vdom/vnode/types'

export function unmountComponentAtNode (dom) {
  const component = dom._component
  if (!isWidget(component)) {
    return false
  }
  component.destroy(dom)
  return true
}

export function findDOMNode (component) {
  return component || component.dom || component
}
