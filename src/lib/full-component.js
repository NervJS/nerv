import { extend, clone } from './util'
import { mountComponent, reRenderComponent, unmountComponent } from './lifecycle'

class ComponentWrapper {
  constructor (ComponentType, props) {
    this.ComponentType = ComponentType
    this.name = ComponentType.name || ComponentType.toString().match(/^function\s*([^\s(]+)/)[1]
    ComponentType.displayName = this.name
    this._owner = props.owner
    delete props.owner
    this.props = extend(clone(ComponentType.defaultProps || {}), props)
  }

  type = 'Widget'

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
