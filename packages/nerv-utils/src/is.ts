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

// Object.is polyfill
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
export function objectIs (x: any, y: any) {
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y
  }
  // eslint-disable-next-line no-self-compare
  return x !== x && y !== y
}
