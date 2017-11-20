import { isFunction, isString } from 'nerv-utils'
import { isComposite } from 'nerv-shared'

export default {
  update (lastVnode, nextVnode) {
    const prevRef = lastVnode != null && lastVnode.props.ref
    const nextRef = nextVnode != null && nextVnode.props.ref

    if (prevRef !== nextRef) {
      this.detach(lastVnode, prevRef)
      this.attach(nextVnode, nextRef)
    }
  },
  attach (vnode, ref?: string | Function) {
    if (isFunction(ref)) {
      ref(isComposite(vnode) ? vnode.component : vnode)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (isComposite(inst)) {
        inst.component.refs[ref] = vnode
      }
    }
  },
  detach (vnode, ref?: string | Function, component?) {
    if (isFunction(ref)) {
      ref(null)
    } else if (isString(ref)) {
      const inst = vnode._owner
      if (inst.component.refs[ref] === vnode && isComposite(inst)) {
        delete inst.component.refs[ref]
      }
    }
  }
}
