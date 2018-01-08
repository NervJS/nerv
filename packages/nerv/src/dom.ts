import { isValidElement } from 'nerv-shared'
import { render } from './render'
import { unmount } from './vdom/unmount'
import createElement from './create-element'
import Component from './component'

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
  return component && component.dom
}

class WrapperComponent<P, S> extends Component<P, S> {
  getChildContext () {
    // tslint:disable-next-line
    return this.props.context
  }

  render () {
    return this.props.children
  }
}

export function unstable_renderSubtreeIntoContainer (
  parentComponent,
  vnode,
  container,
  callback
) {
  // @TODO: should handle props.context?
  const wrapper = createElement(
    WrapperComponent,
    { context: parentComponent.context },
    vnode
  )
  const rendered = render(wrapper as any, container)
  if (callback) {
    callback.call(rendered)
  }
  return rendered
}

export function createPortal (vnode, container: Element) {
  // mountVNode can handle array of vnodes for us
  render(vnode, container)
  return null
}
