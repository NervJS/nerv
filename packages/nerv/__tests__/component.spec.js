/** @jsx createElement */
import {
  Component,
  createElement,
  render,
  cloneElement,
  PureComponent,
  findDOMNode,
  memo
} from '../src'
// import createVText from '../src/vdom/create-vtext'
import { rerender } from '../src/render-queue'
import sinon from 'sinon'
import {
  EMPTY_CHILDREN,
  getAttributes,
  sortAttributes,
  normalizeHTML
} from './util'

function fireEvent (on, type) {
  const e = document.createEvent('Event')
  e.initEvent(type, true, true)
  on.dispatchEvent(e)
}

describe('Component', function () {
  let scratch
  beforeAll(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
    // const c = scratch.firstElementChild
    // if (c) {
    //   render(<Empty />, scratch)
    // }
    // scratch.innerHTML = ''
  })

  afterAll(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should render components', () => {
    class C extends Component {
      render () {
        return <div>C</div>
      }
    }
    const spy = sinon.spy(C.prototype, 'render')
    render(<C />, scratch)

    expect(spy.calledOnce).toBeTruthy()
    expect(spy.returned(sinon.match({ type: 'div' }))).toBeTruthy()

    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>C</div>'))
  })

  it('call setState() in setState\'s callback', (done) => {
    const s1 = sinon.spy()
    const s2 = sinon.spy()
    const s3 = sinon.spy()
    class App extends Component {
      state = {
        a: false,
        b: false,
        c: false
      }

      componentDidMount () {
        this.setState(
          {
            a: true
          },
          () => {
            s1()
            this.setState(
              {
                b: true
              },
              () => {
                s2()
                expect(this.state.a).toBe(true)
                expect(this.state.b).toBe(true)
                expect(s1.called).toBeTruthy()
                expect(s2.called).toBeTruthy()
                expect(s2.calledAfter(s1)).toBeTruthy()
              }
            )

            this.setState({ c: true }, () => {
              s3()
              expect(this.state.a).toBe(true)
              expect(this.state.b).toBe(true)
              expect(this.state.c).toBe(true)
              expect(s1.called).toBeTruthy()
              expect(s2.called).toBeTruthy()
              expect(s3.calledAfter(s2)).toBeTruthy()
              done()
            })
          }
        )
      }
      render () {
        return <div />
      }
    }
    render(<App />, scratch)
  })

  it('is a react component', () => {
    class C extends Component {
      render () {
        return <div>C</div>
      }
    }
    let c
    render(<C ref={ins => (c = ins)} />, scratch)

    expect(!!Component.prototype.isReactComponent).toBeTruthy()
    expect(!!c.isReactComponent).toBeTruthy()
  })

  it('should render functional components', () => {
    const props = { foo: 'bar' }
    const C = sinon.spy(options => <div {...options} />)
    render(<C {...props} />, scratch)
    expect(C.calledOnce).toBeTruthy()
    expect(C.calledWithMatch(props)).toBeTruthy()
    expect(
      C.returned(
        sinon.match({
          type: 'div'
        })
      )
    ).toBeTruthy()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div foo="bar"></div>'))
  })

  it('should callback run once', () => {
    const C = <div />
    const f = sinon.spy()
    render(C, scratch, f)
    expect(f.calledOnce).toBeTruthy()
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
        return <div>{this.state.show ? <A /> : <B />}</div>
      }
    }
    let c
    render(<C ref={ins => (c = ins)} />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div><div>A</div></div>'))

    c.setState({
      show: false
    })
    c.forceUpdate()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div><div>B</div></div>'))
  })

  it('should render components with props', () => {
    const props = { foo: 'bar', onBaz: () => {} }
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
    const spy = sinon.spy(C.prototype, 'render')
    render(<C {...props} />, scratch)
    expect(constructorProps).toBe(props)

    expect(spy.calledOnce).toBeTruthy()
    expect(spy.calledWithMatch()).toBeTruthy()
    expect(
      spy.returned(
        sinon.match({
          type: 'div'
        })
      )
    ).toBeTruthy()
    // .to.have.been.calledOnce
    // .and.to.have.been.calledWithMatch()
    // .and.to.have.returned(sinon.match({
    //   type: 'div'
    // }))

    expect(scratch.innerHTML).toEqual(normalizeHTML('<div foo="bar">C</div>'))
  })

  it('should clone components', () => {
    function Comp () {}
    const instance = <Comp />
    const clone = cloneElement(instance)
    expect(clone.prototype).toEqual(instance.prototype)
  })

  it('should clone children as well', () => {
    let inst
    class Child extends Component {
      render () {
        return (
          <div>
            {this.props.children}
            {this.props.children}
          </div>
        )
      }
    }

    class Daddy extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          xxx: 'xxx'
        }
        inst = this
      }
      render () {
        const xxx = this.state.xxx
        return <Child>{xxx ? <div>{xxx}</div> : ''}</Child>
      }
    }

    expect(() => {
      render(<Daddy />, scratch)
      inst.setState({ xxx: false })
      inst.forceUpdate()
    }).not.toThrow()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div></div>'))
  })

  it('should remove children when root changes to text node', () => {
    let comp
    class Comp extends Component {
      render () {
        return this.state.alt ? 'asdf' : <div>test</div>
      }
    }

    render(
      <Comp
        ref={c => {
          comp = c
        }}
      />,
      scratch
    )
    comp.setState({ alt: true })
    comp.forceUpdate()
    expect(scratch.innerHTML).toEqual('asdf')
    comp.setState({ alt: false })
    comp.forceUpdate()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>test</div>'))

    comp.setState({ alt: true })
    comp.forceUpdate()
    expect(scratch.innerHTML).toEqual('asdf')
  })

  it('should not recycle common class children with different keys', () => {
    let scratch = document.createElement('div')
    const container = document.createElement('div')
    container.appendChild(scratch)
    document.body.appendChild(container)
    let idx = 0
    const msgs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const sideEffect = sinon.spy()

    class Comp extends Component {
      componentWillMount () {
        this.innerMsg = msgs[idx++ % 8]
        sideEffect()
      }

      render () {
        return <div>{this.innerMsg}</div>
      }
    }
    const willMount = sinon.spy(Comp.prototype, 'componentWillMount')

    class GoodContainer extends Component {
      state = {
        alt: false
      }

      render () {
        const { alt } = this.state
        return (
          <div>
            {alt ? null : <Comp key={1} alt={alt} />}
            {alt ? null : <Comp key={2} alt={alt} />}
            {alt ? <Comp key={3} alt={alt} /> : null}
          </div>
        )
      }
    }

    class BadContainer extends Component {
      state = {
        alt: false
      }

      render () {
        const { alt } = this.state
        return (
          <div>
            {alt ? null : <Comp alt={alt} />}
            {alt ? null : <Comp alt={alt} />}
            {alt ? <Comp alt={alt} /> : null}
          </div>
        )
      }
    }

    let good
    let bad
    render(<GoodContainer ref={c => (good = c)} />, scratch)
    expect(scratch.textContent).toEqual('AB')
    expect(willMount.calledTwice).toBeTruthy()
    expect(sideEffect.calledTwice).toBeTruthy()

    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    good.setState({ alt: true })
    good.forceUpdate()
    expect(scratch.textContent).toEqual('C')
    expect(willMount.calledOnce).toBeTruthy()
    expect(sideEffect.calledOnce).toBeTruthy()

    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    scratch.innerHTML = ''
    scratch = document.createElement('div')
    render(<BadContainer ref={c => (bad = c)} />, scratch)
    expect(scratch.textContent).toEqual('DE')
    expect(willMount.calledTwice).toBeTruthy()
    expect(sideEffect.calledTwice).toBeTruthy()
    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    bad.setState({ alt: true })
    bad.forceUpdate()
    expect(scratch.textContent).toEqual('F')
    expect(willMount.called).toBeTruthy()
    expect(sideEffect.called).toBeTruthy()
  })

  describe('defaultProps', () => {
    it('should apply default props on initial render', () => {
      class WithDefaultProps extends Component {
        constructor (props, context) {
          super(props, context)
          expect(props).toEqual({
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
          return (
            <WithDefaultProps
              fieldA={1}
              fieldB={this.state.i}
              fieldD={this.state.i}
            />
          )
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
      const ctor = sinon.spy(proto, 'ctor')
      const receiveProps = sinon.spy(proto, 'componentWillReceiveProps')
      const renderCall = sinon.spy(proto, 'renderCall')

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

      expect(ctor.calledWithMatch(PROPS1)).toBeTruthy()
      expect(renderCall.calledWithMatch(PROPS1)).toBeTruthy()

      rerender()

      expect(receiveProps.calledWithMatch(PROPS2)).toBeTruthy()
      expect(renderCall.calledWithMatch(PROPS2)).toBeTruthy()
    })

    it('should cache default props', () => {
      class WithDefaultProps extends Component {
        constructor (props, context) {
          super(props, context)
          expect(props).toEqual({
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
      render(
        <div>
          <WithDefaultProps fieldB={2} fieldD={2} fieldX={10} />
          <WithDefaultProps fieldB={2} fieldD={2} fieldX={10} />
          <WithDefaultProps fieldB={2} fieldD={2} fieldX={10} />
        </div>,
        scratch
      )
    })

    it('(Component) defaultProps should respect null but ignore undefined', () => {
      class Text extends Component {
        render () {
          const { text } = this.props
          return <div>{text === null ? 'null' : text}</div>
        }
      }
      Text.defaultProps = {
        text: 'aaa'
      }
      const dom = render(
        <div>
          <Text text={null} /> <Text />
        </div>,
        scratch
      )
      expect(dom.firstChild.textContent).toEqual('null')
      expect(dom.lastChild.textContent).toEqual('aaa')
    })

    it('should not update when patch the same STC', () => {
      const App = () => <div />
      const app = <App />
      render(app, scratch)
      render(app, scratch)
      expect(scratch._component).toBe(app)
    })

    it('(StatelessComponent) defaultProps should respect null but ignore undefined', () => {
      const Text = ({ text }) => <div>{text === null ? 'null' : text}</div>
      Text.defaultProps = {
        text: 'aaa'
      }
      const dom = render(
        <div>
          <Text text={null} /> <Text />
        </div>,
        scratch
      )
      expect(dom.firstChild.textContent).toEqual('null')
      expect(dom.lastChild.textContent).toEqual('aaa')
    })

    it('(StatelessComponent) should support function returning null', () => {
      const FunctionReturningNull = () => null
      expect(() => {
        render(<FunctionReturningNull />, scratch)
      }).not.toThrow()
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
          expect(this.state.count).toEqual(1)
          this.setState({
            count: this.state.count + 1
          })
          expect(this.state.count).toEqual(1)
        }

        render () {
          return <div>{this.state.count}</div>
        }
      }

      render(<A />, scratch)
      const spy = sinon.spy(A.prototype, 'componentWillUpdate')
      expect(spy.called).toBeFalsy()
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
          this.setState(
            s => {
              s.count++
            },
            () => {
              a++
            }
          )

          this.setState(
            s => {
              s.count++
            },
            () => {
              a++
            }
          )
        }
        render () {
          return <div onClick={this.click.bind(this)}>{this.state.count}</div>
        }
      }
      render(<A />, scratch)
      const firstChild = scratch.childNodes[0]
      expect(firstChild.innerHTML).toEqual('1')
      fireEvent(firstChild, 'click')
      rerender()
      expect(firstChild.innerHTML).toEqual('1')
      expect(a).toEqual(3)
    })

    it('should set state while first arg is function', async () => {
      let inst
      class A extends Component {
        constructor (props) {
          super(props)
          this.state = {
            count: 1
          }
          inst = this
        }
        shouldComponentUpdate () {
          return false
        }
        click () {
          this.setState(() => {
            return { count: 2 }
          })
        }
        render () {
          return <div onClick={this.click.bind(this)}>{this.state.count}</div>
        }
      }

      render(<A />, scratch)
      const firstChild = scratch.childNodes[0]
      expect(firstChild.innerHTML).toEqual('1')
      fireEvent(firstChild, 'click')
      rerender()
      expect(inst.state.count).toBe(2)
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
      const willUpdate = sinon.spy(
        ForceUpdateComponent.prototype,
        'componentWillUpdate'
      )
      const forceUpdateSpy = sinon.spy(
        ForceUpdateComponent.prototype,
        'forceUpdate'
      )
      render(<ForceUpdateComponent />, scratch)
      expect(willUpdate.called).toBeFalsy()

      forceUpdate()

      expect(willUpdate.called).toBeTruthy()
      expect(forceUpdateSpy.called).toBeTruthy()
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
      const spy = sinon.spy(ForceUpdateComponent.prototype, 'forceUpdate')
      render(<ForceUpdateComponent />, scratch)

      forceUpdate()

      expect(spy.called).toBeTruthy()
      expect(spy.calledWith(callback)).toBeTruthy()
      expect(callback.call).toBeTruthy()
    })
  })

  describe('props.children', () => {
    it('should support passing children as a prop', () => {
      const Foo = props => <div {...props} />

      render(
        <Foo a='b' children={[<span class='bar'>bar</span>, '123', 456]} />,
        scratch
      )

      expect(scratch.innerHTML).toEqual(
        normalizeHTML('<div a="b"><span class="bar">bar</span>123456</div>')
      )
    })

    it('should be ignored when explicit children exist', () => {
      const Foo = props => <div {...props}>a</div>
      render(<Foo children={'b'} />, scratch)
      expect(scratch.innerHTML).toEqual(normalizeHTML('<div>a</div>'))
    })

    it('should not be ignored when pass a empty children', () => {
      const Foo = props => <div>{props.children}</div>
      const Bar = props => <Foo {...props}>{'b'}</Foo>
      render(<Bar />, scratch)
      expect(scratch.innerHTML).toEqual(normalizeHTML('<div>b</div>'))
    })
  })

  describe('memo()', () => {
    it('should work with function components', () => {
      const spy = sinon.spy()

      function Foo () {
        spy()
        return <h1>Hello World</h1>
      }

      const Memoized = memo(Foo)

      let update
      class App extends Component {
        constructor () {
          super()
          update = () => this.setState({})
        }
        render () {
          return <Memoized />
        }
      }
      render(<App />, scratch)

      expect(spy.calledOnce).toBeTruthy()

      update()
      rerender()

      expect(spy.calledOnce).toBeTruthy()
    })

    it('should support custom comparer functions', () => {
      function Foo () {
        return <h1>Hello World</h1>
      }

      const spy = sinon.spy(() => true)
      const Memoized = memo(Foo, spy)

      let update
      class App extends Component {
        constructor () {
          super()
          update = () => this.setState({})
        }
        render () {
          return <Memoized />
        }
      }
      render(<App />, scratch)

      update()
      rerender()

      expect(spy.calledOnce).toBeTruthy()
      expect(spy.calledWith({ children: [] }, { children: [] })).toBeTruthy()
    })

    it('should rerender when custom comparer returns false', () => {
      const spy = sinon.spy()
      function Foo () {
        spy()
        return <h1>Hello World</h1>
      }

      const App = memo(Foo, () => false)
      render(<App />, scratch)
      expect(spy.calledOnce).toBeTruthy()

      render(<App foo='bar' />, scratch)
      expect(spy.calledTwice).toBeTruthy()
    })

    // it('should pass props and nextProps to comparer fn', () => {
    //   const spy = sinon.spy(() => false)
    //   function Foo() {
    //     return <div>foo</div>
    //   }

    //   const props = { foo: true };
    //   const nextProps = { foo: false };
    //   const App = memo(Foo, spy);
    //   render(h(App, props), scratch);
    //   render(h(App, nextProps), scratch);

    //   expect(spy).to.be.calledWith(props, nextProps);
    // })

    it('should nest without errors', () => {
      const Foo = () => <div>foo</div>
      const App = memo(memo(Foo))

      // eslint-disable-next-line prefer-arrow-callback
      expect(function () {
        render(<App />, scratch)
      }).not.toThrow()
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
      const spy = sinon.spy(App.prototype, 'componentWillUpdate')
      const s = render(<App />, scratch)
      expect(findDOMNode(s).innerHTML).toEqual('7')
      fireEvent(scratch.childNodes[0], 'click')
      rerender()
      expect(findDOMNode(s).innerHTML).toEqual('7')
      expect(spy.called).toBeFalsy()
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
      const spy = sinon.spy(C.prototype, 'componentWillUpdate')
      const s = render(<App ref={node => (c = node)} />, scratch)
      expect(findDOMNode(s).innerHTML).toEqual('7')
      c.setState({
        xx: 1
      })
      c.forceUpdate()
      expect(findDOMNode(s).innerHTML).toEqual('7')
      expect(spy.called).toBeFalsy()
    })
  })

  describe('High-Order Components', () => {
    it('should render nested functional components', () => {
      const PROPS = { foo: 'bar', onBaz: () => {} }

      const Outer = sinon.spy(props => <Inner {...props} />)

      const Inner = sinon.spy(props => <div {...props}>inner</div>)

      render(<Outer {...PROPS} />, scratch)

      expect(Outer.calledOnce).toBeTruthy()
      expect(Outer.calledWithMatch(PROPS)).toBeTruthy()
      expect(
        Outer.returned(
          sinon.match({
            type: Inner,
            props: PROPS
          })
        )
      ).toBeTruthy()
      expect(Inner.calledOnce).toBeTruthy()
      expect(Inner.calledWithMatch(PROPS)).toBeTruthy()
      expect(
        Inner.returned(
          sinon.match({
            type: 'div',
            // children: [createVText('inner')],
            props: sinon.match.has('foo')
          })
        )
      ).toBeTruthy()

      expect(scratch.innerHTML).toEqual(
        normalizeHTML('<div foo="bar">inner</div>')
      )
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
      // const renderSpy = sinon.spy(Outer.prototype, 'render')
      const willMount = sinon.spy(Outer.prototype, 'componentWillUnmount')

      let j = 0
      const Inner = sinon.spy(props => (
        <div j={++j} {...props}>
          inner
        </div>
      ))

      render(<Outer foo='bar' />, scratch)

      doRender()
      rerender()

      expect(willMount.called).toBeFalsy()
      expect(Inner.calledTwice).toBeTruthy()

      expect(Inner.calledTwice).toBeTruthy()
      expect(
        Inner.secondCall.calledWithMatch({ foo: 'bar', i: 2 })
      ).toBeTruthy()
      expect(
        Inner.secondCall.returned(
          sinon.match({
            props: {
              j: 2,
              i: 2,
              foo: 'bar'
            }
          })
        )
      ).toBeTruthy()

      expect(getAttributes(scratch.firstElementChild)).toEqual({
        j: '2',
        i: '2',
        foo: 'bar'
      })

      doRender()
      rerender()

      expect(Inner.callCount).toBe(3)

      expect(Inner.thirdCall.calledWithMatch({ foo: 'bar', i: 3 })).toBeTruthy()
      expect(
        Inner.thirdCall.returned(
          sinon.match({
            props: {
              j: 3,
              i: 3,
              foo: 'bar'
            }
          })
        )
      ).toBeTruthy()

      expect(getAttributes(scratch.firstElementChild)).toEqual({
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
      // const outerRender = sinon.spy(Outer.prototype, 'render')
      const outterDidMount = sinon.spy(Outer.prototype, 'componentDidMount')
      const outerWillUnmount = sinon.spy(
        Outer.prototype,
        'componentWillUnmount'
      )

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
          return (
            <div j={++j} {...this.props}>
              inner
            </div>
          )
        }
      }
      const innerCtor = sinon.spy(Inner.prototype, '_constructor')
      const innerRender = sinon.spy(Inner.prototype, 'render')
      const innerWillMount = sinon.spy(Inner.prototype, 'componentWillMount')
      const innerDidMount = sinon.spy(Inner.prototype, 'componentDidMount')
      const innerWillUnmount = sinon.spy(
        Inner.prototype,
        'componentWillUnmount'
      )

      render(<Outer foo='bar' />, scratch)

      expect(outterDidMount.calledOnce).toBeTruthy()

      doRender()
      rerender()

      expect(outerWillUnmount.called).toBeFalsy()

      expect(innerCtor.calledOnce).toBeTruthy()
      expect(innerWillUnmount.called).toBeFalsy()
      expect(innerWillMount.calledOnce).toBeTruthy()
      expect(innerDidMount.calledOnce).toBeTruthy()
      expect(innerRender.calledTwice).toBeTruthy()

      expect(
        innerRender.secondCall.returned(
          sinon.match({
            props: {
              j: 2,
              i: 2,
              foo: 'bar'
            }
          })
        )
      )
      // .and.to.have.returned(sinon.match({
      //   props: {
      //     j: 2,
      //     i: 2,
      //     foo: 'bar'
      //   }
      // }))

      expect(getAttributes(scratch.firstElementChild)).toEqual({
        j: '2',
        i: '2',
        foo: 'bar'
      })

      expect(sortAttributes(scratch.innerHTML).toLowerCase()).toEqual(
        sortAttributes('<div foo="bar" j="2" i="2">inner</div>')
      )

      doRender()
      rerender()

      expect(innerWillUnmount.called).toBeFalsy()
      expect(innerWillMount.calledOnce).toBeTruthy()
      expect(innerDidMount.calledOnce).toBeTruthy()
      expect(innerRender.calledThrice).toBeTruthy()

      expect(
        innerRender.thirdCall.returned(
          sinon.match({
            props: {
              j: 3,
              i: 3,
              foo: 'bar'
            }
          })
        )
      ).toBeTruthy()
      // .and.to.have.returned(sinon.match({
      //   props: {
      //     j: 3,
      //     i: 3,
      //     foo: 'bar'
      //   }
      // }))

      expect(getAttributes(scratch.firstElementChild)).toEqual({
        j: '3',
        i: '3',
        foo: 'bar'
      })

      alt = true
      doRender()
      rerender()

      expect(innerWillUnmount.calledOnce).toBeTruthy()

      expect(scratch.innerHTML).toEqual(
        normalizeHTML('<div is-alt="true"></div>')
      )

      alt = false
      doRender()
      rerender()

      expect(sortAttributes(scratch.innerHTML).toLowerCase()).toEqual(
        sortAttributes('<div foo="bar" j="4" i="5">inner</div>')
      )
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
      const willMount = sinon.spy(Inner.prototype, 'componentWillMount')
      const didMount = sinon.spy(Inner.prototype, 'componentDidMount')
      render(<Root />, scratch)
      expect(willMount.calledOnce).toBeTruthy()
      expect(didMount.calledOnce).toBeTruthy()
      expect(willMount.calledBefore(didMount)).toBeTruthy()
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
        componentWillUnmount () {}
        componentWillMount () {}
        componentDidMount () {}
        render () {
          const C = this.state.child
          return <C />
        }
      }

      // const outerRender = sinon.spy(Outer.prototype, 'render')
      const outerWillMount = sinon.spy(Outer.prototype, 'componentWillMount')
      const outerDidMount = sinon.spy(Outer.prototype, 'componentDidMount')
      const outerWillUnmount = sinon.spy(
        Outer.prototype,
        'componentWillUnmount'
      )

      class Inner extends Component {
        componentWillUnmount () {}
        componentWillMount () {}
        componentDidMount () {}
        render () {
          return createElement('element' + ++counter)
        }
      }

      // const innerRender = sinon.spy(Inner.prototype, 'render')
      const innerWillMount = sinon.spy(Inner.prototype, 'componentWillMount')
      const innerDidMount = sinon.spy(Inner.prototype, 'componentDidMount')
      const innerWillUnmount = sinon.spy(
        Inner.prototype,
        'componentWillUnmount'
      )

      class Inner2 extends Component {
        constructor (props, context) {
          super(props, context)
          inner2 = this
        }
        componentWillUnmount () {}
        componentWillMount () {}
        componentDidMount () {}
        render () {
          return createElement('element' + ++counter)
        }
      }

      const inner2Render = sinon.spy(Inner2.prototype, 'render')
      const inner2WillMount = sinon.spy(Inner2.prototype, 'componentWillMount')
      const inner2DidMount = sinon.spy(Inner2.prototype, 'componentDidMount')
      const inner2WillUnmount = sinon.spy(
        Inner2.prototype,
        'componentWillUnmount'
      )

      render(<Outer child={Inner} />, scratch)

      expect(outerWillMount.calledOnce).toBeTruthy()
      expect(outerDidMount.calledOnce).toBeTruthy()
      expect(outerWillUnmount.called).toBeFalsy()

      expect(innerWillMount.calledOnce).toBeTruthy()
      expect(innerDidMount.calledOnce).toBeTruthy()
      expect(innerWillUnmount.called).toBeFalsy()

      outer.setState({ child: Inner2 })
      outer.forceUpdate()

      expect(inner2Render.calledOnce).toBeTruthy()

      expect(outerWillMount.calledOnce).toBeTruthy()
      expect(outerDidMount.calledOnce).toBeTruthy()
      expect(outerWillUnmount.called).toBeFalsy()

      expect(inner2WillMount.calledOnce).toBeTruthy()
      expect(inner2DidMount.calledOnce).toBeTruthy()
      expect(inner2WillUnmount.called).toBeFalsy()

      inner2.forceUpdate()

      expect(inner2Render.calledTwice).toBeTruthy()
      expect(inner2WillMount.calledOnce).toBeTruthy()
      expect(inner2DidMount.calledOnce).toBeTruthy()
      expect(inner2WillUnmount.called).toBeFalsy()
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
          doRender = () =>
            this.setState({
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
      const willMount = sinon.spy(Inner.prototype, 'componentWillMount')
      const willUnmount = sinon.spy(Inner.prototype, 'componentWillUnmount')

      const InnerFunc = () => <div class='inner-func'>bar</div>

      render(<Outer child={Inner} />, scratch)

      expect(willMount.calledOnce).toBeTruthy()
      expect(willUnmount.called).toBeFalsy()

      Inner.prototype.componentWillMount.reset()
      doRender()
      rerender()
      expect(willMount.called).toBeFalsy()
      expect(willUnmount.calledOnce).toBeTruthy()
    })
  })
})
