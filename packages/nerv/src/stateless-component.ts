import { VType } from 'nerv-shared'
import { isFunction } from 'nerv-utils'
import {
  mountStatelessComponent,
  unmountStatelessComponent,
  reRenderStatelessComponent
} from './lifecycle'

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
    const { props, context } = current
    const shouldComponentUpdate = props.onShouldComponentUpdate
    if (
      isFunction(shouldComponentUpdate) &&
      !shouldComponentUpdate(previous.props, props, context)
    ) {
      current._rendered = previous._rendered
      return domNode
    }
    return reRenderStatelessComponent(previous, this, parentContext, domNode)
  }

  destroy () {
    unmountStatelessComponent(this)
  }
}

export default StateLessComponent
