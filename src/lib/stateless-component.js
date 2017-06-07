import { mountStatelessComponent } from './lifecycle'

class StateLessComponent {
  constructor (tagName, props) {
    this.tagName = tagName
    this.props = props
  }

  type = 'StateLess'

  init () {
    return mountStatelessComponent(this)
  }
}

export default StateLessComponent
