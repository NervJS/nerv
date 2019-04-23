import { isNullOrUndef, isInvalid, VType, VirtualChildren } from 'nerv-shared'
import { isAttrAnEvent, isArray } from 'nerv-utils'
import Ref from './ref'
import { detachEvent } from '../event'

export function unmountChildren (
  children: VirtualChildren,
  parentDom?: Element
) {
  if (isArray(children)) {
    for (let i = 0, len = children.length; i < len; i++) {
      unmount(children[i], parentDom)
    }
  } else {
    unmount(children, parentDom)
  }
}

export function unmount (vnode, parentDom?) {
  if (isInvalid(vnode)) {
    return
  }
  const vtype = vnode.vtype
  // Bitwise operators for better performance
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
  const dom = vnode.dom

  if ((vtype & (VType.Composite)) > 0) {
    vnode.destroy()
  } else if ((vtype & VType.Node) > 0) {
    const { props, children, ref } = vnode
    unmountChildren(children)
    for (const propName in props) {
      if (isAttrAnEvent(propName)) {
        detachEvent(dom, propName, props[propName])
      }
    }
    if (ref !== null) {
      Ref.detach(vnode, ref, dom)
    }
  } else if (vtype & VType.Portal) {
    unmountChildren(vnode.children, vnode.type)
  }

  if (!isNullOrUndef(parentDom) && !isNullOrUndef(dom)) {
    parentDom.removeChild(dom)
  }
  // vnode.dom = null
}
