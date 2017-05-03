import createElement from './create-element'
import { extend } from './util'

export default function cloneElement (vnode, props, ...children) {
  children = children.length > 0 ? children : props.children
  return createElement(
    vnode.tagName,
    extend(extend({}, vnode.properties), props),
    ...children
  )
}