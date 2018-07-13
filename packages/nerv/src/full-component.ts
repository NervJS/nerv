import { VType, Component, CompositeComponent, Ref } from 'nerv-shared'
import {
  mountComponent,
  reRenderComponent,
  unmountComponent
} from './lifecycle'

class ComponentWrapper implements CompositeComponent {
  vtype = VType.Composite
  type: any
  name: string
  _owner: any
  props: any
  component: Component<any, any>
  context: any
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

  init (parentContext, parentComponent) {
    return mountComponent(this, parentContext, parentComponent)
  }

  update (previous, current, parentContext, domNode?) {
    this.context = parentContext
    return reRenderComponent(previous, this)
  }

  destroy () {
    unmountComponent(this)
  }
}

export default ComponentWrapper
