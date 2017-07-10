import { mountVNode, flushMount } from './lifecycle'
import { isWidget, isVNode } from '#/vnode/types'

export function render (vnode, container, callback) {
  if (!isVNode(vnode) && !isWidget(vnode)) {
    throw new Error(`${vnode} should be Widget or VirtualNode`)
  }
  if (!container || container.nodeType !== 1) {
    throw new Error(`${container} should be a DOM Element`)
  }
  const dom = mountVNode(vnode, {})
  if (dom) {
    container.appendChild(dom)
  }
  flushMount()

  if (callback) {
    callback()
  }

  return vnode.component || dom
}
