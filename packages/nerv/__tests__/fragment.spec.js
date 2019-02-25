/** @jsx createElement */
import {
  Component,
  createElement,
  render,
  Fragment
} from '../src'

describe('createFragment', () => {
  class Test1 extends Component {
    render () {
      return <div>test1</div>
    }
  }
  class Test2 extends Component {
    render () {
      return <div>test2</div>
    }
  }
  it('should create and remove Fragment', () => {
    const defaultTheme = {
      color: 'red'
    }
    const fooTheme =  {
      color: 'black'
    }
    class App extends Component {
      state = {
        show: false
      }
      static = null
      container = null
      static = null
      handleClick = () => {
        this.setState({
          theme: this.state.theme === defaultTheme ? fooTheme : defaultTheme
        })
      }
      render () {
        return (
          <div className='test_fragment' ref={node => (this.static = node)}>
            <div className='test_fragment_1'>
              <button onClick={this.handleClick}>button</button>
            </div>
            <div className='test_fragment_2'>
              <Fragment key='1'>
                <div>测试3</div>
              </Fragment>
              <Fragment key='2'>
                <div style={this.state.theme}>测试1</div>
                <div>测试2</div>
              </Fragment>
            </div>
            <div className='test_fragment_3'>
              <Fragment>
                <Test1 />
                <Test2 />
              </Fragment>
            </div>
          </div>
        )
      }
    }
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<App />, div)
  })
})
