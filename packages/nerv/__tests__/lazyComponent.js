import {
    Component
  } from '../src'
export default class LazyComponent extends Component {
  render () {
    for (let i = 0; i < 10000000; i++) {
      document.createElement('div')
    }
    return <div>Lazy Component</div>
  }
}
