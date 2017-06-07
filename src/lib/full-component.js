import { mountComponent, reRenderComponent, unmoutComponent} from './lifecycle'

class ComponentWrapper {
  constructor (ComponentType, props) {
    this.ComponentType = ComponentType
    this.props = props
    this._owner = props.owner
    delete props.owner
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
