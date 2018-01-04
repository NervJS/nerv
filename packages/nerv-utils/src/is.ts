import { doc } from './env'

export function isNumber (arg): arg is number {
  return typeof arg === 'number'
}

export const isSupportSVG = isFunction(doc.createAttributeNS)

export function isString (arg): arg is string {
  return typeof arg === 'string'
}

export function isFunction (arg): arg is Function {
  return typeof arg === 'function'
}

export function isBoolean (arg): arg is true | false {
  return arg === true || arg === false
}

export const isArray = Array.isArray

export function isObject (arg): arg is Object {
  return arg === Object(arg) && !isFunction(arg)
}
export function isNative (Ctor) {
  return isFunction(Ctor) && /native code/.test(Ctor.toString())
}

export function isUndefined (o): o is undefined {
  return o === undefined
}
