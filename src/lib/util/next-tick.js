import { isNative } from './index'

const canUsePromise = (function () {
  return typeof Promise === 'function' &&
    isNative(Promise)
})()
const resolved = Promise.resolve()
const nextTick = canUsePromise
  ? (fn) => resolved.then(fn)
  : setTimeout

export default nextTick
