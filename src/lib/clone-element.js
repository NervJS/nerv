import createElement from './create-element'
import { extend, clone } from './util'

export default function cloneElement (vnode, props) {
  props = extend(clone(vnode.props), props)
  if (vnode.namespace) {
    props.namespace = vnode.namespace
  }
  return createElement(
    vnode.tagName,
    props,
    arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children
  )
}
