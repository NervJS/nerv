export function type (arg) {
  const class2type = {}
  const toString = class2type.toString
  const types = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ')
  for (let i = 0; i < types.length; i++) {
    const typeItem = types[i]
    class2type['[object ' + typeItem + ']'] = typeItem.toLowerCase()
  }

  if (arg === null) {
    return arg + ''
  }

  return (typeof arg === 'object' || typeof arg === 'function') ?
    class2type[toString.call(arg)] || 'object' :
    typeof arg
}

export function isBoolean (arg) {
  return type(arg) === 'boolean'
}

export function isNumber (arg) {
  return type(arg) === 'number'
}

export function isString (arg) {
  return type(arg) === 'string'
}

export function isFunction (arg) {
  return type(arg) === 'function'
}

export function isArray (arg) {
  return type(arg) === 'array'
}

export function isDate (arg) {
  return type(arg) === 'date'
}

export function isRegExp (arg) {
  return type(arg) === 'regexp'
}

export function isObject (arg) {
  return type(arg) === 'object'
}

export function isError (arg) {
  return type(arg) === 'error'
}

export function isNative (Ctor) {
  return isFunction(Ctor) && /native code/.test(Ctor.toString())
}

export function extend (source, from) {
  for (let key in from) {
    if (!source[key]) {
      source[key] = from[key]
    } else if (type(from[key]) === 'object') {
      source[key] = extend(source[key], from[key])
    } else {
      source[key] = from[key]
    }
  }
  return source
}

export function clone (obj) {
  return extend({}, obj)
}

export function getPrototype (obj) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(obj)
  } else if (obj.__proto__) {
    return obj.__proto__
  }
  return obj.constructor.prototype
}

export function proxy (fn, context) {
  return function () {
    fn.apply(context || this, arguments)
  }
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

export function debounce (func, wait, immediate) {
  let timeout
  let args
  let context
  let timestamp
  let result
  const later = function later() {
    const last = +(new Date()) - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) {
          context = null
          args = null
        }
      }
    }
  }
  return function debounced() {
    context = this
    args = arguments
    timestamp = +(new Date())

    const callNow = immediate && !timeout
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }

    if (callNow) {
      result = func.apply(context, args)
      context = null
      args = null
    }

    return result
  }
}

export function throttle (fn, threshhold, scope) {
  threshhold || (threshhold = 250)
  let last, deferTimer
  return function () {
    let context = scope || this

    let now = +new Date, args = arguments
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}