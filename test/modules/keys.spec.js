/** @jsx createElement */
import { Component, createElement, render } from '../../src/index'

describe('keys', () => {
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

  it('should remove orphaned keyed nodes', () => {
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
          <div>2</div>
          <li key='b'>b</li>
          <li key='c'>c</li>
        </div>
      )
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).to.equal('<div><div>2</div><li>b</li><li>c</li></div>')
  })

  it('should set VNode#key property', () => {
    expect(<div />).to.have.property('key').that.is.null
    expect(<div a='a' />).to.have.property('key').that.is.null
    expect(<div key='1' />).to.have.property('key', '1')
  })
})
