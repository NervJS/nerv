/** @jsx createElement */
import { Component, createElement, render } from '../../src/index'

describe('patch', () => {
  let scratch

  before(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
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
          >1</div>
          <li key='a'>a</li>
          <li key='b'>b</li>
        </div>
      )
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).to.be.equal('<div><div test="1" accesskey="" style="color: green; margin: 10px; padding: 10px;">1</div><li>a</li><li>b</li></div>')
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
    expect(scratch.innerHTML).to.equal('<div><div>1</div><li>b</li><li>a</li></div>')
  })
})
