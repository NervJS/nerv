import { VirtualNode, Patch } from '../types'
class VPatch {
  static NODE = 'NODE'
  static VTEXT = 'VTEXT'
  static VNODE = 'VNODE'
  static WIDGET = 'WIDGET'
  static STATELESS = 'STATELESS'
  static PROPS = 'PROPS'
  static ORDER = 'ORDER'
  static INSERT = 'INSERT'
  static REMOVE = 'REMOVE'
  type: string
  vnode: VirtualNode
  patch: Patch
  constructor (type = 'VirtualPatch', vnode: VirtualNode, patch: Patch) {
    this.type = type
    this.vnode = vnode
    this.patch = patch
  }
}

export default VPatch
