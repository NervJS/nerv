/** @jsx createElement */
import { Component, createElement, render } from '../../src'
import createVText from '#/create-vtext'
import { rerender } from '../../src/lib/render-queue'

import { CHILDREN_MATCHER } from '../util'

describe('context', () => {
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

  it('should pass context to grandchildren', () => {
    const CONTEXT = { a: 'a' }
    const PROPS = { b: 'b' }
    let doRender = null

    class Outer extends Component {
      constructor () {
        super(...arguments)
        this.state = {}
      }
      componentDidMount () {
        doRender = () => {
          this.setState(PROPS)
        }
      }
      getChildContext () {
        return CONTEXT
      }
      render () {
        return <div><Inner {...this.state} /></div>
      }
    }
    sinon.spy(Outer.prototype, 'getChildContext')

    class Inner extends Component {
      shouldComponentUpdate () { return true }
      componentWillReceiveProps () { }
      componentWillUpdate () { }
      componentDidUpdate () { }
      render () {
        return <div>{this.context && this.context.a}</div>
      }
    }
    sinon.spy(Inner.prototype, 'shouldComponentUpdate')
    sinon.spy(Inner.prototype, 'componentWillReceiveProps')
    sinon.spy(Inner.prototype, 'componentWillUpdate')
    sinon.spy(Inner.prototype, 'componentDidUpdate')
    sinon.spy(Inner.prototype, 'render')

    render(<Outer />, scratch)

    expect(Outer.prototype.getChildContext).to.have.been.calledOnce

    CONTEXT.foo = 'bar'
    doRender()
    rerender()

    expect(Outer.prototype.getChildContext).to.have.been.calledTwice

    const props = { children: CHILDREN_MATCHER, ...PROPS }
    expect(Inner.prototype.shouldComponentUpdate).to.have.been.calledOnce.and.calledWith(props, {}, CONTEXT)
    expect(Inner.prototype.componentWillReceiveProps).to.have.been.calledWith(props, CONTEXT)
    expect(Inner.prototype.componentWillUpdate).to.have.been.calledWith(props, {})
    expect(Inner.prototype.componentDidUpdate).to.have.been.calledWith(props, {})
  })

  it('should pass context to direct children', () => {
    const CONTEXT = { a: 'a' }
    const PROPS = { b: 'b' }

    let doRender = null

    class Outer extends Component {
      constructor () {
        super(...arguments)
        this.state = {}
      }
      componentDidMount () {
        doRender = () => {
          this.setState(PROPS)
        }
      }
      getChildContext () {
        return CONTEXT
      }
      render () {
        return <Inner {...this.state} />
      }
    }
    sinon.spy(Outer.prototype, 'getChildContext')

    class Inner extends Component {
      shouldComponentUpdate () { return true }
      componentWillReceiveProps () { }
      componentWillUpdate () { }
      componentDidUpdate () { }
      render () {
        return <div>{this.context && this.context.a}</div>
      }
    }
    sinon.spy(Inner.prototype, 'shouldComponentUpdate')
    sinon.spy(Inner.prototype, 'componentWillReceiveProps')
    sinon.spy(Inner.prototype, 'componentWillUpdate')
    sinon.spy(Inner.prototype, 'componentDidUpdate')
    sinon.spy(Inner.prototype, 'render')

    render(<Outer />, scratch)

    expect(Outer.prototype.getChildContext).to.have.been.calledOnce

    CONTEXT.foo = 'bar'
    doRender()
    rerender()

    expect(Outer.prototype.getChildContext).to.have.been.calledTwice

    const props = { children: CHILDREN_MATCHER, ...PROPS }
    expect(Inner.prototype.shouldComponentUpdate).to.have.been.calledOnce.and.calledWith(props, {}, CONTEXT)
    expect(Inner.prototype.componentWillReceiveProps).to.have.been.calledWith(props, CONTEXT)
    expect(Inner.prototype.componentWillUpdate).to.have.been.calledWith(props, {})
    expect(Inner.prototype.componentDidUpdate).to.have.been.calledWith(props, {})
    expect(Inner.prototype.render).to.have.returned(sinon.match({ children: [createVText('a')] }))
  })

  it('should preserve existing context properties when creating child contexts', () => {
    const outerContext = { outer: 1 }
    const innerContext = { inner: 2 }
    class Outer extends Component {
      getChildContext () {
        return { ...outerContext }
      }
      render () {
        return <div><Inner /></div>
      }
    }

    class Inner extends Component {
      getChildContext () {
        return { ...innerContext }
      }
      render () {
        return <InnerMost />
      }
    }

    class InnerMost extends Component {
      render () {
        console.log(this.context)
        const { outer, inner } = this.context
        return <strong>{outer}{inner}</strong>
      }
    }

    render(<Outer />, scratch)
    expect(scratch.innerHTML).to.equal('<div><strong>12</strong></div>')
  })
})
