import createElement from './create-element'
import { extend, clone } from './util'
export default function cloneElement (vnode, props, ...children) {
  let properties = clone(vnode.props)
  if (properties.attributes) {
    properties = extend(properties, properties.attributes)
    delete properties.attributes
  }
  properties = extend(properties, props)
  if (vnode.key) {
    properties.key = vnode.key
  }
  if (vnode.namespace) {
    properties.namespace = vnode.namespace
  }
  return createElement(
    vnode.tagName,
    properties,
    children || vnode.props.children
  ) as any
}
