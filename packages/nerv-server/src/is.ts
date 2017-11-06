export * from 'nerv-shared'

export function isBoolean (arg): arg is true | false {
  return arg === true || arg === false
}

export function isUndefined (o: any): o is undefined {
  return o === void 0
}

export function isNull (o: any): o is null {
  return o === null
}
