/** @jsx createElement */
import { Component, createElement, render } from '../src/index'
import { normalizeHTML } from './util'

describe('patch', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
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
