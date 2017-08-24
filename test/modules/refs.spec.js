/** @jsx createElement */
import { Component, createElement, render } from '../../src'

const spy = (name, ...args) => {
  const spy = sinon.spy(...args)
  spy.displayName = `spy('${name}')`
  return spy
}

describe('refs', () => {
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

  it('should invoke refs in render()', () => {
    const ref = spy('ref')
    render(<div ref={ref} />, scratch)
    expect(ref).to.have.been.calledOnce.and.calledWith(scratch.firstChild)
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

    expect(outer).to.have.been.calledWith(scratch.firstChild)
    expect(inner).to.have.been.calledWith(scratch.firstChild.firstChild)
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

    expect(ref).to.have.been.calledOnce.and.calledWith(instance)
  })

  it('should pass rendered DOM from functional components to ref functions', () => {
    const ref = spy('ref')

    const Foo = () => <div />

    render(<Foo ref={ref} />, scratch)
    expect(ref).to.have.been.calledOnce
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

    expect(outer).to.have.been.calledOnce.and.calledWith(inst)
    expect(inner).to.have.been.calledOnce.and.calledWith(inst.dom)

    outer.reset()
    inner.reset()

    rerender()

    expect(outer, 're-render').to.have.been.calledOnce.and.calledWith(inst)
    expect(inner, 're-render').to.have.been.called

    inner.reset()
    InnermostComponent = 'x-span'
    rerender()
    expect(inner, 're-render swap')
    expect(inner.firstCall, 're-render swap').to.have.been.calledWith(inst.dom)
    expect(inner.secondCall, 're-render swap').to.have.been.calledWith(null)
    expect(scratch.innerHTML).to.equal('<div><x-span></x-span></div>')
    InnermostComponent = 'span'

    outer.reset()
    inner.reset()
    outerC.setState({
      reset: true
    })
    outerC.forceUpdate()

    expect(outer, 'unrender').to.have.been.calledOnce.and.calledWith(null)
    expect(inner, 'unrender').to.have.been.calledOnce.and.calledWith(null)
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

    expect(outer, 'outer initial').to.have.been.calledOnce.and.calledWith(outerInst)
    expect(inner, 'inner initial').to.have.been.calledOnce.and.calledWith(innerInst)
    expect(innermost, 'innerMost initial').to.have.been.calledOnce.and.calledWith(innerInst.dom)

    outer.reset()
    inner.reset()
    innermost.reset()
    outerInst.forceUpdate()

    expect(inner, 'inner update').to.have.been.calledOnce.and.calledWith(innerInst)
    expect(innermost, 'innerMost update').to.have.been.called

    innermost.reset()
    InnermostComponent = 'x-span'
    outerInst.forceUpdate()
    expect(innermost, 'innerMost swap')
    expect(innermost.firstCall, 'innerMost swap').to.have.been.calledWith(innerInst.dom)
    expect(innermost.secondCall, 'innerMost swap').to.have.been.calledWith(null)
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
    sinon.spy(Child.prototype, 'handleMount')

    render(<App />, scratch)
    expect(inst.handleMount).to.have.been.calledOnce.and.calledWith(scratch.querySelector('#div'))
    inst.handleMount.reset()

    inst.setState({ show: true })
    inst.forceUpdate()
    expect(inst.handleMount).to.have.been.calledTwice
    expect(inst.handleMount.firstCall).to.have.been.calledWith(scratch.querySelector('#span'))
    expect(inst.handleMount.secondCall).to.have.been.calledWith(null)
    inst.handleMount.reset()

    inst.setState({ show: false })
    inst.forceUpdate()
    expect(inst.handleMount).to.have.been.calledTwice
    expect(inst.handleMount.firstCall).to.have.been.calledWith(scratch.querySelector('#div'))
    expect(inst.handleMount.secondCall).to.have.been.calledWith(null)
  })
})
