import { VType, Component } from 'nerv-shared'
import {
  mountComponent,
  reRenderComponent,
  unmountComponent
} from './lifecycle'

class ComponentWrapper {
  vtype = VType.Composite
  tagName: any
  name: string
  _owner: any
  props: any
  parentContext: any
  component: Component<any, any>
  context: any
  key: any
  dom: Element | null

  constructor (tagName, props) {
    this.tagName = tagName
    this.name =
      tagName.name || tagName.toString().match(/^function\s*([^\s(]+)/)[1]
    tagName.displayName = this.name
    this._owner = props.owner
    delete props.owner
    this.props = props
    this.key = props.key
    this.dom = null
  }

  init (parentComponent?) {
    return mountComponent(this, parentComponent)
  }

  update (previous, current?, domNode?) {
    return reRenderComponent(previous, this)
  }

  destroy (dom?: Element) {
    unmountComponent(this)
  }
}

export default ComponentWrapper
