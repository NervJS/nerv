/** @jsx createElement */
import { Component, createElement, render, cloneElement, PureComponent } from '../../src'
import createVText from '../../src/vdom/create-vtext'
import { rerender } from '../../src/render-queue'

import { EMPTY_CHILDREN, getAttributes, sortAttributes } from '../util'

function fireEvent (on, type) {
  const e = document.createEvent('Event')
  e.initEvent(type, true, true)
  on.dispatchEvent(e)
}

const Empty = () => null
describe('Component', function () {
  this.timeout(20000)
  let scratch
  before(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    const c = scratch.firstElementChild
    if (c) {
      render(<Empty />, scratch)
    }
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should render components', () => {
    class C extends Component {
      render () {
        return <div>C</div>
      }
    }
    sinon.spy(C.prototype, 'render')
    render(<C />, scratch)

    expect(C.prototype.render)
      .to.have.been.calledOnce
      .and.to.have.returned(sinon.match({ tagName: 'div' }))

    expect(scratch.innerHTML).to.equal('<div>C</div>')
  })

  it('should render functional components', () => {
    const props = { foo: 'bar' }
    const C = sinon.spy(options => <div {...options} />)
    render(<C {...props} />, scratch)
    expect(C)
      .to.have.been.calledOnce
      .and.to.have.been.calledWithMatch(props)
      .and.to.have.returned(sinon.match({
        tagName: 'div'
      }))
    expect(scratch.innerHTML).to.equal('<div foo="bar"></div>')
  })

  it('should update nested functional components', () => {
    const A = <div>A</div>
    const B = <div>B</div>

    class C extends Component {
      constructor () {
        super()
        this.state = {
          show: true
        }
      }

      render () {
        return (
          <div>
            {this.state.show ? <A /> : <B />}
          </div>
        )
      }
    }
    let c
    render(<C ref={ins => (c = ins)} />, scratch)
    expect(scratch.innerHTML).to.equal('<div><div>A</div></div>')

    c.setState({
      show: false
    })
    c.forceUpdate()
    expect(scratch.innerHTML).to.equal('<div><div>B</div></div>')
  })

  it('should render components with props', () => {
    const props = { foo: 'bar', onBaz: () => { } }
    let constructorProps
    class C extends Component {
      constructor () {
        super(...arguments)
        constructorProps = props
      }
      render () {
        return <div {...this.props}>C</div>
      }
    }
    sinon.spy(C.prototype, 'render')
    render(<C {...props} />, scratch)
    expect(constructorProps).to.deep.equal(props)

    expect(C.prototype.render)
      .to.have.been.calledOnce
      .and.to.have.been.calledWithMatch()
      .and.to.have.returned(sinon.match({
        tagName: 'div'
      }))

    expect(scratch.innerHTML).to.equal('<div foo="bar">C</div>')
  })

  it('should clone components', () => {
    function Comp () { }
    const instance = <Comp />
    const clone = cloneElement(instance)
    expect(clone.prototype).to.equal(instance.prototype)
  })

  it('should remove children when root changes to text node', () => {
    let comp
    class Comp extends Component {
      render () {
        return this.state.alt ? 'asdf' : <div>test</div>
      }
    }

    render(<Comp ref={c => { comp = c }} />, scratch)

    comp.setState({ alt: true })
    comp.forceUpdate()
    expect(scratch.innerHTML, 'switching to textnode').to.equal('asdf')
    comp.setState({ alt: false })
    comp.forceUpdate()
    expect(scratch.innerHTML, 'switching to element').to.equal('<div>test</div>')

    comp.setState({ alt: true })
    comp.forceUpdate()
    expect(scratch.innerHTML, 'switching to textnode 2').to.equal('asdf')
  })

  it('should not recycle common class children with different keys', () => {
    let idx = 0
    const msgs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const sideEffect = sinon.spy()

    class Comp extends Component {
      componentWillMount () {
        this.innerMsg = msgs[(idx++ % 8)]
        sideEffect()
      }

      render () {
        return <div>{this.innerMsg}</div>
      }
    }
    sinon.spy(Comp.prototype, 'componentWillMount')

    class GoodContainer extends Component {
      constructor () {
        super(...arguments)
        this.state.alt = false
      }

      render () {
        const { alt } = this.state
        return (
          <div>
            {alt ? null : (<Comp key={1} alt={alt} />)}
            {alt ? null : (<Comp key={2} alt={alt} />)}
            {alt ? (<Comp key={3} alt={alt} />) : null}
          </div>
        )
      }
    }

    class BadContainer extends Component {
      constructor () {
        super(...arguments)
        this.state.alt = false
      }

      render () {
        const { alt } = this.state
        return (
          <div>
            {alt ? null : (<Comp alt={alt} />)}
            {alt ? null : (<Comp alt={alt} />)}
            {alt ? (<Comp alt={alt} />) : null}
          </div>
        )
      }
    }

    let good
    let bad
    render(<GoodContainer ref={c => (good = c)} />, scratch)
    expect(scratch.textContent, 'new component with key present').to.equal('AB')
    expect(Comp.prototype.componentWillMount).to.have.been.calledTwice
    expect(sideEffect).to.have.been.calledTwice

    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    good.setState({ alt: true })
    good.forceUpdate()
    expect(scratch.textContent, 'new component with key present re-rendered').to.equal('C')
    expect(Comp.prototype.componentWillMount).to.have.been.calledOnce
    expect(sideEffect).to.have.been.calledOnce

    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    scratch.innerHTML = ''
    render(<BadContainer ref={c => (bad = c)} />, scratch)
    expect(scratch.textContent, 'new component without key').to.equal('DE')
    expect(Comp.prototype.componentWillMount).to.have.been.calledTwice
    expect(sideEffect).to.have.been.calledTwice
    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    bad.setState({ alt: true })
    bad.forceUpdate()
    expect(scratch.textContent, 'new component without key re-rendered').to.equal('D')
    expect(Comp.prototype.componentWillMount).to.not.have.been.called
    expect(sideEffect).to.not.have.been.called
  })

  describe('defaultProps', () => {
    it('should apply default props on initial render', () => {
      class WithDefaultProps extends Component {
        constructor (props, context) {
          super(props, context)
          expect(props).to.be.deep.equal({
            children: EMPTY_CHILDREN,
            fieldA: 1,
            fieldB: 2,
            fieldC: 1,
            fieldD: 2
          })
        }
        render () {
          return <div />
        }
      }
      WithDefaultProps.defaultProps = { fieldC: 1, fieldD: 1 }
      render(<WithDefaultProps fieldA={1} fieldB={2} fieldD={2} />, scratch)
    })

    it('should apply default props on rerender', () => {
      let doRender
      class Outer extends Component {
        constructor () {
          super()
          this.state = { i: 1 }
        }
        componentDidMount () {
          doRender = () => this.setState({ i: 2 })
        }
        render () {
          return <WithDefaultProps fieldA={1} fieldB={this.state.i} fieldD={this.state.i} />
        }
      }
      class WithDefaultProps extends Component {
        constructor (props, context) {
          super(props, context)
          this.ctor(props, context)
        }
        ctor () {}
        renderCall () {}
        componentWillReceiveProps () {}
        render () {
          this.renderCall(this.props)
          return <div />
        }
      }
      WithDefaultProps.defaultProps = { fieldC: 1, fieldD: 1 }

      const proto = WithDefaultProps.prototype
      sinon.spy(proto, 'ctor')
      sinon.spy(proto, 'componentWillReceiveProps')
      sinon.spy(proto, 'renderCall')

      render(<Outer />, scratch)
      doRender()

      const PROPS1 = {
        fieldA: 1,
        fieldB: 1,
        fieldC: 1,
        fieldD: 1
      }

      const PROPS2 = {
        fieldA: 1,
        fieldB: 2,
        fieldC: 1,
        fieldD: 2
      }

      expect(proto.ctor).to.have.been.calledWithMatch(PROPS1)
      expect(proto.renderCall).to.have.been.calledWithMatch(PROPS1)

      rerender()

      expect(proto.componentWillReceiveProps).to.have.been.calledWithMatch(PROPS2)
      expect(proto.renderCall).to.have.been.calledWithMatch(PROPS2)
    })

    it('should cache default props', () => {
      class WithDefaultProps extends Component {
        constructor (props, context) {
          super(props, context)
          expect(props).to.be.deep.equal({
            children: EMPTY_CHILDREN,
            fieldA: 1,
            fieldB: 2,
            fieldC: 1,
            fieldD: 2,
            fieldX: 10
          })
        }
        render () {
          return <div />
        }
      }
      WithDefaultProps.defaultProps = {
        fieldA: 1,
        fieldB: 1,
        fieldC: 1,
        fieldD: 1
      }
      render((
        <div>
          <WithDefaultProps fieldB={2} fieldD={2} fieldX={10} />
          <WithDefaultProps fieldB={2} fieldD={2} fieldX={10} />
          <WithDefaultProps fieldB={2} fieldD={2} fieldX={10} />
        </div>
      ), scratch)
    })
  })

  describe('setState', () => {
    it('test setState async && batched', () => {
      class A extends Component {
        constructor (props) {
          super(props)
          this.state = {
            count: 1
          }
        }

        shouldComponentUpdate () {}

        componentWillUpdate () {}

        componentDidMount () {
          this.setState({
            count: this.state.count + 1
          })
          expect(this.state.count).to.equal(1)
          this.setState({
            count: this.state.count + 1
          })
          expect(this.state.count).to.equal(1)
        }

        render () {
          return <div>{this.state.count}</div>
        }
      }

      render(<A />, scratch)
      sinon.spy(A.prototype, 'componentWillUpdate')
      expect(A.prototype.componentWillUpdate).not.to.have.been.called
    })

    it('test setState first param to be a function and setState callback', () => {
      let a = 1
      class A extends Component {
        constructor (props) {
          super(props)
          this.state = {
            count: 1
          }
        }
        shouldComponentUpdate () {
          return false
        }
        click () {
          this.setState((s) => {
            s.count++
          }, () => {
            a++
          })

          this.setState((s) => {
            s.count++
          }, () => {
            a++
          })
        }
        render () {
          return <div onClick={this.click.bind(this)}>{this.state.count}</div>
        }
      }

      render(<A />, scratch)
      const firstChild = scratch.childNodes[0]
      expect(firstChild.innerHTML).to.equal('1')
      fireEvent(firstChild, 'click')
      rerender()
      expect(firstChild.innerHTML).to.equal('1')
      expect(a).to.equal(3)
    })
  })

  describe('forceUpdate', () => {
    it('should force a rerender', () => {
      let forceUpdate
      class ForceUpdateComponent extends Component {
        componentWillUpdate () {}
        componentDidMount () {
          forceUpdate = () => this.forceUpdate()
        }
        render () {
          return <div />
        }
      }
      sinon.spy(ForceUpdateComponent.prototype, 'componentWillUpdate')
      sinon.spy(ForceUpdateComponent.prototype, 'forceUpdate')
      render(<ForceUpdateComponent />, scratch)
      expect(ForceUpdateComponent.prototype.componentWillUpdate).not.to.have.been.called

      forceUpdate()

      expect(ForceUpdateComponent.prototype.componentWillUpdate).to.have.been.called
      expect(ForceUpdateComponent.prototype.forceUpdate).to.have.been.called
    })

    it('should add callback to renderCallbacks', () => {
      let forceUpdate
      const callback = sinon.spy()
      class ForceUpdateComponent extends Component {
        componentDidMount () {
          forceUpdate = () => this.forceUpdate(callback)
        }
        render () {
          return <div />
        }
      }
      sinon.spy(ForceUpdateComponent.prototype, 'forceUpdate')
      render(<ForceUpdateComponent />, scratch)

      forceUpdate()

      expect(ForceUpdateComponent.prototype.forceUpdate).to.have.been.called
      expect(ForceUpdateComponent.prototype.forceUpdate).to.have.been.calledWith(callback)
      expect(callback).to.have.been.called
    })
  })

  describe('props.children', () => {
    it('should support passing children as a prop', () => {
      const Foo = props => <div {...props} />

      render(
        <Foo a='b' children={[
          <span class='bar'>bar</span>,
          '123',
          456
        ]} />, scratch)

      expect(scratch.innerHTML).to.equal('<div a="b"><span class="bar">bar</span>123456</div>')
    })

    it('should be ignored when explicit children exist', () => {
      const Foo = props => <div {...props}>a</div>
      render(<Foo children={'b'} />, scratch)
      expect(scratch.innerHTML).to.equal('<div>a</div>')
    })
  })

  describe('PureComponent', () => {
    it('use PureComponent', () => {
      class App extends PureComponent {
        constructor (props) {
          super(props)
          this.state = {
            a: 7
          }
        }

        click () {
          this.setState({
            a: 7
          })
        }
        componentWillUpdate () {}
        render () {
          return <div onClick={this.click.bind(this)}>{this.state.a}</div>
        }
      }
      sinon.spy(App.prototype, 'componentWillUpdate')
      const s = render(<App />, scratch)
      expect(s.dom.innerHTML).to.equal('7')
      fireEvent(scratch.childNodes[0], 'click')
      rerender()
      expect(s.dom.innerHTML).to.equal('7')
      expect(App.prototype.componentWillUpdate).not.to.have.been.called
    })

    it('render child PureComponent', () => {
      class C extends PureComponent {
        constructor (props) {
          super(props)
          this.state = {
            a: 7
          }
        }
        componentWillUpdate () {}
        render () {
          return <div>{this.state.a}</div>
        }
      }

      class App extends Component {
        render () {
          return <C />
        }
      }
      let c
      sinon.spy(C.prototype, 'componentWillUpdate')
      const s = render(<App ref={node => (c = node)} />, scratch)
      expect(s.dom.innerHTML).to.equal('7')
      c.setState({
        xx: 1
      })
      c.forceUpdate()
      expect(s.dom.innerHTML).to.equal('7')
      expect(C.prototype.componentWillUpdate).not.to.have.been.called
    })
  })

  describe('High-Order Components', () => {
    it('should render nested functional components', () => {
      const PROPS = { foo: 'bar', onBaz: () => {} }

      const Outer = sinon.spy(
        props => <Inner {...props} />
      )

      const Inner = sinon.spy(
        props => <div {...props}>inner</div>
      )

      render(<Outer {...PROPS} />, scratch)

      expect(Outer)
      .to.have.been.calledOnce
      .and.to.have.been.calledWithMatch(PROPS)
      .and.to.have.returned(sinon.match({
        tagName: Inner,
        props: PROPS
      }))

      expect(Inner)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithMatch(PROPS)
        .and.to.have.returned(sinon.match({
          tagName: 'div',
          children: [createVText('inner')],
          props: sinon.match.has('foo')
        }))

      expect(scratch.innerHTML).to.equal('<div foo="bar">inner</div>')
    })

    it('should re-render nested functional components', () => {
      let doRender = null
      class Outer extends Component {
        componentDidMount () {
          let i = 1
          doRender = () => this.setState({ i: ++i })
        }
        componentWillUnmount () {}
        render () {
          return <Inner i={this.state.i} {...this.props} />
        }
      }
      sinon.spy(Outer.prototype, 'render')
      sinon.spy(Outer.prototype, 'componentWillUnmount')

      let j = 0
      const Inner = sinon.spy(
        props => <div j={++j} {...props}>inner</div>
      )

      render(<Outer foo='bar' />, scratch)

      doRender()
      rerender()

      expect(Outer.prototype.componentWillUnmount)
        .not.to.have.been.called

      expect(Inner).to.have.been.calledTwice

      expect(Inner.secondCall)
        .to.have.been.calledWithMatch({ foo: 'bar', i: 2 })
        .and.to.have.returned(sinon.match({
          props: {
            j: 2,
            i: 2,
            foo: 'bar'
          }
        }))

      expect(getAttributes(scratch.firstElementChild)).to.eql({
        j: '2',
        i: '2',
        foo: 'bar'
      })

      doRender()
      rerender()

      expect(Inner).to.have.been.calledThrice

      expect(Inner.thirdCall)
        .to.have.been.calledWithMatch({ foo: 'bar', i: 3 })
        .and.to.have.returned(sinon.match({
          props: {
            j: 3,
            i: 3,
            foo: 'bar'
          }
        }))

      expect(getAttributes(scratch.firstElementChild)).to.eql({
        j: '3',
        i: '3',
        foo: 'bar'
      })
    })

    it('should re-render nested components', () => {
      let doRender = null
      let alt = false

      class Outer extends Component {
        componentDidMount () {
          let i = 1
          doRender = () => this.setState({ i: ++i })
        }
        componentWillUnmount () {}
        render () {
          if (alt) return <div is-alt />
          return <Inner i={this.state.i} {...this.props} />
        }
      }
      sinon.spy(Outer.prototype, 'render')
      sinon.spy(Outer.prototype, 'componentDidMount')
      sinon.spy(Outer.prototype, 'componentWillUnmount')

      let j = 0
      class Inner extends Component {
        constructor (...args) {
          super(...args)
          this._constructor(...args)
        }
        _constructor () {}
        componentWillMount () {}
        componentDidMount () {}
        componentWillUnmount () {}
        render () {
          return <div j={++j} {...this.props}>inner</div>
        }
      }
      sinon.spy(Inner.prototype, '_constructor')
      sinon.spy(Inner.prototype, 'render')
      sinon.spy(Inner.prototype, 'componentWillMount')
      sinon.spy(Inner.prototype, 'componentDidMount')
      sinon.spy(Inner.prototype, 'componentWillUnmount')

      render(<Outer foo='bar' />, scratch)

      expect(Outer.prototype.componentDidMount).to.have.been.calledOnce

      doRender()
      rerender()

      expect(Outer.prototype.componentWillUnmount).not.to.have.been.called

      expect(Inner.prototype._constructor).to.have.been.calledOnce
      expect(Inner.prototype.componentWillUnmount).not.to.have.been.called
      expect(Inner.prototype.componentWillMount).to.have.been.calledOnce
      expect(Inner.prototype.componentDidMount).to.have.been.calledOnce
      expect(Inner.prototype.render).to.have.been.calledTwice

      expect(Inner.prototype.render.secondCall)
        .and.to.have.returned(sinon.match({
          props: {
            j: 2,
            i: 2,
            foo: 'bar'
          }
        }))

      expect(getAttributes(scratch.firstElementChild)).to.eql({
        j: '2',
        i: '2',
        foo: 'bar'
      })

      expect(sortAttributes(scratch.innerHTML)).to.equal(sortAttributes('<div foo="bar" j="2" i="2">inner</div>'))

      doRender()
      rerender()

      expect(Inner.prototype.componentWillUnmount).not.to.have.been.called
      expect(Inner.prototype.componentWillMount).to.have.been.calledOnce
      expect(Inner.prototype.componentDidMount).to.have.been.calledOnce
      expect(Inner.prototype.render).to.have.been.calledThrice

      expect(Inner.prototype.render.thirdCall)
        .and.to.have.returned(sinon.match({
          props: {
            j: 3,
            i: 3,
            foo: 'bar'
          }
        }))

      expect(getAttributes(scratch.firstElementChild)).to.eql({
        j: '3',
        i: '3',
        foo: 'bar'
      })

      alt = true
      doRender()
      rerender()

      expect(Inner.prototype.componentWillUnmount).to.have.been.calledOnce

      expect(scratch.innerHTML).to.equal('<div is-alt="true"></div>')

      alt = false
      doRender()
      rerender()

      expect(sortAttributes(scratch.innerHTML)).to.equal(sortAttributes('<div foo="bar" j="4" i="5">inner</div>'))
    })

    it('should resolve intermediary functional component', () => {
      const ctx = {}
      class Root extends Component {
        getChildContext () {
          return { ctx }
        }
        render () {
          return <Func />
        }
      }
      const Func = sinon.spy(() => <Inner />)
      class Inner extends Component {
        componentWillMount () {}
        componentDidMount () {}
        componentWillUnmount () {}
        render () {
          return <div>inner</div>
        }
      }
      sinon.spy(Inner.prototype, 'componentWillMount')
      sinon.spy(Inner.prototype, 'componentDidMount')
      render(<Root />, scratch)
      expect(Inner.prototype.componentWillMount).to.have.been.calledOnce
      expect(Inner.prototype.componentDidMount).to.have.been.calledOnce
      expect(Inner.prototype.componentWillMount).to.have.been.calledBefore(Inner.prototype.componentDidMount)
    })

    it('should unmount children of high-order components without unmounting parent', () => {
      let outer
      let inner2
      let counter = 0

      class Outer extends Component {
        constructor (props, context) {
          super(props, context)
          outer = this
          this.state = {
            child: this.props.child
          }
        }
        componentWillUnmount () { }
        componentWillMount () { }
        componentDidMount () { }
        render () {
          const C = this.state.child
          return <C />
        }
      }

      sinon.spy(Outer.prototype, 'render')
      sinon.spy(Outer.prototype, 'componentWillMount')
      sinon.spy(Outer.prototype, 'componentDidMount')
      sinon.spy(Outer.prototype, 'componentWillUnmount')

      class Inner extends Component {
        componentWillUnmount () {}
        componentWillMount () {}
        componentDidMount () {}
        render () {
          return createElement('element' + (++counter))
        }
      }

      sinon.spy(Inner.prototype, 'render')
      sinon.spy(Inner.prototype, 'componentWillMount')
      sinon.spy(Inner.prototype, 'componentDidMount')
      sinon.spy(Inner.prototype, 'componentWillUnmount')

      class Inner2 extends Component {
        constructor (props, context) {
          super(props, context)
          inner2 = this
        }
        componentWillUnmount () {}
        componentWillMount () {}
        componentDidMount () {}
        render () {
          return createElement('element' + (++counter))
        }
      }

      sinon.spy(Inner2.prototype, 'render')
      sinon.spy(Inner2.prototype, 'componentWillMount')
      sinon.spy(Inner2.prototype, 'componentDidMount')
      sinon.spy(Inner2.prototype, 'componentWillUnmount')

      render(<Outer child={Inner} />, scratch)

      expect(Outer.prototype.componentWillMount, 'outer initial').to.have.been.calledOnce
      expect(Outer.prototype.componentDidMount, 'outer initial').to.have.been.calledOnce
      expect(Outer.prototype.componentWillUnmount, 'outer initial').not.to.have.been.called

      expect(Inner.prototype.componentWillMount, 'inner initial').to.have.been.calledOnce
      expect(Inner.prototype.componentDidMount, 'inner initial').to.have.been.calledOnce
      expect(Inner.prototype.componentWillUnmount, 'inner initial').not.to.have.been.called

      outer.setState({ child: Inner2 })
      outer.forceUpdate()

      expect(Inner2.prototype.render).to.have.been.calledOnce

      expect(Outer.prototype.componentWillMount, 'outer swap').to.have.been.calledOnce
      expect(Outer.prototype.componentDidMount, 'outer swap').to.have.been.calledOnce
      expect(Outer.prototype.componentWillUnmount, 'outer swap').not.to.have.been.called

      expect(Inner2.prototype.componentWillMount, 'inner2 swap').to.have.been.calledOnce
      expect(Inner2.prototype.componentDidMount, 'inner2 swap').to.have.been.calledOnce
      expect(Inner2.prototype.componentWillUnmount, 'inner2 swap').not.to.have.been.called

      inner2.forceUpdate()

      expect(Inner2.prototype.render, 'inner2 update').to.have.been.calledTwice
      expect(Inner2.prototype.componentWillMount, 'inner2 update').to.have.been.calledOnce
      expect(Inner2.prototype.componentDidMount, 'inner2 update').to.have.been.calledOnce
      expect(Inner2.prototype.componentWillUnmount, 'inner2 update').not.to.have.been.called
    })

    it('should remount when swapping between HOC child types', () => {
      let doRender = null

      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            child: this.props.child
          }
        }

        componentDidMount () {
          doRender = () => this.setState({
            child: <InnerFunc />
          })
        }

        render () {
          const Child = this.state.child
          return <Child />
        }
      }

      class Inner extends Component {
        componentWillMount () {}
        componentWillUnmount () {}
        render () {
          return <div class='inner'>foo</div>
        }
      }

      sinon.spy(Inner.prototype, 'render')
      sinon.spy(Inner.prototype, 'componentWillMount')
      sinon.spy(Inner.prototype, 'componentWillUnmount')

      const InnerFunc = () => (
        <div class='inner-func'>bar</div>
      )

      render(<Outer child={Inner} />, scratch)

      expect(Inner.prototype.componentWillMount, 'initial mount').to.have.been.calledOnce
      expect(Inner.prototype.componentWillUnmount, 'initial mount').not.to.have.been.called

      Inner.prototype.componentWillMount.reset()
      doRender()
      rerender()
      expect(Inner.prototype.componentWillMount, 'unmount').not.to.have.been.called
      expect(Inner.prototype.componentWillUnmount, 'unmount').to.have.been.calledOnce
    })
  })
})
