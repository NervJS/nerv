import { isWidget, isVNode, isNullOrUndef, isInvalid } from 'nerv-shared'
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
  const dom = vnode.dom

  if (isWidget(vnode)) {
    vnode.destroy()
  } else if (isVNode(vnode)) {
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
