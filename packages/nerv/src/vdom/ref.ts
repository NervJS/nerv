import { isFunction, isString, isObject } from 'nerv-utils'
import { isComposite } from 'nerv-shared'
import { errorCatcher } from '../lifecycle'
export default {
  update (lastVnode, nextVnode, domNode?) {
    const prevRef = lastVnode != null && lastVnode.ref
    const nextRef = nextVnode != null && nextVnode.ref

    if (prevRef !== nextRef) {
      this.detach(lastVnode, prevRef, lastVnode.dom)
      this.attach(nextVnode, nextRef, domNode)
    }
  },
  attach (vnode, ref, domNode: Element) {
    const node = isComposite(vnode) ? vnode.component : domNode
    if (isFunction(ref)) {
      const componentForCatcher = isComposite(vnode) ? vnode.component : vnode
      errorCatcher(() => {
        ref(node)
      }, componentForCatcher)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (inst && isFunction(inst.render)) {
        inst.refs[ref] = node
      }
    } else if (isObject(ref)) {
      ref.current = node
    }
  },
  detach (vnode, ref, domNode: Element) {
    const node = isComposite(vnode) ? vnode.component : domNode
    if (isFunction(ref)) {
      const componentForCatcher = isComposite(vnode) ? vnode.component : vnode
      errorCatcher(() => {
        ref(null)
      }, componentForCatcher)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (inst.refs[ref] === node && isFunction(inst.render)) {
        delete inst.refs[ref]
      }
    } else if (isObject(ref)) {
      ref.current = null
    }
  }
}
