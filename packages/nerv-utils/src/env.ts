// tslint:disable-next-line
export var global = (function() {
  let local

  if (typeof global !== 'undefined') {
    local = global
  } else if (typeof self !== 'undefined') {
    local = self
  } else {
    try {
      // tslint:disable-next-line:function-constructor
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

export const UA = isBrowser && window.navigator.userAgent.toLowerCase()

export const isMacSafari = isBrowser && UA && window.navigator.platform &&
  /mac/i.test(window.navigator.platform) && /^((?!chrome|android).)*safari/i.test(UA)

export const isTaro = isBrowser && !document.scripts

export const isIE9 = UA && UA.indexOf('msie 9.0') > 0

export const isiOS = (UA && /iphone|ipad|ipod|ios/.test(UA))
