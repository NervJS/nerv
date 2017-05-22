import { extend } from './util'
import { UPDATE_SELF } from './constants'

class ComponentWrapper {
  constructor (ComponentClass, props, context) {
    this.component = new ComponentClass(props, context)
    let constructor =  this.component.constructor
    this.name = constructor.name || constructor.toString().match(/^function\s*([^\s(]+)/)[1]
    constructor.displayName = this.name
  }

  init () {
    this.component.__ref = this.component.props.ref
    delete this.component.props.ref
    this.component.mount()
    let domNode = this.component.dom
    if (!domNode) {
      return null
    }
    domNode._component = this.component
    domNode._componentConstructor = this.component.constructor
    return domNode
  }

  update (previous) {
    const props = this.component.props
    this.component = previous.component
    this.component.props = extend(this.component.props, props)
    this.component.update(UPDATE_SELF)
    if (this.component.dom) {
      this.component.dom._component = this.component
      this.component.dom._componentConstructor = this.component.constructor
    }
    return this.component.dom
  }

  destroy (domNode) {
    this.component.unmount()
    if (domNode.component) {
      delete domNode.component
    }
  }
}

ComponentWrapper.prototype.type = 'Widget'

export default ComponentWrapper