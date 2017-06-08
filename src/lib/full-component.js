import { mountComponent, reRenderComponent, unmoutComponent} from './lifecycle'

class ComponentWrapper {
  constructor (ComponentType, props) {
    this.ComponentType = ComponentType
    this.props = props
    this.name = ComponentType.name || ComponentType.toString().match(/^function\s*([^\s(]+)/)[1]
    ComponentType.displayName = this.name
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
