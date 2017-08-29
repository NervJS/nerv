import VNode from './vnode/vnode'
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
  vnode: VNode
  constructor (type = 'VirtualPatch', vnode: VNode, patch) {
    this.type = type
    this.vnode = vnode
    this.patch = patch
  }
}

export default VPatch
