import createElement from './create-element'
import createVText from './vdom/create-vtext'
import { extend, clone, isArray, isString } from 'nerv-utils'
import { isVText, isVNode, EMPTY_CHILDREN, VType, isNullOrUndef } from 'nerv-shared'

export default function cloneElement (vnode, props?: object, ...children): any {
  if (isVText(vnode)) {
    vnode.dom = null
    return vnode
  }
  if (isString(vnode)) {
    return createVText(vnode)
  }
  const properties = clone(extend(clone(vnode.props), props))
  if (vnode.namespace) {
    properties.namespace = vnode.namespace
  }
  if ((vnode.vtype & VType.Composite) && !isNullOrUndef(vnode.ref)) {
    properties.ref = vnode.ref
  }
  let childrenTmp =
    (arguments.length > 2 ?
      [].slice.call(arguments, 2) :
      vnode.children || properties.children) || []
  if (childrenTmp.length) {
    if (childrenTmp.length === 1) {
      childrenTmp = children[0]
    }
  }
  if (isArray(vnode)) {
    return vnode.map((item) => {
      return cloneElement(item)
    })
  }
  const newVNode = createElement(vnode.type, properties)
  if (isArray(childrenTmp)) {
    let _children = childrenTmp.map((child) => {
      return cloneElement(child, child.props)
    })
    if (_children.length === 0) {
      _children = EMPTY_CHILDREN
    }
    if (isVNode(newVNode)) {
      newVNode.children = _children
    }
    newVNode.props.children = _children
  } else if (childrenTmp) {
    if (isVNode(newVNode)) {
      newVNode.children = childrenTmp
    }
    newVNode.props.children = cloneElement(childrenTmp, childrenTmp.props)
  }
  return newVNode
}
