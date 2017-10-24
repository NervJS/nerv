export function isVNode (node) {
  return node && node.type === 'VirtualNode'
}

export function isVText (node) {
  return node && node.type === 'VirtualText'
}

export function isWidget (node) {
  return node && node.type === 'Widget'
}

export function isStateLess (node) {
  return node && node.type === 'StateLess'
}

export function isNumber (arg): arg is number {
  return typeof arg === 'number'
}

export function isString (arg): arg is string {
  return typeof arg === 'string'
}

export function isFunction (arg): arg is Function {
  return typeof arg === 'function'
}

export function isBoolean (arg): arg is true | false {
  return arg === true || arg === false
}

export function isNullOrUndef (o: any): o is undefined | null {
  return isUndefined(o) || isNull(o)
}

export function isUndefined (o: any): o is undefined {
  return o === void 0
}

export function isNull (o: any): o is null {
  return o === null
}

export function isInvalid (o: any): o is null | false | true | undefined {
  return isNull(o) || o === false || o === true || isUndefined(o)
}

export const isArray = Array.isArray
