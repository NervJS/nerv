export { default as nextTick } from './next-tick'
export { default as shallowEqual } from './shallow-equal'
export { default as SimpleMap } from './simple-map'
export * from './is'

  /* istanbul ignore next */
export function getPrototype (obj) {
  /* eslint-disable */
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(obj)
  } else if (obj.__proto__) {
    return obj.__proto__
  }
  /* eslint-enable */
  return obj.constructor.prototype
}

export function extend<S, F> (source: S, from: F): S | F & S {
  if (!from) {
    return source
  }
  for (const key in from) {
    if (from.hasOwnProperty(key)) {
      (source as any)[key] = from[key]
    }
  }
  return source
}

export function clone<T> (obj: T): T | {} {
  return extend({}, obj)
}

export const supportSVG = (() => {
  const SVG_NS = 'http://www.w3.org/2000/svg'
  const doc = document
  return () => {
    return !!doc.createElementNS && !!doc.createElementNS(SVG_NS, 'svg').createSVGRect
  }
})()
