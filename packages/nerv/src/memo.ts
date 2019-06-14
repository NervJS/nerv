import { shallowEqual, isFunction } from 'nerv-utils'
import Ref from './vdom/ref'
import createElement from './create-element'
import Component from './component'

export function memo (component: Function, propsAreEqual?: Function) {
  function shouldComponentUpdate (this: Component, nextProps): boolean {
    const prevRef = this.props.ref
    const nextRef = nextProps.ref
    if (prevRef !== nextRef) {
      Ref.detach(this.vnode, prevRef, this.dom)
      Ref.attach(this.vnode, nextRef, this.dom)
      return true
    }
    return isFunction(propsAreEqual) ? !propsAreEqual(this.props, nextProps) : !shallowEqual(this.props, nextProps)
  }

  function Memoed (this: Component, props) {
    this.shouldComponentUpdate = shouldComponentUpdate
    return createElement(component, { ...props })
  }

  Memoed._forwarded = true

  Memoed.isMemo = true

  return Memoed
}
