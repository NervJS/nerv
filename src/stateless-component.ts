import { mountStatelessComponent } from './lifecycle'

class StateLessComponent {
  type = 'StateLess'
  tagName: string
  _owner: any
  props: any
  _renderd: any
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
