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

export function mergeObject (source, from) {
  for (let key in from) {
    if (!source[key]) {
      source[key] = from[key];
    } else {
      if (Widget.type(from[key]) === 'object') {
        source[key] = Widget.mergeObject(source[key], from[key]);
      } else {
        source[key] = from[key];
      }
    }
  }
  return source;
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