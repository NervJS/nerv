import createElement from './create-element'
import { extend, clone } from './util'
import { isVText } from './vdom/vnode/types'
export default function cloneElement (vnode, props): any {
  if (isVText(vnode)) {
    return vnode
  }
  const properties = extend(clone(vnode.props), props)
  if (vnode.namespace) {
    properties.namespace = vnode.namespace
  }
  return createElement(
    vnode.tagName,
    properties,
    arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children
  )
}
