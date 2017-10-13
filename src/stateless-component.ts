import shallowEqual from './util/shallow-equal'
import { mountStatelessComponent, unmountStatelessComponent, reRenderStatelessComponent } from './lifecycle'

class StateLessComponent {
  type = 'Widget'
  tagName: Function
  name: string
  _owner: any
  props: any
  _rendered: any
  parentContext: any
  constructor (tagName, props) {
    this.tagName = tagName
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
    if (previous.tagName === current.tagName && shallowEqual(oldProps, newProps)) {
      return domNode
    }
    return reRenderStatelessComponent(previous, this, domNode)
  }

  destroy (dom?: Element) {
    unmountStatelessComponent(this, dom)
  }
}

export default StateLessComponent
