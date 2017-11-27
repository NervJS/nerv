import { isFunction } from './is'

const resolved = Promise.resolve()

const nextTick: (fn) => void = isFunction(Promise)
  ? (fn) => resolved.then(fn)
  : isFunction(requestAnimationFrame)
    ? requestAnimationFrame
    : setTimeout

export default nextTick
