/** @jsx createElement */
import {
    Component,
    createElement,
    render,
    createRef
  } from '../src'
describe('createRef', () => {
  class ScrollingList extends Component {
    constructor (props) {
      super(props)
      this.listRef = createRef()
    }
    componentDidUpdate (prevProps, prevState, snapshot) {
      this.listRef.current.scrollTop += 21
    }
    render () {
      const content = (this.props.arr || []).map((item, index) => {
        return <div>content{item}</div>
      })
      console.log('this.listRef', this.listRef)
      return (
        <div style={{height: '100px', overflow: 'scroll'}} ref={this.listRef}>
          {content}
        </div>)
    }
  }
  it('should createRef', () => {
    class App extends Component {
      constructor (props) {
        super(props)
        this.index = 0
        this.state = {
          arr: [0]
        }
      }
      render () {
        return <ScrollingList arr={this.state.arr} />
      }
      componentDidMount () {
        this.timer = setInterval(() => {
          const newArr = this.state.arr.concat([++this.index])
          this.setState({
            arr: newArr
          })
          if (this.index > 10) { clearInterval(this.timer) }
        }, 1000)
      }
    }
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<App />, div)
  })
})
