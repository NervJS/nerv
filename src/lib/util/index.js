export function isNumber (arg) {
  return typeof arg === 'number'
}

export function isString (arg) {
  return typeof arg === 'string'
}

export function isFunction (arg) {
  return typeof arg === 'function'
}

export const isArray = Array.isArray

export function isObject (arg) {
  return arg === Object(arg)
}
export function isNative (Ctor) {
  return isFunction(Ctor) && /native code/.test(Ctor.toString())
}

export function extend (source, from) {
  if (!from) {
    return source
  }
  for (let key in from) {
    if (from.hasOwnProperty(key)) {
      source[key] = from[key]
    }
  }
  return source
}

export function clone (obj) {
  return extend({}, obj)
}
export function isEmptyObject (obj) {
  if (!obj) {
    return true
  }
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return true
}