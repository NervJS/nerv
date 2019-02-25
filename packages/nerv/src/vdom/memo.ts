import { VirtualNode, MemoElement, MemoComponent, VType, Ref } from 'nerv-shared'
import { shallowEqual } from 'nerv-utils'
import { Component } from '..'
import { mountMemoComponent, reRenderMemoComponent, unmountMemoComponent } from '../lifecycle'
import { isFunction } from 'util';
export function memo(render: (props :any) => VirtualNode, equals?: (prevProps: any, nextProps: any) => boolean ): MemoElement {
  return {
    vtype: VType.MemoComponent,
    render, 
    equals,
    name: 'MemoComponent'
  }
}
export class MemoComponentWrapper implements MemoComponent {
  vtype = VType.MemoComponent
  type: any
  name: string
  _owner: any
  props: any
  component: Component<any, any>
  context: any // 旧版
  _context: any
  key: any
  dom: Element | null
  _rendered: any
  ref: Ref

  constructor (type, props) {
    this.type = type
    this.name = type.name || type.toString().match(/^function\s*([^\s(]+)/)[1]
    type.displayName = this.name
    this._owner = props.owner
    delete props.owner
    if ((this.ref = props.ref)) {
      delete props.ref
    }
    this.props = props
    this.key = props.key || null
    this.dom = null
  }

  init (parentContext) {
    return mountMemoComponent(this, parentContext)
  }

  update (previous, current, parentContext, domNode?) {
    const { props } = current
    const equals = this.type.equals || this.defaultAreEqual
    if (isFunction(equals) && equals(previous.props, props)) {
      current._rendered = previous._rendered
      return previous.dom
    }
    return reRenderMemoComponent(previous, this, parentContext, previous.dom)
  }

  destroy () {
    unmountMemoComponent(this)
  }
  defaultAreEqual(previousProps, nextProps) {
    return shallowEqual(previousProps, nextProps)
  }
}
