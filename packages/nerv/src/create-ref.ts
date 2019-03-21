export interface RefObject<T> {
  current?: T
}

export function createRef<T> (): RefObject<T> {
  return {}
}

export function forwardRef (cb: Function): Function {
  const fn = (props) => {
    const ref = props.ref
    delete props.ref
    return cb(props, ref)
  }
  fn._forwarded = true
  return fn
}
