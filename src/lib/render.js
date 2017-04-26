import { proxy } from './util'
import createElement from '#/create-element'
import { isWidget } from '#/vnode/types'
import diff from '#/diff'
import patch from '#/patch'

export function render (vnode, container, callback) {
  if (!vnode || !container) {
    return
  }
  let component = vnode.component
  let unmount
  if (component && component.mount) {
    component.mount(container)
    unmount = proxy(component.unmount, component)
  } else {
    let domNode = createElement(vnode)
    if (domNode && container.appendChild) {
      container.appendChild(domNode)
    }
    unmount = function () {
      let patches = diff(vnode, null)
      domNode = patch(domNode, patches)
      if (domNode && container.removeChild) {
        container.removeChild(domNode)
      }
    }
  }
  callback && setTimeout(callback)
  return unmount
}

export function renderComponentToString (vnode, callback) {
  if (!isWidget(vnode)) {
    return
  }
  let component = vnode.component
  component.isServer = true
  component.on('mounted', callback || (() => {}))
  component.mount()
}