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
    return domNode
  }

  update (previous) {
    const { props, state, context } = this.component
    this.component = previous.component
    this.component.props = extend(this.component.props, props)
    this.component.state = extend(this.component.props, state)
    this.component.context = extend(this.component.props, context)
    this.component.update(UPDATE_SELF)
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