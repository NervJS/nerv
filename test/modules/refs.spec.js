/** @jsx createElement */
import { Component, createElement, render } from '../../src'
import sinon from 'sinon'

const spy = (name, ...args) => {
  const spy = sinon.spy(...args)
  spy.displayName = `spy('${name}')`
  return spy
}

describe('refs', () => {
  let scratch

  beforeAll(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  afterAll(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should invoke refs in render()', () => {
    const ref = spy('ref')
    render(<div ref={ref} />, scratch)
    expect(ref.calledOnce).toBeTruthy()
    expect(ref.calledWith(scratch.firstChild)).toBeTruthy()
  })

  it('should invoke refs in Component.render()', () => {
    const outer = spy('outer')
    const inner = spy('inner')
    class Foo extends Component {
      render () {
        return (
          <div ref={outer}>
            <span ref={inner} />
          </div>
        )
      }
    }
    render(<Foo />, scratch)

    expect(outer.calledWith(scratch.firstChild)).toBeTruthy()
    expect(inner.calledWith(scratch.firstChild.firstChild)).toBeTruthy()
  })

  it('should pass components to ref functions', () => {
    const ref = spy('ref')
    let instance
    class Foo extends Component {
      constructor () {
        super()
        instance = this
      }
      render () {
        return <div />
      }
    }
    render(<Foo ref={ref} />, scratch)

    expect(ref.calledOnce).toBeTruthy()
    expect(ref.calledWith(instance)).toBeTruthy()
  })

  it('should pass rendered DOM from functional components to ref functions', () => {
    const ref = spy('ref')

    const Foo = () => <div />

    render(<Foo ref={ref} />, scratch)
    expect(ref.calledOnce).toBeTruthy()
  })

  it('should pass children to ref functions', () => {
    const outer = spy('outer')
    const inner = spy('inner')
    let InnermostComponent = 'span'
    let rerender
    let inst
    let outerC
    class Outer extends Component {
      constructor () {
        super()
        rerender = () => this.forceUpdate()
        this.state = {
          reset: false
        }
      }
      render () {
        return !this.state.reset ? (
          <div>
            <Inner ref={outer} />
          </div>
        ) : <div />
      }
    }
    class Inner extends Component {
      constructor () {
        super()
        inst = this
      }
      render () {
        return <InnermostComponent ref={inner} />
      }
    }

    render(<Outer ref={c => (outerC = c)} />, scratch)

    expect(outer.calledOnce).toBeTruthy()
    expect(outer.calledWith(inst)).toBeTruthy()
    expect(inner.calledOnce).toBeTruthy()
    expect(inner.calledWith(inst.dom)).toBeTruthy()

    outer.reset()
    inner.reset()

    rerender()

    expect(outer.calledOnce).toBeTruthy()
    expect(outer.calledWith(inst)).toBeTruthy()

    inner.reset()
    InnermostComponent = 'x-span'
    rerender()
    outerC.forceUpdate()
    if (document.documentMode === 8) {
      return
    }
    expect(inner.firstCall.calledWith(inst.dom)).toBeTruthy()
    expect(inner.secondCall.calledWith(null)).toBeTruthy()
    expect(scratch.innerHTML).toEqual('<div><x-span></x-span></div>')
    InnermostComponent = 'span'

    outer.reset()
    inner.reset()
    outerC.setState({
      reset: true
    })
    outerC.forceUpdate()
    expect(outer.calledOnce).toBeTruthy()
    expect(outer.calledWith(null)).toBeTruthy()
    expect(inner.calledOnce).toBeTruthy()
    expect(inner.calledWith(null)).toBeTruthy()
  })

  it('should pass high-order children to ref functions', () => {
    const outer = spy('outer')
    const inner = spy('inner')
    const innermost = spy('innermost')
    let InnermostComponent = 'span'
    let outerInst
    let innerInst
    class Outer extends Component {
      constructor () {
        super()
        outerInst = this
      }
      render () {
        return <Inner ref={inner} />
      }
    }
    class Inner extends Component {
      constructor () {
        super()
        innerInst = this
      }
      render () {
        return <InnermostComponent ref={innermost} />
      }
    }

    render(<Outer ref={outer} />, scratch)
    expect(outer.calledWith(outerInst)).toBeTruthy()
    expect(inner.calledWith(innerInst)).toBeTruthy()
    expect(innermost.calledWith(innerInst.dom)).toBeTruthy()

    outer.reset()
    inner.reset()
    innermost.reset()
    outerInst.forceUpdate()

    expect(inner.calledWith(innerInst)).toBeTruthy()
    expect(innermost.called).toBeTruthy()

    innermost.reset()
    InnermostComponent = 'x-span'
    outerInst.forceUpdate()
    expect(innermost.firstCall.calledWith(innerInst.dom)).toBeTruthy()
    expect(innermost.secondCall.calledWith(null)).toBeTruthy()
    InnermostComponent = 'span'

    outer.reset()
    inner.reset()
    innermost.reset()
  })

  it('should null and re-invoke refs when swapping component root element type', () => {
    let inst

    class App extends Component {
      render () {
        return <div><Child /></div>
      }
    }

    class Child extends Component {
      constructor (props, context) {
        super(props, context)
        this.state = { show: false }
        inst = this
      }
      handleMount () { }
      render () {
        if (!this.state.show) return <div id='div' ref={this.handleMount} />
        return <span id='span' ref={this.handleMount}>some test content</span>
      }
    }
    const childSpy = sinon.spy(Child.prototype, 'handleMount')

    render(<App />, scratch)
    expect(childSpy.calledWith(scratch.querySelector('#div'))).toBeTruthy()
    inst.handleMount.reset()

    inst.setState({ show: true })
    inst.forceUpdate()
    expect(childSpy.callCount).toBe(2)
    expect(childSpy.firstCall.calledWith(scratch.querySelector('#span'))).toBeTruthy()
    expect(childSpy.secondCall.calledWith(null)).toBeTruthy()
    inst.handleMount.reset()

    inst.setState({ show: false })
    inst.forceUpdate()
    expect(childSpy.callCount).toBe(2)
    expect(childSpy.firstCall.calledWith(scratch.querySelector('#div'))).toBeTruthy()
    expect(childSpy.secondCall.calledWith(null)).toBeTruthy()
  })
})
