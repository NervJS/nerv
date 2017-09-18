import { isNative } from './index'

let callbacks: Function[] = []
let pending = false
let runNextTick

function nextHandler () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks = []
  copies.forEach((task) => task())
}

const canUsePromise = (() => {
  return 'Promise' in window && isNative(Promise)
})()

const canUseMutationObserver = (() => {
  /* istanbul ignore next */
  return 'MutationObserver' in window &&
    (isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]')
})()

function installPromise () {
  const p = Promise.resolve()
  runNextTick = function _runNextTick () {
    p.then(nextHandler)
  }
}

/* istanbul ignore next */
function installMutationObserver () {
  let observeNum = 1
  const textNode = document.createTextNode(observeNum as any)
  const observer = new MutationObserver(nextHandler)
  observer.observe(textNode, {
    characterData: true
  })
  runNextTick = function _runNextTick () {
    observeNum = (observeNum + 1) % 2
    textNode.data = observeNum as any
  }
}

/* istanbul ignore next */
function installSetTimeout () {
  runNextTick = function _runNextTick () {
    setTimeout(nextHandler, 0)
  }
}

/* istanbul ignore else */
if (canUsePromise) {
  installPromise()
} else if (canUseMutationObserver) {
  installMutationObserver()
} else {
  installSetTimeout()
}

function nextTick (cb: Function, ctx?) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (err) {
        console.error(err)
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    runNextTick()
  }
  if (!cb && canUsePromise) {
    return new Promise((resolve) => {
      _resolve = resolve
    })
  }
}

export default nextTick
