const resolved = Promise.resolve()
const nextTick = typeof Promise === 'function'
  ? (fn) => resolved.then(fn)
  : setTimeout

export default nextTick
