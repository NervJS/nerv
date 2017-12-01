const canUsePromise = 'Promise' in window

let resolved
if (canUsePromise) {
  resolved = Promise.resolve()
}

const nextTick: (fn) => void = canUsePromise
  ? (fn) => resolved.then(fn)
  : 'requestAnimationFrame' in window ? requestAnimationFrame : setTimeout

export default nextTick
