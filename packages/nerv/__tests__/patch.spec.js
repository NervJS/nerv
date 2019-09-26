/** @jsx createElement */
import { Component, createElement, render } from '../src/index'
import sinon from 'sinon'
import { normalizeHTML } from './util'

describe('patch', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  it('should not patch when stateless component scu was set false', () => {
    const App = ({ text }) => <div>{text}</div>
    render(<App text='test' onShouldComponentUpdate={() => false} />, scratch)
    render(<App text='qweqe' onShouldComponentUpdate={(prev, current) => {
      expect(prev.text).toBe('test')
      expect(current.text).toBe('qweqe')
      return false
    }} />, scratch)
    expect(scratch.firstChild.textContent).toBe('test')
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
    render(<div className='c1 c2' key={key} />, scratch)
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

  it('unkeyed children diffing error', () => {
    class A extends Component {
      render () {
        return <div>this is a component</div>
      }
      componentWillUnmount () {
        // console.log('unmount')
      }
      componentDidMount () {
        // console.log('didMount')
      }
      componentDidUpdate () {
        // console.log('didUpdate')
      }
    }

    const cwu = sinon.spy(A.prototype, 'componentWillUnmount')
    const cdm = sinon.spy(A.prototype, 'componentDidMount')
    const cdu = sinon.spy(A.prototype, 'componentDidUpdate')

    class B extends Component {
      render () {
        const visible = this.props.visible
        return (
          <div>
            {visible ? <div>this is a plain div</div> : null}
            <div>
              <A />
            </div>
          </div>
        )
      }
    }

    let inst

    class App extends Component {
      state = { visible: false }

      setVisible (visible) {
        this.setState({
          visible
        })
      }

      constructor () {
        super(...arguments)
        inst = this
      }

      render () {
        return (
          <div>
            <B visible={this.state.visible} />
          </div>
        )
      }
    }

    render(<App />, scratch)
    expect(cdm.callCount).toBe(1)
    inst.setVisible(true)
    inst.forceUpdate()
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div><div>this is a plain div</div><div><div>this is a component</div></div></div></div>')
    )
    expect(cwu.called).toBe(false)
    expect(cdm.callCount).toBe(1)
    expect(cdu.callCount).toBe(1)
    inst.setVisible(false)
    inst.forceUpdate()
    expect(scratch.innerHTML).toEqual(
     normalizeHTML('<div><div><div><div>this is a component</div></div></div></div>')
    )
    expect(cwu.called).toBe(false)
    expect(cdm.callCount).toBe(1)
    expect(cdu.callCount).toBe(2)
    inst.setVisible(true)
    inst.forceUpdate()
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div><div>this is a plain div</div><div><div>this is a component</div></div></div></div>')
    )
    expect(cwu.called).toBe(false)
    expect(cdm.callCount).toBe(1)
    expect(cdu.callCount).toBe(3)
  })
})
