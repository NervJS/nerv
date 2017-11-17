import createElement from './create-element'
import { extend, clone } from 'nerv-utils'
// import { isValidElement } from 'nerv-shared'

export default function cloneElement (vnode, props, ...children): any {
  const properties = extend(clone(vnode.props), props)
  if (vnode.namespace) {
    properties.namespace = vnode.namespace
  }
  return createElement(
    vnode.type,
    properties,
    children.length === 0 ? vnode.children : children
  )
}
