import { VType } from 'nerv-shared'
import { mountStatelessComponent, unmountStatelessComponent, reRenderStatelessComponent } from './lifecycle'

class StateLessComponent {
  vtype = VType.Stateless
  type: Function
  name: string
  _owner: any
  props: any
  _rendered: any
  parentContext: any
  key: any
  dom: Element | null
  constructor (type, props) {
    this.type = type
    this._owner = props.owner
    delete props.owner
    this.props = props
    this.key = props.key
  }

  init () {
    return mountStatelessComponent(this)
  }

  update (previous, current?, domNode?) {
    return reRenderStatelessComponent(previous, this, domNode)
  }

  destroy (dom?: Element) {
    unmountStatelessComponent(this, dom)
  }
}

export default StateLessComponent
