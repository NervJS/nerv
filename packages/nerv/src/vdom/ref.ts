import { isFunction, isString } from 'nerv-utils'
import { isComposite } from 'nerv-shared'

export default {
  update (lastVnode, nextVnode, domNode?) {
    const prevRef = lastVnode != null && lastVnode.props.ref
    const nextRef = nextVnode != null && nextVnode.props.ref

    if (prevRef !== nextRef) {
      this.detach(lastVnode, prevRef, lastVnode.dom)
      this.attach(nextVnode, nextRef, domNode)
    }
  },
  attach (vnode, ref, domNode: Element) {
    if (isFunction(ref)) {
      ref(isComposite(vnode) ? vnode.component : domNode)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (isComposite(inst)) {
        inst.component.refs[ref] = domNode
      }
    }
  },
  detach (vnode, ref, domNode: Element) {
    if (isFunction(ref)) {
      ref(null)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (inst.component.refs[ref] === domNode && isComposite(inst)) {
        delete inst.component.refs[ref]
      }
    }
  }
}
