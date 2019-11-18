/** @jsx createElement */
import { Component, createElement, render, findDOMNode } from '../src'
import { rerender } from '../src/render-queue'
import sinon from 'sinon'
import { EMPTY_CHILDREN, normalizeHTML } from './util'

describe('Lifecycle methods', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  describe('#componentWillUpdate', () => {
    it('should NOT be called on initial render', () => {
      class ReceivePropsComponent extends Component {
        componentWillUpdate () {}
        render () {
          return <div />
        }
      }
      const spy = sinon.spy(
        ReceivePropsComponent.prototype,
        'componentWillUpdate'
      )
      render(<ReceivePropsComponent />, scratch)
      expect(spy.called).toBeFalsy()
    })

    it('should be called when rerender with new props from parent', () => {
      let doRender
      class Outer extends Component {
        constructor (p, c) {
          super(p, c)
          this.state = { i: 0 }
        }
        componentDidMount () {
          doRender = () => this.setState({ i: this.state.i + 1 })
        }
        render () {
          return <Inner i={this.state.i} {...this.props} />
        }
      }
      class Inner extends Component {
        componentWillUpdate (nextProps, nextState) {
          expect(nextProps).toEqual({ children: EMPTY_CHILDREN, i: 1 })
          expect(nextState).toEqual({})
        }
        render () {
          return <div />
        }
      }
      const innerSpy = sinon.spy(Inner.prototype, 'componentWillUpdate')
      const outerSpy = sinon.spy(Outer.prototype, 'componentDidMount')

      render(<Outer />, scratch)
      expect(innerSpy.called).toBeFalsy()

      doRender()
      rerender()
      expect(outerSpy.called).toBeTruthy()
    })

    it('should be called on new state', () => {
      let doRender
      class ReceivePropsComponent extends Component {
        componentWillUpdate () {}
        componentDidMount () {
          doRender = () => this.setState({ i: this.state.i + 1 })
        }
        render () {
          return <div />
        }
      }
      const spy = sinon.spy(
        ReceivePropsComponent.prototype,
        'componentWillUpdate'
      )
      render(<ReceivePropsComponent />, scratch)
      expect(spy.called).toBeFalsy()

      doRender()
      rerender()
      expect(spy.called).toBeTruthy()
    })

    it('should be called after children are mounted', () => {
      const log = []

      class Inner extends Component {
        componentDidMount () {
          log.push('Inner mounted')
          expect(scratch.querySelector('#inner')).toEqual(findDOMNode(this))
        }

        render () {
          return <div id='inner' />
        }
      }

      class Outer extends Component {
        componentDidUpdate () {
          log.push('Outer updated')
        }

        render () {
          return this.props.renderInner ? <Inner /> : <div />
        }
      }

      render(<Outer renderInner />, scratch)
    })
  })

  describe('#componentWillReceiveProps', () => {
    it('should NOT be called on initial render', () => {
      class ReceivePropsComponent extends Component {
        componentWillReceiveProps () {}
        render () {
          return <div />
        }
      }
      const spy = sinon.spy(
        ReceivePropsComponent.prototype,
        'componentWillReceiveProps'
      )
      render(<ReceivePropsComponent />, scratch)
      expect(spy.called).toBeFalsy()
    })

    it('should be called when rerender with new props from parent', () => {
      let doRender
      class Outer extends Component {
        constructor (p, c) {
          super(p, c)
          this.state = { i: 0 }
        }
        componentDidMount () {
          doRender = () => this.setState({ i: this.state.i + 1 })
        }
        render () {
          return <Inner i={this.state.i} {...this.props} />
        }
      }
      class Inner extends Component {
        componentWillMount () {
          expect(this.props.i).toEqual(0)
        }
        componentWillReceiveProps (nextProps) {
          expect(nextProps.i).toEqual(1)
        }
        render () {
          return <div />
        }
      }
      const innerSpy = sinon.spy(Inner.prototype, 'componentWillReceiveProps')
      // const outerSpy = sinon.spy(Outer.prototype, 'componentDidMount')

      render(<Outer />, scratch)
      expect(innerSpy.called).toBeFalsy()

      doRender()
      rerender()
      expect()
      expect(innerSpy.called).toBeTruthy()
    })

    it('should be called in right execution order', () => {
      let doRender
      class Outer extends Component {
        constructor (p, c) {
          super(p, c)
          this.state = { i: 0 }
        }
        componentDidMount () {
          doRender = () => this.setState({ i: this.state.i + 1 })
        }
        render () {
          return <Inner i={this.state.i} {...this.props} />
        }
      }
      class Inner extends Component {
        componentDidUpdate () {
          expect(cwrp.called).toBeTruthy()
          expect(cwu.called).toBeTruthy()
        }
        componentWillReceiveProps () {
          expect(cwrp.called).toBeTruthy()
          expect(cdu.called).toBeFalsy()
        }
        componentWillUpdate () {
          expect(cwrp.called).toBeTruthy()
          expect(cdu.called).toBeFalsy()
        }
        componentDidMount () {
          expect(cdm.called).toBeFalsy()
        }
        render () {
          return <div />
        }
      }
      const cwrp = sinon.spy(Inner.prototype, 'componentWillReceiveProps')
      const cdu = sinon.spy(Inner.prototype, 'componentDidUpdate')
      const cwu = sinon.spy(Inner.prototype, 'componentWillUpdate')
      const cdm = sinon.spy(Outer.prototype, 'componentDidMount')

      render(<Outer />, scratch)
      doRender()
      rerender()

      expect(cwrp.called).toBeTruthy()
      expect(cdm.called).toBeTruthy()
    })
  })

  describe('#componentWillMount', () => {
    it('should works like react', () => {
      const spy = sinon.spy()
      class App extends Component {
        constructor (props) {
          super(props)
          this.state = {
            msg: ''
          }
        }

        componentWillMount () {
          this.setState({
            msg: 'test'
          }, () => spy())
        }
        render () {
          return <div>{this.state.msg}</div>
        }
      }

      render(<App />, scratch)
      expect(spy.calledOnce).toBe(true)
    })

    it('setState in setState callback should work in componentWillMount', () => {
      const spy = sinon.spy()
      class App extends Component {
        constructor (props) {
          super(props)
          this.state = {
            msg: ''
          }
        }

        componentWillMount () {
          this.setState({
            msg: 'test'
          }, () => {
            this.setState({
              msg: 'test2'
            }, () => {
              spy()
            })
          })
        }
        render () {
          return <div>{this.state.msg}</div>
        }
      }

      render(<App />, scratch)
      expect(spy.calledOnce).toBe(true)
    })

    it('get latest state', () => {
      class App extends Component {
        constructor (props) {
          super(props)
          this.state = {
            msg: ''
          }
        }

        componentWillMount () {
          this.setState({
            msg: 'test'
          }, () => {
            expect(this.state.msg).toBe('test')
          })
        }
        render () {
          return <div>{this.state.msg}</div>
        }
      }

      render(<App />, scratch)
    })
  })

  describe('top-level componentWillUnmount', () => {
    it('should invoke componentWillUnmount for top-level components', () => {
      let doRender1 = null
      let doRender2 = null
      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            foo: '1'
          }
        }

        componentDidMount () {
          doRender1 = () => {
            this.setState({
              foo: '2'
            })
          }

          doRender2 = () => {
            this.setState({
              foo: '3'
            })
          }
        }

        render () {
          return {
            '1': <Foo />,
            '2': <Bar />,
            '3': <div />
          }[this.state.foo]
        }
      }

      class Foo extends Component {
        componentDidMount () {}
        componentWillUnmount () {}
        render () {
          return <div className='foo' />
        }
      }
      class Bar extends Component {
        componentDidMount () {}
        componentWillUnmount () {}
        render () {
          return <div className='bar' />
        }
      }
      const cdm = sinon.spy(Foo.prototype, 'componentDidMount')
      const cwum = sinon.spy(Foo.prototype, 'componentWillUnmount')
      const barCdm = sinon.spy(Bar.prototype, 'componentDidMount')
      const barCwum = sinon.spy(Bar.prototype, 'componentWillUnmount')

      render(<Outer />, scratch)
      expect(cdm.calledOnce).toBeTruthy()
      // expect(Foo.prototype.componentDidMount, 'initial render').to.have.been.calledOnce

      doRender1()
      rerender()
      expect(cwum.calledOnce).toBeTruthy()
      expect(barCdm.calledOnce).toBeTruthy()

      doRender2()
      rerender()
      expect(barCwum.calledOnce).toBeTruthy()
    })
  })

  // const _it = it
  describe('#constructor and component(Did|Will)(Mount|Unmount)', () => {
    // /* global DISABLE_FLAKEY xit */
    // const it = DISABLE_FLAKEY ? xit : _it
    let setState
    class Outer extends Component {
      constructor (p, c) {
        super(p, c)
        this.state = { show: true }
        setState = s => {
          this.setState(s)
          this.forceUpdate()
        }
      }
      render () {
        return <div>{this.state.show && <Inner {...this.props} />}</div>
      }
    }

    class LifecycleTestComponent extends Component {
      constructor (p, c) {
        super(p, c)
        this._constructor()
      }
      _constructor () {}
      componentWillMount () {}
      componentDidMount () {}
      componentWillUnmount () {}
      render () {
        return <div />
      }
    }

    class Inner extends LifecycleTestComponent {
      render () {
        return (
          <div>
            <InnerMost />
          </div>
        )
      }
    }

    class InnerMost extends LifecycleTestComponent {
      render () {
        return <div />
      }
    }

    const spies = [
      '_constructor',
      'componentWillMount',
      'componentDidMount',
      'componentWillUnmount'
    ]

    const verifyLifycycleMethods = TestComponent => {
      const proto = TestComponent.prototype
      const protoSpy = {}
      spies.forEach(s => {
        protoSpy[s] = sinon.spy(proto, s)
      })
      const reset = () => spies.forEach(s => protoSpy[s].reset())

      it('should be invoked for components on initial render', () => {
        reset()
        render(<Outer />, scratch)
        expect(protoSpy._constructor.called).toBeTruthy()
        expect(protoSpy.componentDidMount.called).toBeTruthy()
        expect(
          protoSpy.componentWillMount.calledBefore(proto.componentDidMount)
        ).toBeTruthy()
        expect(protoSpy.componentDidMount.called).toBeTruthy()
      })

      it('should be invoked for components on unmount', () => {
        reset()
        setState({ show: false })

        expect(protoSpy.componentWillUnmount).toBeTruthy()
      })

      it('should be invoked for components on re-render', () => {
        reset()
        setState({ show: true })

        expect(protoSpy._constructor.called).toBeTruthy()
        expect(protoSpy.componentDidMount.called).toBeTruthy()
        expect(
          protoSpy.componentWillMount.calledBefore(proto.componentDidMount)
        ).toBeTruthy()
        expect(protoSpy.componentDidMount.called).toBeTruthy()
      })
    }

    describe('inner components', () => {
      verifyLifycycleMethods(Inner)
    })

    describe('innermost components', () => {
      verifyLifycycleMethods(InnerMost)
    })

    describe('when shouldComponentUpdate() returns false', () => {
      let setState

      class Outer extends Component {
        constructor () {
          super()
          this.state = { show: true }
          setState = s => {
            this.setState(s)
            this.forceUpdate()
          }
        }
        render () {
          return (
            <div>
              {this.state.show && (
                <div>
                  <Inner {...this.props} />
                </div>
              )}
            </div>
          )
        }
      }

      class Inner extends Component {
        shouldComponentUpdate () {
          return false
        }
        componentWillMount () {}
        componentDidMount () {}
        componentWillUnmount () {}
        render () {
          return <div />
        }
      }

      const proto = Inner.prototype
      const spies = [
        'componentWillMount',
        'componentDidMount',
        'componentWillUnmount'
      ]
      const protoSpy = {}
      spies.forEach(s => {
        protoSpy[s] = sinon.spy(proto, s)
      })

      const reset = () => spies.forEach(s => proto[s].reset())

      beforeEach(() => reset())

      it('should be invoke normally on initial mount', () => {
        render(<Outer />, scratch)
        expect(protoSpy.componentWillMount.called).toBeTruthy()
        expect(
          protoSpy.componentWillMount.calledBefore(protoSpy.componentDidMount)
        ).toBeTruthy()
        expect(protoSpy.componentDidMount.called).toBeTruthy()
      })

      it('should be invoked normally on unmount', () => {
        setState({ show: false })

        expect(protoSpy.componentWillUnmount).toBeTruthy()
      })

      it('should still invoke mount for shouldComponentUpdate():false', () => {
        setState({ show: true })
        expect(protoSpy.componentWillMount.called).toBeTruthy()
        expect(
          protoSpy.componentWillMount.calledBefore(protoSpy.componentDidMount)
        ).toBeTruthy()
        expect(protoSpy.componentDidMount.called).toBeTruthy()
      })

      it('should still invoke unmount for shouldComponentUpdate():false', () => {
        setState({ show: false })

        expect(protoSpy.componentWillUnmount.called).toBeTruthy()
      })
    })
  })

  describe('shouldComponentUpdate', () => {
    let setState

    class Should extends Component {
      constructor () {
        super()
        this.state = { show: true }
        setState = s => this.setState(s)
      }
      render () {
        return this.state.show ? <div /> : null
      }
    }

    class ShouldNot extends Should {
      shouldComponentUpdate () {
        return false
      }
    }

    const renderSpy = sinon.spy(Should.prototype, 'render')
    const shouldNotSpy = sinon.spy(ShouldNot.prototype, 'shouldComponentUpdate')

    beforeEach(() => Should.prototype.render.reset())

    it('should rerender component on change by default', () => {
      render(<Should />, scratch)
      setState({ show: false })
      rerender()

      expect(renderSpy.callCount).toBeTruthy()
    })

    it('should not rerender component if shouldComponentUpdate returns false', () => {
      render(<ShouldNot />, scratch)
      setState({ show: false })
      rerender()

      expect(shouldNotSpy.calledOnce).toBeTruthy()
      expect(renderSpy.calledOnce).toBeTruthy()
    })
  })

  describe('Lifecycle DOM Timing', () => {
    it('should be invoked when dom does (DidMount, WillUnmount) or does not (WillMount, DidUnmount) exist', () => {
      let setState
      class Outer extends Component {
        constructor () {
          super()
          this.state = { show: true }
          setState = s => {
            this.setState(s)
            this.forceUpdate()
          }
        }
        componentWillMount () {
          expect(document.getElementById('OuterDiv')).toBeNull()
        }
        componentDidMount () {
          // expect(document.getElementById('OuterDiv')).not.toBeNull()
        }
        componentWillUnmount () {
          expect(document.getElementById('OuterDiv')).toBeNull()
          // setTimeout(() => {
          //   expect(document.getElementById('OuterDiv')).not.toBeNull()
          // }, 0)
        }
        render () {
          return (
            <div id='OuterDiv'>
              {this.state.show && (
                <div>
                  <Inner {...this.props} />
                </div>
              )}
            </div>
          )
        }
      }

      class Inner extends Component {
        componentWillMount () {
          expect(document.getElementById('InnerDiv')).toBeNull()
        }
        componentDidMount () {
          // expect(document.getElementById('InnerDiv')).not.toBeNull()
        }
        componentWillUnmount () {
          // setTimeout(() => {
          //   expect(document.getElementById('InnerDiv')).toBeNull()
          // }, 0)
        }

        render () {
          return <div id='InnerDiv' />
        }
      }

      const proto = Inner.prototype
      const spies = [
        'componentWillMount',
        'componentDidMount',
        'componentWillUnmount'
      ]
      const protoSpy = {}
      spies.forEach(s => {
        protoSpy[s] = sinon.spy(proto, s)
      })
      const reset = () => spies.forEach(s => protoSpy[s].reset())

      render(<Outer />, scratch)
      expect(protoSpy.componentWillMount.called).toBeTruthy()
      expect(
        protoSpy.componentWillMount.calledBefore(protoSpy.componentDidMount)
      ).toBeTruthy()
      expect(protoSpy.componentDidMount.called).toBeTruthy()

      reset()
      setState({ show: false })

      expect(protoSpy.componentWillUnmount.called).toBeTruthy()

      reset()
      setState({ show: true })

      expect(protoSpy.componentWillMount.called).toBeTruthy()
      expect(
        protoSpy.componentWillMount.calledBefore(protoSpy.componentDidMount)
      ).toBeTruthy()
      expect(protoSpy.componentDidMount.called).toBeTruthy()
    })

    it('should remove this.dom for HOC', () => {
      const createComponent = (name, fn) => {
        class C extends Component {
          componentWillUnmount () {
            expect(findDOMNode(this)).not.toBeNull()
          }
          render () {
            return fn(this.props)
          }
        }
        sinon.spy(C.prototype.componentWillUnmount)
        return C
      }

      class Wrapper extends Component {
        render () {
          return <div class='wrapper'>{this.props.children}</div>
        }
      }

      const One = createComponent('One', () => <Wrapper>one</Wrapper>)
      const Two = createComponent('Two', () => <Wrapper>two</Wrapper>)
      const Three = createComponent('Three', () => <Wrapper>three</Wrapper>)

      const components = [One, Two, Three]

      const Selector = createComponent('Selector', ({ page }) => {
        const Child = components[page]
        return Child && <Child />
      })

      class App extends Component {
        render () {
          return <Selector page={this.state.page} />
        }
      }

      let app
      render(<App ref={c => (app = c)} />, scratch)

      for (let i = 0; i < 20; i++) {
        app.setState({ page: i % components.length })
        app.forceUpdate()
      }
    })
  })

  describe('componentWillUnmount should be called before removing DOM', () => {
    class Hello extends Component {
      componentWillUnmount () {
        expect(scratch.innerHTML).toContain('hello')
      }
      render () {
        return <div id='hello'>Hello {this.props.name}</div>
      }
    }
    it('should work with children and null', () => {
      render(
        <div>
          <span>1</span>
          <Hello name='World' />
        </div>,
        scratch
      )

      render(null, scratch, () => {
        expect(scratch.innerHTML).toBe('')
      })
    })

    it('should work with root and null', () => {
      render(<Hello name='World' />, scratch)

      render(null, scratch, () => {
        expect(scratch.innerHTML).toBe('')
      })
    })

    it('should work with children and children', () => {
      render(
        <div>
          <span>1</span>
          <Hello name='World' />
        </div>,
        scratch
      )

      render(
        <div>
          <span>1</span>
        </div>,
        scratch,
        () => {
          expect(scratch.innerHTML).toBe(
            normalizeHTML('<div><span>1</span></div>')
          )
        }
      )
    })
  })

  describe('static getDerivedStateFromProps', () => {
    it('should set initial state with value returned from getDerivedStateFromProps', () => {
      class Foo extends Component {
        static getDerivedStateFromProps (props) {
          return {
            foo: props.foo,
            bar: 'bar'
          }
        }
        render () {
          return <div className={`${this.state.foo} ${this.state.bar}`} />
        }
      }
      render(<Foo foo='foo' />, scratch)
      expect(scratch.firstChild.className).toBe('foo bar')
    })
    it('should update initial state with value returned from getDerivedStateFromProps', () => {
      class Foo extends Component {
        constructor (props, context) {
          super(props, context)
          this.state = {
            foo: 'foo',
            bar: 'bar'
          }
        }
        static getDerivedStateFromProps (props, state) {
          return {
            foo: `not-${state.foo}`
          }
        }
        render () {
          return <div className={`${this.state.foo} ${this.state.bar}`} />
        }
      }

      render(<Foo />, scratch)
      expect(scratch.firstChild.className).toBe('not-foo bar')
    })
    it('should update the instance\'s state with the value returned from getDerivedStateFromProps when props change', () => {
      class Foo extends Component {
        constructor (props, context) {
          super(props, context)
          this.state = {
            value: 'initial'
          }
        }
        static getDerivedStateFromProps (props) {
          if (props.update) {
            return {
              value: 'updated'
            }
          }
          return null
        }
        componentDidMount () {}
        componentDidUpdate () {}
        render () {
          return <div className={this.state.value} />
        }
      }
      const spyGetDerivedStateFromProps = sinon.spy(Foo, 'getDerivedStateFromProps')
      const spyComponentDidMount = sinon.spy(Foo.prototype, 'componentDidMount')
      const spyComponentDidUpdate = sinon.spy(Foo.prototype, 'componentDidUpdate')

      render(<Foo update={false} />, scratch)
      expect(scratch.firstChild.className).toBe('initial')
      expect(spyGetDerivedStateFromProps.calledOnce).toBeTruthy()
      expect(spyComponentDidMount.calledOnce).toBeTruthy() // verify mount occurred
      expect(spyComponentDidUpdate.notCalled).toBeTruthy()

      render(<Foo update />, scratch)
      expect(scratch.firstChild.className).toBe('updated')
      expect(spyGetDerivedStateFromProps.calledTwice).toBeTruthy()
      expect(spyComponentDidMount.calledOnce).toBeTruthy()
      expect(spyComponentDidUpdate.calledOnce).toBeTruthy() // verify update occurred
    })

    it('should update the instance\'s state with the value returned from getDerivedStateFromProps when state changes', () => {
      class Foo extends Component {
        constructor (props, context) {
          super(props, context)
          this.state = {
            value: 'initial'
          }
        }
        static getDerivedStateFromProps (props, state) {
          // Don't change state for call that happens after the constructor
          if (state.value === 'initial') {
            return null
          }
          return {
            value: state.value + ' derived'
          }
        }
        componentDidMount () {
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({ value: 'updated' })
        }
        render () {
          return <div className={this.state.value} />
        }
      }

      sinon.spy(Foo, 'getDerivedStateFromProps')
      const spyComponentDidMount = sinon.spy(Foo.prototype, 'componentDidMount')

      render(<Foo />, scratch)
      document.body.appendChild(scratch)
      expect(scratch.firstChild.className).toBe('initial')
      expect(Foo.getDerivedStateFromProps.calledOnce).toBeTruthy()
      expect(spyComponentDidMount.calledOnce).toBeTruthy()
      rerender()
      expect(scratch.firstChild.className).toBe('updated derived')
      expect(Foo.getDerivedStateFromProps.calledTwice).toBeTruthy()
    })

    it('should update the instance\'s state with the value returned from getDerivedStateFromProps when state changes', () => {
      class Foo extends Component {
        constructor (props, context) {
          super(props, context)
          this.state = {
            value: 'initial'
          }
        }
        static getDerivedStateFromProps (props, state) {
          // Don't change state for call that happens after the constructor
          if (state.value === 'initial') {
            return null
          }

          return {
            value: state.value + ' derived'
          }
        }
        componentDidMount () {
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({ value: 'updated' })
        }
        render () {
          return <div className={this.state.value} />
        }
      }

      const spyGetDerivedStateFromProps = sinon.spy(Foo, 'getDerivedStateFromProps')

      render(<Foo />, scratch)
      expect(scratch.firstChild.className).toBe('initial')
      expect(spyGetDerivedStateFromProps.calledOnce).toBeTruthy()

      rerender() // call rerender to handle cDM setState call
      expect(scratch.firstChild.className).toBe('updated derived')
      expect(spyGetDerivedStateFromProps.calledTwice).toBeTruthy()
    })

    it('should NOT modify state if null is returned', () => {
      class Foo extends Component {
        constructor (props, context) {
          super(props, context)
          this.state = {
            foo: 'foo',
            bar: 'bar'
          }
        }
        static getDerivedStateFromProps () {
          return null
        }
        render () {
          return <div className={`${this.state.foo} ${this.state.bar}`} />
        }
      }

      const spyGetDerivedStateFromProps = sinon.spy(Foo, 'getDerivedStateFromProps')

      render(<Foo />, scratch)
      expect(scratch.firstChild.className).toBe('foo bar')
      expect(spyGetDerivedStateFromProps.called).toBeTruthy
    })

    it('should NOT modify stateBeUndefinedtoBeUndefined() is returned', () => {
      class Foo extends Component {
        constructor (props, context) {
          super(props, context)
          this.state = {
            foo: 'foo',
            bar: 'bar'
          }
        }
        static getDerivedStateFromProps () {}
        render () {
          return <div className={`${this.state.foo} ${this.state.bar}`} />
        }
      }

      const spyGetDerivedStateFromProps = sinon.spy(Foo, 'getDerivedStateFromProps')

      render(<Foo />, scratch)
      expect(scratch.firstChild.className).toBe('foo bar')
      expect(spyGetDerivedStateFromProps.called).toBeTruthy
    })
    it('should NOT invoke deprecated lifecycles (cWM/cWRP) if new static gDSFP is present', () => {
      class Foo extends Component {
        static getDerivedStateFromProps () {}
        componentWillMount () {}
        componentWillReceiveProps () {}
        render () {
          return <div />
        }
      }
      class Bar extends Component {
        constructor (props) {
          super(props)
          this.state = {
            test: 1
          }
        }
        render () {
          return <Foo test={this.state.test} />
        }
        componentDidMount () {
          this.setState({
            test: 2
          })
        }
      }
      const spyGetDerivedStateFromProps = sinon.spy(Foo, 'getDerivedStateFromProps')
      const spyComponentWillMount = sinon.spy(Foo.prototype, 'componentWillMount')
      const spyComponentWillReceiveProps = sinon.spy(Foo.prototype, 'componentWillReceiveProps')

      render(<Bar />, scratch)
      expect(spyGetDerivedStateFromProps.called).toBeTruthy()
      expect(spyComponentWillMount.notCalled).toBeTruthy()
      expect(spyComponentWillReceiveProps.notCalled).toBeTruthy()
      rerender()
      expect(spyGetDerivedStateFromProps.called).toBeTruthy()
      expect(spyComponentWillMount.notCalled).toBeTruthy()
      expect(spyComponentWillReceiveProps.notCalled).toBeTruthy()
    })
    it('is not called if neither state nor props have changed', () => {
      let logs = []
      let childRef

      class Parent extends Component {
        constructor (props) {
          super(props)
          this.state = { parentRenders: 0 }
        }

        static getDerivedStateFromProps (props, state) {
          logs.push('parent getDerivedStateFromProps')
          return state.parentRenders + 1
        }

        render () {
          logs.push('parent render')
          return <Child parentRenders={this.state.parentRenders} />
        }
      }

      class Child extends Component {
        constructor (props) {
          super(props)
          childRef = this
        }
        render () {
          logs.push('child render')
          return this.props.parentRenders
        }
      }
      render(<Parent />, scratch)
      expect(logs).toEqual([
        'parent getDerivedStateFromProps',
        'parent render',
        'child render'
      ])

      logs = []
      childRef.setState({})
      rerender()
      expect(logs).toEqual([
        'child render'
      ])
    })

    it('should be passed next props and state', () => {
      /** @type {() => void} */
      let updateState

      let propsArg
      let stateArg

      class Foo extends Component {
        constructor (props) {
          super(props)
          this.state = {
            value: 0
          }
          updateState = () => this.setState({
            value: this.state.value + 1
          })
        }
        static getDerivedStateFromProps (props, state) {
          propsArg = { ...props }
          stateArg = { ...state }

          return {
            value: state.value + 1
          }
        }
        render () {
          return <div>{this.state.value}</div>
        }
      }

      render(<Foo foo='foo' />, scratch)

      const element = scratch.firstChild
      // Initial render
      // state.value: initialized to 0 in constructor, 0 -> 1 in gDSFP
      expect(element.textContent).toEqual('1')
      expect(propsArg).toEqual({
        foo: 'foo',
        children: []
      })
      expect(stateArg).toEqual({
        value: 0
      })

      // New Props
      // state.value: 1 -> 2 in gDSFP
      render(<Foo foo='bar' />, scratch)
      expect(element.textContent).toBe('2')
      expect(propsArg).toEqual({
        foo: 'bar',
        children: []
      })
      expect(stateArg).toEqual({
        value: 1
      })

      // New state
      // state.value: 2 -> 3 in updateState, 3 -> 4 in gDSFP
      updateState()
      rerender()
      expect(element.textContent).toBe('4')
      expect(propsArg).toEqual({
        foo: 'bar',
        children: []
      })
      expect(stateArg).toEqual({
        value: 3
      })

      // New Props (see #1446)
      // 4 -> 5 in gDSFP
      render(<Foo foo='baz' />, scratch)
      expect(element.textContent).toBe('5')
      expect(stateArg).toEqual({
        value: 4
      })

      // New Props (see #1446)
      // 5 -> 6 in gDSFP
      render(<Foo foo='qux' />, scratch)
      expect(element.textContent).toBe('6')
      expect(stateArg).toEqual({
        value: 5
      })
    })
    it('should NOT mutate state on mount, only create new versions', () => {
      const stateConstant = {}
      let componentState

      class Stateful extends Component {
        static getDerivedStateFromProps () {
          return { key: 'value' }
        }

        constructor () {
          super(...arguments)
          this.state = stateConstant
        }

        componentDidMount () {
          componentState = this.state
        }

        render () {
          return <div />
        }
      }

      render(<Stateful />, scratch)

      // Verify captured object references didn't get mutated
      expect(componentState).toEqual({ key: 'value' })
      expect(stateConstant).toEqual({})
    })
    it('should NOT mutate state on update, only create new versions', () => {
      const initialState = {}
      const capturedStates = []

      let setState

      class Stateful extends Component {
        static getDerivedStateFromProps (props, state) {
          return { value: (state.value || 0) + 1 }
        }

        constructor () {
          super(...arguments)
          this.state = initialState
          capturedStates.push(this.state) // {}

          setState = this.setState.bind(this)
        }

        componentDidMount () {
          capturedStates.push(this.state) // 1
        }

        componentDidUpdate () {
          capturedStates.push(this.state) // 1
        }

        render () {
          return <div />
        }
      }

      render(<Stateful />, scratch)

      setState({ value: 10 })
      rerender()

      // Verify captured object references didn't get mutated
      expect(capturedStates).toEqual([
        {},
        { value: 1 },
        { value: 11 }
      ])
    })
    it('should be passed previous props and state', () => {
      let updateState

      let prevPropsArg
      let prevStateArg
      // let snapshotArg
      let curProps
      let curState

      class Foo extends Component {
        constructor (props) {
          super(props)
          this.state = {
            value: 0
          }
          updateState = () => this.setState({
            value: this.state.value + 1
          })
        }
        static getDerivedStateFromProps (props, state) {
          return {
            value: state.value + 1
          }
        }
        componentDidUpdate (prevProps, prevState, snapshot) {
          prevPropsArg = { ...prevProps }
          prevStateArg = { ...prevState }
          // snapshotArg = snapshot

          curProps = { ...this.props }
          curState = { ...this.state }
        }
        render () {
          return <div>{this.state.value}</div>
        }
      }
      // Initial render
      // state.value: initialized to 0 in constructor, 0 -> 1 in gDSFP
      render(<Foo foo='foo' />, scratch)
      expect(scratch.firstChild.textContent).toBe('1')
      expect(prevPropsArg).toBeUndefined()
      expect(prevStateArg).toBeUndefined()
      // expect(snapshotArg).toBeUndefined()
      expect(curProps).toBeUndefined()
      expect(curState).toBeUndefined()

      // New props
      // state.value: 1 -> 2 in gDSFP
      render(<Foo foo='bar' />, scratch)
      expect(scratch.firstChild.textContent).toBe('2')
      expect(prevPropsArg).toEqual({ foo: 'foo', children: [] })
      expect(prevStateArg).toEqual({ value: 1 })
      // expect(snapshotArg).toBeUndefined()
      expect(curProps).toEqual({ foo: 'bar', children: [] })
      expect(curState).toEqual({ value: 2 })

      // New state
      // state.value: 2 -> 3 in updateState, 3 -> 4 in gDSFP
      updateState()
      rerender()
      expect(scratch.firstChild.textContent).toBe('4')
      expect(prevPropsArg).toEqual({ foo: 'bar', children: [] })
      expect(prevStateArg).toEqual({ value: 2 })
      // expect(snapshotArg).toBeUndefined()
      expect(curProps).toEqual({ foo: 'bar', children: [] })
      expect(curState).toEqual({ value: 4 })
    })
    it('should be passed next props and state', () => {
      /** @type {() => void} */
      let updateState

      let curProps
      let curState
      let nextPropsArg
      let nextStateArg

      class Foo extends Component {
        constructor (props) {
          super(props)
          this.state = {
            value: 0
          }
          updateState = () => this.setState({
            value: this.state.value + 1
          })
        }
        static getDerivedStateFromProps (props, state) {
          const newValue = state.value + 1

          return {
            value: newValue
          }
        }
        shouldComponentUpdate (nextProps, nextState) {
          nextPropsArg = { ...nextProps }
          nextStateArg = { ...nextState }
          curProps = { ...this.props }
          curState = { ...this.state }
          return true
        }
        render () {
          return <div>{this.state.value}</div>
        }
      }

      // Expectation:
      // `this.state` in shouldComponentUpdate should be
      // `nextState` in shouldComponentUpdate should be

      // Initial render
      // state.value: initialized to 0 in constructor, 0 -> 1 in gDSFP
      render(<Foo foo='foo' />, scratch)
      expect(scratch.firstChild.textContent).toBe('1')
      expect(curProps).toBeUndefined()
      expect(curState).toBeUndefined()
      expect(nextPropsArg).toBeUndefined()
      expect(nextStateArg).toBeUndefined()

      // New props
      // state.value: 1 -> 2 in gDSFP
      render(<Foo foo='bar' />, scratch)
      expect(scratch.firstChild.textContent).toBe('2')
      expect(curProps).toEqual({ foo: 'foo', children: [] })
      expect(curState).toEqual({ value: 1 })
      expect(nextPropsArg).toEqual({ foo: 'bar', children: [] })
      expect(nextStateArg).toEqual({ value: 2 })
      // New state
      // state.value: 2 -> 3 in updateState, 3 -> 4 in gDSFP
      updateState()
      rerender()

      expect(scratch.firstChild.textContent).toBe('4')
      expect(curProps).toEqual({ foo: 'bar', children: [] })
      expect(curState).toEqual({ value: 2 })
      expect(nextPropsArg).toEqual({ foo: 'bar', children: [] })
      expect(nextStateArg).toEqual({ value: 4 })
    })

    it('should call nested new lifecycle methods in the right order', () => {
      let updateOuterState
      let updateInnerState
      let forceUpdateOuter
      let forceUpdateInner
      let log
      function logger (msg) {
        return function () {
          // return true for shouldComponentUpdate
          log.push(msg)
          return true
        }
      }
      class Outer extends Component {
        static getDerivedStateFromProps () {
          log.push('outer getDerivedStateFromProps')
          return null
        }
        constructor () {
          super()
          log.push('outer constructor')
          this.state = { value: 0 }
          forceUpdateOuter = () => this.forceUpdate()
          updateOuterState = () => this.setState({
            value: (this.state.value + 1) % 2
          })
        }
        render () {
          log.push('outer render')
          return (
            <div>
              <Inner x={this.props.x} outerValue={this.state.value} />
            </div>
          )
        }
      }
      Object.assign(Outer.prototype, {
        componentDidMount: logger('outer componentDidMount'),
        shouldComponentUpdate: logger('outer shouldComponentUpdate'),
        getSnapshotBeforeUpdate: logger('outer getSnapshotBeforeUpdate'),
        componentDidUpdate: logger('outer componentDidUpdate'),
        componentWillUnmount: logger('outer componentWillUnmount')
      })
      class Inner extends Component {
        static getDerivedStateFromProps () {
          log.push('inner getDerivedStateFromProps')
          return null
        }
        constructor () {
          super()
          log.push('inner constructor')
          this.state = { value: 0 }
          forceUpdateInner = () => this.forceUpdate()
          updateInnerState = () => this.setState({
            value: (this.state.value + 1) % 2
          })
        }
        render () {
          log.push('inner render')
          return <span>{this.props.x} {this.props.outerValue} {this.state.value}</span>
        }
      }
      Object.assign(Inner.prototype, {
        componentDidMount: logger('inner componentDidMount'),
        shouldComponentUpdate: logger('inner shouldComponentUpdate'),
        getSnapshotBeforeUpdate: logger('inner getSnapshotBeforeUpdate'),
        componentDidUpdate: logger('inner componentDidUpdate'),
        componentWillUnmount: logger('inner componentWillUnmount')
      })
      // Constructor & mounting
      log = []
      render(<Outer x={1} />, scratch)
      expect(log).toEqual([
        'outer constructor',
        'outer getDerivedStateFromProps',
        'outer render',
        'inner constructor',
        'inner getDerivedStateFromProps',
        'inner render',
        'inner componentDidMount',
        'outer componentDidMount'
      ])
      // Outer & Inner props update
      log = []
      render(<Outer x={2} />, scratch)
      // Note: we differ from react here in that we apply changes to the dom
      // as we find them while diffing. React on the other hand separates this
      // into specific phases, meaning changes to the dom are only flushed
      // once the whole diff-phase is complete. This is why
      // "outer getSnapshotBeforeUpdate" is called just before the "inner" hooks.
      // For react this call would be right before "outer componentDidUpdate"
      expect(log).toEqual([
        'outer getDerivedStateFromProps',
        'outer shouldComponentUpdate',
        'outer render',
        'outer getSnapshotBeforeUpdate',
        'inner getDerivedStateFromProps',
        'inner shouldComponentUpdate',
        'inner render',
        'inner getSnapshotBeforeUpdate',
        'inner componentDidUpdate',
        'outer componentDidUpdate'
      ])
      // Outer state update & Inner props update
      log = []
      updateOuterState()
      rerender()
      expect(log).toEqual([
        'outer getDerivedStateFromProps',
        'outer shouldComponentUpdate',
        'outer render',
        'outer getSnapshotBeforeUpdate',
        'inner getDerivedStateFromProps',
        'inner shouldComponentUpdate',
        'inner render',
        'inner getSnapshotBeforeUpdate',
        'inner componentDidUpdate',
        'outer componentDidUpdate'
      ])
      // Inner state update
      log = []
      updateInnerState()
      rerender()
      expect(log).toEqual([
        'inner getDerivedStateFromProps',
        'inner shouldComponentUpdate',
        'inner render',
        'inner getSnapshotBeforeUpdate',
        'inner componentDidUpdate'
      ])
      // Force update Outer
      log = []
      forceUpdateOuter()
      rerender()
      expect(log).toEqual([
        'outer getDerivedStateFromProps',
        'outer render',
        'outer getSnapshotBeforeUpdate',
        'inner getDerivedStateFromProps',
        'inner shouldComponentUpdate',
        'inner render',
        'inner getSnapshotBeforeUpdate',
        'inner componentDidUpdate',
        'outer componentDidUpdate'
      ])
      // Force update Inner
      log = []
      forceUpdateInner()
      rerender()
      expect(log).toEqual([
        'inner getDerivedStateFromProps',
        'inner render',
        'inner getSnapshotBeforeUpdate',
        'inner componentDidUpdate'
      ])
      // Unmounting Outer & Inner
      log = []
      render(<table />, scratch)
      expect(log).toEqual([
        'outer componentWillUnmount',
        'inner componentWillUnmount'
      ])
    })
  })

  describe('getDerivedStateFromError', () => {
    let receiver
    scratch = document.createElement('div')
    class Receiver extends Component {
      constructor (props) {
        super(props)
        receiver = this
      }
      static getDerivedStateFromError (error) {
        return { error }
      }
      render () {
        return <div>{this.state.error ? String(this.state.error) : this.props.children}</div>
      }
    }
    const spyGetDerivedStateFromError = sinon.spy(Receiver, 'getDerivedStateFromError')
    beforeEach(() => {
      receiver = undefined
      spyGetDerivedStateFromError.reset()
    })
    // it('should be called when child fails in constructor', () => {
    //   class ThrowErr extends Component {
    //     constructor (props, context) {
    //       super(props, context)
    //       throw new Error('Error!')
    //     }
    //     render () {
    //       return <div />
    //     }
    //   }
    //   render(<Receiver><ThrowErr /></Receiver>, scratch)
    //   rerender()
    //   // expect(Receiver.getDerivedStateFromError.called).toBeTruthy()
    // })
    it('should be called when child fails in componentWillMount', () => {
      class ThrowErr extends Component {
        componentWillMount () {
          throw new Error('Error during componentWillMount!')
        }
        render () {
          return <div>123</div>
        }
      }
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      document.body.appendChild(scratch)
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in render', () => {
      // eslint-disable-next-line react/require-render-return
      class ThrowErr extends Component {
        render () {
          throw new Error('Error during render!')
        }
      }
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      document.body.appendChild(scratch)
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in componentDidMount', () => {
      class ThrowErr extends Component {
        componentDidMount () {
          throw new Error('Error during componentDidMount!')
        }
        render () {
          return <div />
        }
      }
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      document.body.appendChild(scratch)
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in getDerivedStateFromProps', () => {
      class ThrowErr extends Component {
        static getDerivedStateFromProps () {
          throw new Error('Error during getDerivedStateFromProps!')
        }
        render () {
          return <span>Should not get here</span>
        }
      }

      // const spyRender = sinon.spy(ThrowErr.prototype, 'render')
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      document.body.appendChild(scratch)
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
      // @TODO: render should not be called
      // expect(spyRender.notCalled).toBeTruthy()
    })
    it('should be called when child fails in getSnapshotBeforeUpdate', () => {
      class ThrowErr extends Component {
        getSnapshotBeforeUpdate () {
          throw new Error('Error in getSnapshotBeforeUpdate!')
        }
        render () {
          return <span />
        }
      }
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      receiver.forceUpdate()

      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in componentDidUpdate', () => {
      class ThrowErr extends Component {
        componentDidUpdate () {
          throw new Error('Error in componentDidUpdate!')
        }
        render () {
          return <span />
        }
      }
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      receiver.forceUpdate()
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in componentWillUpdate', () => {
      class ThrowErr extends Component {
        componentWillUpdate () {
          throw new Error('Error in componentWillUpdate!')
        }
        render () {
          return <span />
        }
      }
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      receiver.forceUpdate()
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in componentWillReceiveProps', () => {
      let receiver
      class Receiver extends Component {
        constructor () {
          super()
          this.state = { foo: 'bar' }
          receiver = this
        }
        static getDerivedStateFromError (error) {
          return { error }
        }
        render () {
          return <div>{this.state.error ? String(this.state.error) : <ThrowErr foo={this.state.foo} />}</div>
        }
      }
      class ThrowErr extends Component {
        componentWillReceiveProps () {
          throw new Error('Error in componentWillReceiveProps!')
        }
        render () {
          return <span />
        }
      }
      const spyGetDerivedStateFromError = sinon.spy(Receiver, 'getDerivedStateFromError')
      render(<Receiver />, scratch)
      document.body.appendChild(scratch)
      receiver.setState({ foo: 'baz' })
      rerender()
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in shouldComponentUpdate', () => {
      let receiver
      class Receiver extends Component {
        constructor () {
          super()
          this.state = { foo: 'bar' }
          receiver = this
        }
        static getDerivedStateFromError (error) {
          return { error }
        }
        render () {
          return <div>{this.state.error ? String(this.state.error) : <ThrowErr foo={this.state.foo} />}</div>
        }
      }
      class ThrowErr extends Component {
        shouldComponentUpdate () {
          throw new Error('Error in shouldComponentUpdate!')
        }
        render () {
          return <span />
        }
      }
      const spyGetDerivedStateFromError = sinon.spy(Receiver, 'getDerivedStateFromError')
      render(<Receiver />, scratch)
      receiver.setState({ foo: 'baz' })
      rerender()
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when child fails in componentWillUnmount', () => {
      class ThrowErr extends Component {
        componentWillUnmount () {
          throw new Error('Error in componentWillUnmount!')
        }
        render () {
          return <div />
        }
      }

      render(<Receiver><ThrowErr /></Receiver>, scratch)
      render(<Receiver><div /></Receiver>, scratch)
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })
    it('should be called when functional child fails', () => {
      function ThrowErr () {
        throw new Error('Error!')
      }
      render(<Receiver><ThrowErr /></Receiver>, scratch)
      expect(spyGetDerivedStateFromError.called).toBeTruthy()
    })

    it('should re-render with new content', () => {
      class ThrowErr extends Component {
        componentWillMount () {
          throw new Error('Error contents')
        }
        render () {
          return 'No error!?!?'
        }
      }

      render(<Receiver><ThrowErr /></Receiver>, scratch)
      rerender()
      expect(scratch.textContent).toEqual('Error: Error contents')
    })
  })
  describe('getSnapshotBeforeUpdate', () => {
    it('should pass the return value from getSnapshotBeforeUpdate to componentDidUpdate', () => {
      let log = []
      class MyComponent extends Component {
        constructor (props) {
          super(props)
          this.state = {
            value: 0
          }
        }
        static getDerivedStateFromProps (nextProps, prevState) {
          return {
            value: prevState.value + 1
          }
        }
        getSnapshotBeforeUpdate (prevProps, prevState) {
          log.push(
            `getSnapshotBeforeUpdate() prevProps:${prevProps.value} prevState:${
          prevState.value
            }`
          )
          return 'abc'
        }
        componentDidUpdate (prevProps, prevState, snapshot) {
          log.push(
          `componentDidUpdate() prevProps:${prevProps.value} prevState:${
          prevState.value
          } snapshot:${snapshot}`)
        }
        render () {
          log.push('render')
          return null
        }
      }

      render(<MyComponent value='foo' />, scratch)
      expect(log).toEqual(['render'])
      log = []

      render(<MyComponent value='bar' />, scratch)
      expect(log).toEqual([
        'render',
        'getSnapshotBeforeUpdate() prevProps:foo prevState:1',
        'componentDidUpdate() prevProps:foo prevState:1 snapshot:abc'
      ])
      log = []

      render(<MyComponent value='baz' />, scratch)
      expect(log).toEqual([
        'render',
        'getSnapshotBeforeUpdate() prevProps:bar prevState:2',
        'componentDidUpdate() prevProps:bar prevState:2 snapshot:abc'
      ])
      log = []

      render(<div />, scratch)
      expect(log).toEqual([])
    })
    it('should call getSnapshotBeforeUpdate before mutations are committed', () => {
      let log = []
      class MyComponent extends Component {
        getSnapshotBeforeUpdate (prevProps) {
          log.push('getSnapshotBeforeUpdate')
          expect(this.divRef.textContent).toEqual(
            `value:${prevProps.value}`
          )
          return 'foobar'
        }
        componentDidUpdate (prevProps, prevState, snapshot) {
          log.push('componentDidUpdate')
          expect(this.divRef.textContent).toEqual(
            `value:${this.props.value}`
          )
          expect(snapshot).toEqual('foobar')
        }
        render () {
          log.push('render')
          return <div ref={(ref) => { this.divRef = ref }}>{`value:${this.props.value}`}</div>
        }
      }
      render(<MyComponent value='foo' />, scratch)
      expect(log).toEqual(['render'])
      log = []
      render(<MyComponent value='bar' />, scratch)
      expect(log).toEqual([
        'render',
        'getSnapshotBeforeUpdate',
        'componentDidUpdate'
      ])
    })
    it('should be passed the previous props and state', () => {
      /** @type {() => void} */
      let updateState
      let prevPropsArg
      let prevStateArg
      let curProps
      let curState
      class Foo extends Component {
        constructor (props) {
          super(props)
          this.state = {
            value: 0
          }
          updateState = () => this.setState({
            value: this.state.value + 1
          })
        }
        static getDerivedStateFromProps (props, state) {
          // NOTE: Don't do this in real production code!
          // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
          return {
            value: state.value + 1
          }
        }
        getSnapshotBeforeUpdate (prevProps, prevState) {
          // These object references might be updated later so copy
          // object so we can assert their values at this snapshot in time
          prevPropsArg = { ...prevProps }
          prevStateArg = { ...prevState }
          curProps = { ...this.props }
          curState = { ...this.state }
        }
        render () {
          return <div>{this.state.value}</div>
        }
      }
      // Expectation:
      // `prevState` in getSnapshotBeforeUpdate should be
      // the state before setState or getDerivedStateFromProps was called.
      // `this.state` in getSnapshotBeforeUpdate should be
      // the updated state after getDerivedStateFromProps was called.
      // Initial render
      // state.value: initialized to 0 in constructor, 0 -> 1 in gDSFP
      render(<Foo foo='foo' />, scratch)
      const element = scratch.firstChild
      expect(element.textContent).toEqual('1')
      expect(prevPropsArg).toBeUndefined()
      expect(prevStateArg).toBeUndefined()
      expect(curProps).toBeUndefined()
      expect(curState).toBeUndefined()
      // New props
      // state.value: 1 -> 2 in gDSFP
      render(<Foo foo='bar' />, scratch)
      expect(element.textContent).toEqual('2')
      expect(prevPropsArg).toEqual({
        foo: 'foo',
        children: []
      })
      expect(prevStateArg).toEqual({
        value: 1
      })
      expect(curProps).toEqual({
        foo: 'bar',
        children: []
      })
      expect(curState).toEqual({
        value: 2
      })
      // New state
      // state.value: 2 -> 3 in updateState, 3 -> 4 in gDSFP
      updateState()
      rerender()
      expect(element.textContent).toEqual('4')
      expect(prevPropsArg).toEqual({
        foo: 'bar',
        children: []
      })
      expect(prevStateArg).toEqual({
        value: 2
      })
      expect(curProps).toEqual({
        foo: 'bar',
        children: []
      })
      expect(curState).toEqual({
        value: 4
      })
    })
  })
})
