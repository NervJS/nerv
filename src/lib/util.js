export function type (arg) {
  const class2type = {};
  const toString = class2type.toString;
  const types = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ');
  for (let i = 0; i < types.length; i++) {
    const typeItem = types[i];
    class2type['[object ' + typeItem + ']'] = typeItem.toLowerCase();
  }

  if (arg === null) {
    return arg + '';
  }

  return (typeof arg === 'object' || typeof arg === 'function') ?
    class2type[toString.call(arg)] || 'object' :
    typeof arg;
}

export function extend (source, from) {
  for (let key in from) {
    if (!source[key]) {
      source[key] = from[key];
    } else {
      if (type(from[key]) === 'object') {
        source[key] = extend(source[key], from[key]);
      } else {
        source[key] = from[key];
      }
    }
  }
  return source;
}

export function clone (obj) {
  return extend({}, obj);
}

export function getPrototype (obj) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(obj);
  } else if (obj.__proto__) {
    return obj.__proto__;
  } else {
    return obj.constructor.prototype;
  }
}

export function forEach (arg, fn) {
  if (arg.forEach) {
    return arg.forEach.call(arg, fn);
  }
  const type = Util.type(arg);
  if (type === 'array') {
    for (let i = 0; i < arg.length; i++) {
      if (fn.call(arg[i], arg[i], i) === false) {
        return;
      }
    }
  } else if (type === 'object') {
    for (let j in arg) {
      if (arg.hasOwnProperty(j)) {
        if (fn.call(arg[j], arg[j], j) === false) {
          return;
        }
      }
    }
  }
}

export function map (arg, fn) {
  if (arg.map) {
    return arg.map.call(arg, fn);
  } else {
    let T, A, k;
    if (!arg) {
      throw new TypeError('arg is null or not defined');
    }
    var O = Object(arg);
    var len = O.length >>> 0;
    if (typeof fn !== 'function') {
      throw new TypeError(fn + ' is not a function');
    }
    if (arguments.length > 1) {
      T = arguments[1];
    }
    A = new Array(len);
    k = 0;
    while (k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = fn.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    return A; 
  }
}

export function filter (arg, fn) {
  if (arg.filter) {
    return arg.filter.call(arg, fn);
  } else {
    if (!arg) {
      throw new TypeError('arg is null or not defined');
    }

    var t = Object(arg);
    var len = t.length >>> 0;
    if (typeof fn !== 'function') {
      throw new TypeError(fn + ' is not a function');
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (let i = 0; i < len; i++) {
      if (i in t) {
        let val = t[i];
        if (fn.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  }
}