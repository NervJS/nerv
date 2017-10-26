export * from 'nerv-shared'

export function isBoolean (arg): arg is true | false {
  return arg === true || arg === false
}

export function isNullOrUndef (o: any): o is undefined | null {
  return isUndefined(o) || isNull(o)
}

export function isUndefined (o: any): o is undefined {
  return o === void 0
}

export function isNull (o: any): o is null {
  return o === null
}

export function isInvalid (o: any): o is null | false | true | undefined {
  return isNull(o) || o === false || o === true || isUndefined(o)
}
