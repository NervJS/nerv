// tslint:disable-next-line
export var global = (function() {
  let local

  if (typeof global !== 'undefined') {
    local = global
  } else if (typeof self !== 'undefined') {
    local = self
  } else {
    try {
      local = Function('return this')()
    } catch (e) {
      throw new Error('global object is unavailable in this environment')
    }
  }
  return local
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
