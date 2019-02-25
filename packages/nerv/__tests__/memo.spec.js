/** @jsx createElement */
import {
    Component,
    createElement,
    render,
    memo
  } from '../src'
describe('forwardRef', () => {
  it('should render only if props change or not equal', () => {
    function MyComponent (props) {
      console.log('render memo component')
      return (<div style={props.theme}>xxxx</div>);
    }
    function areEqual (prevProps, nextProps) {
      return prevProps.theme == nextProps.theme
    }
    const TestComponent = memo(MyComponent, areEqual)
    const defaultTheme = { color: 'pink' }
    const fooTheme = { color: 'black' }
    class App extends Component {
      constructor (props) {
        super(props)
        this.state = {
          theme: defaultTheme
        }
      }
      render () {
        return (
          <div>
            <button onClick={this.handleClick}>set theme</button>
            <button onClick={this.setTheSame}>set same theme</button>
            <TestComponent theme={this.state.theme} />
          </div>
        )
      }
      handleClick = () => {
        this.setState({
          theme: this.state.theme == defaultTheme ? fooTheme : defaultTheme
        })
      }
      setTheSame = () => {
        this.setState({
          theme: defaultTheme
        })
      }
     }
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<App />, div)
  })
})
