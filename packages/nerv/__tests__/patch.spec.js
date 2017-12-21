/** @jsx createElement */
import { Component, createElement, render } from '../src/index'
import { normalizeHTML } from './util'

describe('patch', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  it('should not patch when lastVnode and nextVnode is equal', () => {
    const App = () => <div />
    let app
    render(<App ref={c => (app = c)} />, scratch)
    render(app, scratch)
  })

  it('should handle float', () => {
    const App = () => <div style={{ float: 'left' }} />
    render(<App />, scratch)
    expect(scratch.innerHTML).toContain('left')
    // console.log(scratch.innerHTML)
  })

  it('should ignore last style when it does not exist', () => {
    render(<div />, scratch)
    render(<div style={{ float: 'left' }} />, scratch)
    render(<div />, scratch)
    render(<div style={{ 'margin-top': 10 }} />, scratch)
    expect(scratch.innerHTML).toContain('10px')
    // console.log(scratch.innerHTML)
  })

  it('should hanlde style', () => {
    let inst
    class App extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          type: (
            <div>
              <div
                style={{ color: 'red', margin: '10px' }}
                color='green'
                test={{ t: 1 }}
                accessKey={{}}
              >
                1
              </div>
              <li key='a'>a</li>
              <li key='b'>b</li>
            </div>
          )
        }
        inst = this
      }

      render () {
        return this.state.type
      }
    }
    render(<App />, scratch)
    inst.setState({
      type: (
        <div>
          <div
            style={{ color: 'green', padding: '10px' }}
            test={[1]}
            accessKey={[]}
          >
            1
          </div>
          <li key='a'>a</li>
          <li key='b'>b</li>
        </div>
      )
    })
    inst.forceUpdate()
    const style = getComputedStyle(scratch.firstChild.firstChild)
    expect(style.color.indexOf('123')).not.toBe('-1')
  })

  it('should handle classNames', () => {
    const key = Math.random()
    render(<div classNames='c1 c2' key={key} />, scratch)
    render(<div style='color: red' key={key} />, scratch)
    expect(scratch.firstChild.className).toBe('')
  })

  it('should handle order', () => {
    let inst
    class App extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          type: (
            <div>
              <div>1</div>
              <li key='a'>a</li>
              <li key='b'>b</li>
            </div>
          )
        }
        inst = this
      }

      render () {
        return this.state.type
      }
    }
    render(<App />, scratch)
    inst.setState({
      type: (
        <div>
          <div>1</div>
          <li key='b'>b</li>
          <li key='a'>a</li>
        </div>
      )
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div>1</div><li>b</li><li>a</li></div>')
    )
  })
})
