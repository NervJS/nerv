import { extend, clone } from './util'
import { mountComponent, reRenderComponent, unmountComponent } from './lifecycle'

class ComponentWrapper {
  type = 'Widget'
  ComponentType: any
  name: string
  _owner: any
  props: any
  parentContext: any

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

  update (previous) {
    return reRenderComponent(previous, this)
  }

  destroy () {
    unmountComponent(this)
  }
}

export default ComponentWrapper
