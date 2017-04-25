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

export function inArray (value, arr, fromIndex) {
  if (!isArray(arr)) {
    throw new Error('inArray must recieve array')
  }
  if (arr.indexOf) {
    return arr.indexOf(value)
  }
  const len = arr.length >>> 0
  fromIndex = fromIndex | 0
  if (fromIndex >= len) {
    return -1
  }
  let k = Math.max(fromIndex >= 0 ? fromIndex : len - Math.abs(fromIndex), 0)
  while (k < len) {
    if (k in arr && arr[k] === value) {
      return k;
    }
    k++;
  }
  return -1;
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

export function forEach (arg, fn) {
  if (arg.forEach) {
    return arg.forEach.call(arg, fn)
  }
  const itype = type(arg)
  if (itype === 'array') {
    for (let i = 0; i < arg.length; i++) {
      if (fn.call(arg[i], arg[i], i) === false) {
        return
      }
    }
  } else if (itype === 'object') {
    for (let j in arg) {
      if (arg.hasOwnProperty(j)) {
        if (fn.call(arg[j], arg[j], j) === false) {
          return
        }
      }
    }
  }
}

export function map (arg, fn) {
  if (arg.map) {
    return arg.map.call(arg, fn)
  }
  let T, A, k
  if (!arg) {
    throw new TypeError('arg is null or not defined')
  }
  let O = Object(arg)
  let len = O.length >>> 0
  if (typeof fn !== 'function') {
    throw new TypeError(fn + ' is not a function')
  }
  if (arguments.length > 1) {
    T = arguments[1]
  }
  A = new Array(len)
  k = 0
  while (k < len) {
    let kValue, mappedValue
    if (k in O) {
      kValue = O[k]
      mappedValue = fn.call(T, kValue, k, O)
      A[k] = mappedValue
    }
    k++
  }
  return A
}

export function filter (arg, fn) {
  if (arg.filter) {
    return arg.filter.call(arg, fn)
  }
  if (!arg) {
    throw new TypeError('arg is null or not defined')
  }

  let t = Object(arg)
  let len = t.length >>> 0
  if (typeof fn !== 'function') {
    throw new TypeError(fn + ' is not a function')
  }

  let res = []
  let thisArg = arguments.length >= 2 ? arguments[1] : void 0
  for (let i = 0; i < len; i++) {
    if (i in t) {
      let val = t[i]
      if (fn.call(thisArg, val, i, t)) {
        res.push(val)
      }
    }
  }

  return res
}