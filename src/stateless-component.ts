import { mountStatelessComponent } from './lifecycle'

class StateLessComponent {
  type = 'StateLess'
  tagName: Function
  _owner: any
  props: any
  _renderd: any
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
}

export default StateLessComponent
