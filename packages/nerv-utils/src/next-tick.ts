import { global } from './env'
import { isFunction } from './is'

const isMacSafari = navigator && navigator.platform &&
  navigator.platform.includes('Mac') && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

const canUsePromise = 'Promise' in global && !isMacSafari

let resolved
if (canUsePromise) {
  resolved = Promise.resolve()
}

const nextTick: (fn, ...args) => void = (fn, ...args) => {
  fn = isFunction(fn) ? fn.bind(null, ...args) : fn
  if (canUsePromise) {
    return resolved.then(fn)
  }
  const timerFunc = 'requestAnimationFrame' in global ? requestAnimationFrame : setTimeout
  timerFunc(fn)
}

export default nextTick
