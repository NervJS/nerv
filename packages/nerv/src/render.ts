import { mountVNode, flushMount } from './lifecycle'
import { VirtualNode, isComposite } from 'nerv-shared'
import { patch } from './vdom/patch'
import options from './options'

export function render (
  vnode: VirtualNode,
  container: Element,
  callback?: Function
) {
  if (!container) {
    throw new Error(`${container} should be a DOM Element`)
  }
  const lastVnode = (container as any)._component
  let dom
  options.roots.push(vnode)
  if (lastVnode !== undefined) {
    options.roots = options.roots.filter((item) => item !== lastVnode)
    dom = patch(lastVnode, vnode, container, {})
  } else {
    dom = mountVNode(vnode, {})
    container.appendChild(dom)
  }

  if (container) {
    (container as any)._component = vnode
  }
  flushMount()
  if (callback) {
    callback()
  }

  return isComposite(vnode) ? vnode.component : dom
}
