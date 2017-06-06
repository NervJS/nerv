import { mountVNode, flushMount } from './lifecycle'
import { isWidget } from '#/vnode/types'

export function render (vnode, container, callback) {
  if (!vnode || !container) {
    return
  }
  const parentContext = {}
  const dom = mountVNode(vnode, parentContext)
  if (dom) {
    container.appendChild(dom)
  }
  flushMount()
  
  if (callback) {
    callback()
  }

  return vnode.component || dom
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
