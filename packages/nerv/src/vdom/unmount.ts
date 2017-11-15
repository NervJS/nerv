import { isWidget, isVNode, isNullOrUndef, isInvalid } from 'nerv-shared'
import { isAttrAnEvent } from 'nerv-utils'

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

  if (isWidget(vnode)) {
    vnode.destroy()
  } else if (isVNode(vnode)) {
    const { props, children } = vnode
    unmountChildren(children)
    for (const propName in props) {
      const property = props[propName]
      if (isAttrAnEvent(propName)) {
        property.unhook(vnode.dom, propName, null)
      }
    }
  }

  if (!isNullOrUndef(parentDom) && !isNullOrUndef(vnode.dom)) {
    parentDom.removeChild(vnode.dom)
  }
  // vnode.dom = null
}
