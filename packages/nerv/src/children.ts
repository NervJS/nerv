import { isArray } from 'nerv-utils'
import { isNullOrUndef, VirtualChildren, EMPTY_CHILDREN } from 'nerv-shared'

export const Children = {
  map (children: Array<VirtualChildren | any>, fn: any, ctx: any): any[] {
    if (isNullOrUndef(children)) {
      return children
    }
    children = Children.toArray(children)
    if (ctx && ctx !== children) {
      fn = fn.bind(ctx)
    }
    return children.map(fn)
  },
  forEach (
    children: Array<VirtualChildren | any>,
    fn: Function,
    ctx: any
  ): void {
    if (isNullOrUndef(children)) {
      return
    }
    children = Children.toArray(children)
    if (ctx && ctx !== children) {
      fn = fn.bind(ctx)
    }
    for (let i = 0, len = children.length; i < len; i++) {
      fn(children[i], i, children)
    }
  },
  count (children: Array<VirtualChildren | any>): number {
    children = Children.toArray(children)
    return children.length
  },
  only (children: Array<VirtualChildren | any>): VirtualChildren | any {
    children = Children.toArray(children)
    if (children.length !== 1) {
      throw new Error('Children.only() expects only one child.')
    }
    return children[0]
  },
  toArray (
    children: Array<VirtualChildren | any>
  ): Array<VirtualChildren | any> {
    if (isNullOrUndef(children)) {
      return []
    }
    return isArray(children) ? children : EMPTY_CHILDREN.concat(children)
  }
}
