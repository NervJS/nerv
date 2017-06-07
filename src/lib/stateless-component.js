import { mountStatelessComponent } from './lifecycle'

class StateLessComponent {
  constructor (tagName, props) {
    this.tagName = tagName
    this.props = props
    this._owner = props.owner
    delete props.owner
  }

  type = 'StateLess'

  init () {
    return mountStatelessComponent(this)
  }
}

export default StateLessComponent
