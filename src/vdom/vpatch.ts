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
  type = 'VirtualPatch'
  constructor (type, vnode, patch) {
    this.type = type
    this.vnode = vnode
    this.patch = patch
  }
}

export default VPatch
