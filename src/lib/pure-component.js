import Component from './component'
import shallowEqual from './util/shallow-equal'

class PureComponent extends Component {
  isPureComponent = true
  constructor () {
    super(...arguments)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }
}

export default PureComponent
