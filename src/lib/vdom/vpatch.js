class VPatch {
  constructor (type, vnode, patch) {
    this.type = type
    this.vnode = vnode
    this.patch = patch
  }
}

VPatch.NODE = 'NODE'
VPatch.VTEXT = 'VTEXT'
VPatch.VNODE = 'VNODE'
VPatch.WIDGET = 'WIDGET'
VPatch.PROPS = 'PROPS'
VPatch.ORDER = 'ORDER'
VPatch.INSERT = 'INSERT'
VPatch.REMOVE = 'REMOVE'
VPatch.THUNK = 'THUNK'

VPatch.prototype.type = 'VirtualPatch'

export default VPatch