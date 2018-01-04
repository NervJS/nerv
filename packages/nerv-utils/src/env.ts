// tslint:disable-next-line
export const global = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self
  }
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof global !== 'undefined') {
    return global
  }
  throw new Error('unable to locate global object')
})()

export const isBrowser = typeof window !== 'undefined'

// tslint:disable-next-line:no-empty
function noop () {}

const fakeDoc: any = {
  createElement: noop,
  createElementNS: noop,
  createTextNode: noop
}

export const doc: Document = isBrowser ? document : fakeDoc
