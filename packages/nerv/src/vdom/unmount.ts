import { isWidget, isVNode, isNullOrUndef, isInvalid } from 'nerv-shared'
import { VHook } from '../hooks/vhook'

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
    const { hooks, children } = vnode
    unmountChildren(children)
    for (const name in hooks) {
      const hook = hooks[name]
      if (hook.vhook === VHook.Event) {
        hook.unhook(vnode.dom, name, null)
      }
    }
  }

  if (!isNullOrUndef(parentDom) && !isNullOrUndef(vnode.dom)) {
    parentDom.removeChild(vnode.dom)
  }
  // vnode.dom = null
}
