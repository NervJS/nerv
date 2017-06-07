import { mountComponent, reRenderComponent, unmoutComponent} from './lifecycle'

class ComponentWrapper {
  constructor (ComponentType, props) {
    this.ComponentType = ComponentType
    this.props = props
  }

  type = 'Widget'

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
