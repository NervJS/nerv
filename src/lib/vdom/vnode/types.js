export function isVNode (node) {
  return node && node.type == 'vnode';
}

export function isVText (node) {
  return node && node.type == 'vtext';
}

export function isWidget (node) {
  return node && node.type == 'Widget';
}