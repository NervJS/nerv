import {
  isNullOrUndef,
  isInvalid,
  VType
} from 'nerv-shared'
import { isAttrAnEvent } from 'nerv-utils'
import Ref from './ref'

export function unmountChildren (children, parentDom?) {
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i]
    if (!isInvalid(child)) {
      unmount(child, parentDom)
    }
  }
}

export function unmount (vnode, parentDom?) {
  if (isInvalid(vnode)) {
    return
  }
  const vtype = vnode.vtype
  // Bitwise operators for better performance
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
  const dom = (vtype & VType.Composite) > 0 ? vnode.component.dom : vnode.dom

  if ((vtype & (VType.Composite | VType.Stateless)) > 0) {
    vnode.destroy()
  } else if ((vtype & VType.Node) > 0) {
    const { props, children, ref } = vnode
    unmountChildren(children)
    for (const propName in props) {
      const property = props[propName]
      if (isAttrAnEvent(propName)) {
        property.unhook(dom, propName, null)
      }
    }
    if (ref !== null) {
      Ref.detach(vnode, ref, dom)
    }
  }

  if (!isNullOrUndef(parentDom) && !isNullOrUndef(dom)) {
    parentDom.removeChild(dom)
  }
  // vnode.dom = null
}
