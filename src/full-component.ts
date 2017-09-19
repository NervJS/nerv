import { mountComponent, reRenderComponent, unmountComponent } from './lifecycle'
import Component from './component'

/**
 *
 * @param props
 * @param defaultProps
 * defaultProps should respect null but ignore undefined
 * see: https://facebook.github.io/react/docs/react-component.html#defaultprops
 */
function normalizeProps (props, defaultProps) {
  if (defaultProps) {
    for (const propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }
  return props
}

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
    this.props = normalizeProps(props, ComponentType.defaultProps)
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
