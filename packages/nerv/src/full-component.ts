import { VType, CompositeComponent, Ref } from 'nerv-shared'
import {
  mountComponent,
  reRenderComponent,
  unmountComponent
} from './lifecycle'
import Component from './component'
import { isUndefined } from 'nerv-utils'
import options from './options'

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
    if (type._forwarded) {
      if (!isUndefined(this.ref)) {
        props.ref = this.ref
      }
      delete this.ref
    }
    this.props = props
    this.key = props.key || null
    this.dom = null
    options.afterCreate(this)
  }

  init (parentContext, parentComponent) {
    options.beforeMount(this)
    const dom = mountComponent(this, parentContext, parentComponent)
    options.afterMount(this)
    return dom
  }

  update (previous, current, parentContext, domNode?) {
    this.context = parentContext
    options.beforeUpdate(this)
    const dom = reRenderComponent(previous, this)
    options.afterUpdate(this)
    return dom
  }

  destroy () {
    options.beforeUnmount(this)
    unmountComponent(this)
  }
}

export default ComponentWrapper
