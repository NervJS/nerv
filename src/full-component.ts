import { mountComponent, reRenderComponent, unmountComponent } from './lifecycle'
import Component from './component'

class ComponentWrapper {
  type = 'Widget'
  tagName: any
  name: string
  _owner: any
  props: any
  parentContext: any
  component: Component<any, any>
  context: any

  constructor (tagName, props) {
    this.tagName = tagName
    this.name = tagName.name || tagName.toString().match(/^function\s*([^\s(]+)/)[1]
    tagName.displayName = this.name
    this._owner = props.owner
    delete props.owner
    this.props = props
  }

  init () {
    return mountComponent(this)
  }

  update (previous, current?, domNode?) {
    return reRenderComponent(previous, this)
  }

  destroy (dom?: Element) {
    unmountComponent(this)
  }
}

export default ComponentWrapper
