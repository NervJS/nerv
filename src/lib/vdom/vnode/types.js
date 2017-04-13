export function isVNode (node) {
  return node && node.type === 'VirtualNode';
}

export function isVText (node) {
  return node && node.type === 'VirtualText';
}

export function isWidget (node) {
  return node && node.type === 'Widget';
}

export function isThunk (node) {
  return node && node.type === 'Thunk';
}

export function isHook (arg) {
  if (arg && (typeof arg.hook === 'function' && !arg.hasOwnProperty('hook'))
    || (typeof arg.unhook === 'function' && !arg.hasOwnProperty('unhook'))) {
    return true;
  }
  return false;
}