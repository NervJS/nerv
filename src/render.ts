import { mountVNode, flushMount } from './lifecycle'
import { isString, isNumber } from '~'
import { isWidget, isVNode, isStateLess } from '#/vnode/types'

function isVChild (vnode) {
  return isVNode(vnode) || isString(vnode) || isNumber(vnode)
}

export function render (vnode, container, callback) {
  if (!isVChild(vnode) && !isWidget(vnode) && !isStateLess(vnode)) {
    return null
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
