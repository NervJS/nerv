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
  key: any
  dom: Element | null
  constructor (type, props) {
    this.type = type
    this._owner = props.owner
    delete props.owner
    this.props = props
    this.key = props.key
  }

  init (parentContext) {
    return mountStatelessComponent(this, parentContext)
  }

  update (previous, current, parentContext, domNode?) {
    const oldProps = previous.props
    const newProps = current.props
    if (previous.type === current.type && shallowEqual(oldProps, newProps)) {
      current._rendered = previous._rendered
      current.dom = previous.dom
      return domNode
    }
    return reRenderStatelessComponent(previous, this, parentContext, domNode)
  }

  destroy () {
    unmountStatelessComponent(this)
  }
}

export default StateLessComponent
