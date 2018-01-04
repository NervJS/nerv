import { global } from './env'
const canUsePromise = 'Promise' in global

let resolved
if (canUsePromise) {
  resolved = Promise.resolve()
}

const nextTick: (fn) => void = canUsePromise
  ? (fn) => resolved.then(fn)
  : 'requestAnimationFrame' in global ? requestAnimationFrame : setTimeout

export default nextTick
