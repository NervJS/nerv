import { VType, isNullOrUndef, isValidElement } from 'nerv-shared'

export function isAsyncMode (obj) {
  return false
}

export function isConcurrentMode (obj) {
  return false
}

export function isValidElementType (obj) {
  // TODO
  return true
}

export function isContextConsumer (obj) {
  return isValidElement(obj) && (obj.constructor as any).isContextConsumer
}

export function isContextProvider (obj) {
  return isValidElement(obj) && (obj.constructor as any).isContextProvider
}

export function isFowardRef (obj) {
  return isValidElement(obj) && (obj.constructor as any)._forwarded === true && (obj.constructor as any).isMemo == null
}

export function isMemo (obj) {
  return isValidElement(obj) && (obj.constructor as any)._forwarded === true && (obj.constructor as any).isMemo === true
}

export function isFragment (object) {
  return false
}

export function isLazy (object) {
  return false
}

export function isPortal (object) {
  return !isNullOrUndef(object) && (object.vtype & VType.Portal) > 0
}

export function isProfiler (object) {
  return false
}

export function isStrictMode (object) {
  return false
}

export function isSuspense (object) {
  return false
}

export function isElement (object) {
  return isValidElement(object)
}
