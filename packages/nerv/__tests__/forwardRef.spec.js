/** @jsx createElement */
import {
    Component,
    createElement,
    render,
    forwardRef,
    createRef
  } from '../src'
console.log('heheh')
describe('forwardRef', () => {
  it('should forwardRef', () => {
    const ref = createRef()
    const FancyButton = forwardRef((props, ref) => (
      <button ref={ref} className='FancyButton'>
        {props && props.children}
      </button>
    ))
    console.log('FancyButton')
    class App extends Component {
      render () {
        console.log('refffff', ref)
        return (<FancyButton ref={ref}>Click me!<div>heheh</div></FancyButton>)
      }
      componentDidMount () {
        console.log('didMount', ref)
      }
    }
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<App />, div)
  })
})
