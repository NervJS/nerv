import VNode from './vnode'
import VText from './vtext'
import FullComponent from '../../full-component'
import StateLess from '../../stateless-component'
export function isVNode (node): node is VNode {
  return node && node.type === 'VirtualNode'
}

export function isVText (node): node is VText {
  return node && node.type === 'VirtualText'
}

export function isWidget (node): node is FullComponent {
  return node && node.type === 'Widget'
}

export function isStateLess (node): node is StateLess {
  return node && node.type === 'StateLess'
}

export function isHook (arg) {
  if ((arg && (typeof arg.hook === 'function' && !arg.hasOwnProperty('hook'))) ||
    (arg && (typeof arg.unhook === 'function' && !arg.hasOwnProperty('unhook')))) {
    return true
  }
  return false
}
