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
})
