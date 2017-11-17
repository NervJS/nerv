import { shallowEqual } from 'nerv-utils'
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
  dom: Element | null
  constructor (type, props) {
    this.type = type
    this._owner = props.owner
    delete props.owner
    this.props = props
  }

  init () {
    return mountStatelessComponent(this)
  }

  update (previous, current?, domNode?) {
    const oldProps = previous.props
    const newProps = current.props
    if (previous.type === current.type && shallowEqual(oldProps, newProps)) {
      return domNode
    }
    return reRenderStatelessComponent(previous, this, domNode)
  }

  destroy (dom?: Element) {
    unmountStatelessComponent(this, dom)
  }
}

export default StateLessComponent
