import { isFunction } from './util'
import { mountComponent, reRenderComponent, unmoutComponent} from './lifecycle'

class ComponentWrapper {
  constructor (ComponentType, props) {
    this.ComponentType = ComponentType
    this.props = props
  }

  type = 'Widget'

  mount () {
    const componentPrototype = this.ComponentType.prototype
    if (componentPrototype && isFunction(componentPrototype.render)) {
      this.component = new this.ComponentType(this.props, this.context)
      let constructor =  this.component.constructor
      this.name = constructor.name || constructor.toString().match(/^function\s*([^\s(]+)/)[1]
      constructor.displayName = this.name
    } else {
      this.component = this.ComponentType(this.props, this.context)
    }
  }

  init () {
    return mountComponent(this)
  }

  update (previous) {
    return reRenderComponent(previous, this)
  }

  destroy () {
    unmoutComponent(this.component)
  }
}

export default ComponentWrapper
