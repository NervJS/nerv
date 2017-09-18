import { extend, clone } from './util'
import { mountComponent, reRenderComponent, unmountComponent } from './lifecycle'
import Component from './component'

class ComponentWrapper {
  type = 'Widget'
  ComponentType: any
  name: string
  _owner: any
  props: any
  parentContext: any
  component: Component<any, any>
  context: any

  constructor (ComponentType, props) {
    this.ComponentType = ComponentType
    this.name = ComponentType.name || ComponentType.toString().match(/^function\s*([^\s(]+)/)[1]
    ComponentType.displayName = this.name
    this._owner = props.owner
    delete props.owner
    this.props = extend(clone(ComponentType.defaultProps || {}), props)
  }

  init () {
    return mountComponent(this)
  }

  update (previous, domNode?) {
    return reRenderComponent(previous, this)
  }

  destroy (dom?: Element) {
    unmountComponent(this)
  }
}

export default ComponentWrapper
