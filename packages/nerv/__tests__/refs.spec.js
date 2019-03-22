/** @jsx createElement */
import { Component, createElement, render, findDOMNode, createRef, forwardRef, memo } from '../src'
import sinon from 'sinon'

const spy = (name, ...args) => {
  const spy = sinon.spy(...args)
  spy.displayName = `spy('${name}')`
  return spy
}

describe('refs', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
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

  it.skip('should pass rendered DOM from functional components to ref functions', () => {
    const ref = spy('ref')

    const Foo = () => <div />

    render(<Foo ref={ref} />, scratch)
    expect(ref.calledOnce).toBeTruthy()
  })

  it('should support createRef', () => {
    const r = createRef()
    expect(r.current).toEqual(undefined)

    render(<div ref={r} />, scratch)
    expect(r.current).toEqual(scratch.firstChild)
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
        ) : (
          <div />
        )
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
    expect(inner.calledWith(findDOMNode(inst))).toBeTruthy()

    outer.reset()
    inner.reset()

    rerender()

    inner.reset()
    InnermostComponent = 'x-span'
    rerender()
    outerC.forceUpdate()
    if (document.documentMode === 8) {
      return
    }
    expect(inner.secondCall.calledWith(findDOMNode(inst))).toBeTruthy()
    expect(inner.firstCall.calledWith(null)).toBeTruthy()
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
    expect(innermost.calledWith(findDOMNode(innerInst))).toBeTruthy()

    outer.reset()
    inner.reset()
    innermost.reset()
    outerInst.forceUpdate()

    innermost.reset()
    InnermostComponent = 'x-span'
    outerInst.forceUpdate()
    expect(innermost.secondCall.calledWith(findDOMNode(innerInst))).toBeTruthy()
    expect(innermost.firstCall.calledWith(null)).toBeTruthy()
    InnermostComponent = 'span'

    outer.reset()
    inner.reset()
    innermost.reset()
  })

  it('should null and re-invoke refs when swapping component root element type', () => {
    let inst

    class App extends Component {
      render () {
        return (
          <div>
            <Child />
          </div>
        )
      }
    }

    class Child extends Component {
      constructor (props, context) {
        super(props, context)
        this.state = { show: false }
        inst = this
      }
      handleMount () {}
      render () {
        if (!this.state.show) return <div id='div' ref={this.handleMount} />
        return (
          <span id='span' ref={this.handleMount}>
            some test content
          </span>
        )
      }
    }
    const childSpy = sinon.spy(Child.prototype, 'handleMount')

    render(<App />, scratch)
    expect(childSpy.calledWith(scratch.querySelector('#div'))).toBeTruthy()
    inst.handleMount.reset()

    inst.setState({ show: true })
    inst.forceUpdate()
    expect(childSpy.callCount).toBe(2)
    expect(
      childSpy.secondCall.calledWith(scratch.querySelector('#span'))
    ).toBeTruthy()
    expect(childSpy.firstCall.calledWith(null)).toBeTruthy()
    inst.handleMount.reset()

    inst.setState({ show: false })
    inst.forceUpdate()
    expect(childSpy.callCount).toBe(2)
    expect(
      childSpy.secondCall.calledWith(scratch.querySelector('#div'))
    ).toBeTruthy()
    expect(childSpy.firstCall.calledWith(null)).toBeTruthy()
  })

  it('should support string refs', () => {
    let inst, innerInst

    class Foo extends Component {
      constructor () {
        super()
        inst = this
      }

      render () {
        return (
          <div ref='top'>
            <h1 ref='h1'>h1</h1>
            <p ref='p'>
              <span ref='span'>text</span>
              <Inner ref='inner' />
            </p>
          </div>
        )
      }
    }

    class Inner extends Component {
      constructor () {
        super()
        innerInst = this
      }

      render () {
        return (
          <div className='contained' ref='contained'>
            <h2 ref='inner-h2'>h2</h2>
          </div>
        )
      }
    }

    render(<Foo />, scratch)

    expect(inst.refs.top).toBe(scratch.firstChild)
    expect(inst.refs.h1).toBe(scratch.querySelector('h1'))
    expect(inst.refs.p).toBe(scratch.querySelector('p'))
    expect(inst.refs.span).toBe(scratch.querySelector('span'))
    expect(inst.refs.inner).toBe(innerInst)
    expect(innerInst.refs['inner-h2']).toBe(scratch.querySelector('h2'))
    expect(innerInst.refs['contained']).toBe(
      scratch.querySelector('.contained')
    )
  })

  it('should remove string refs', () => {
    let innerInst
    class Bar extends Component {
      render () {
        return <div />
      }
    }
    class Foo extends Component {
      constructor () {
        super()
        this.state = {
          hide: false
        }
        innerInst = this
      }
      render () {
        return this.state.hide ? <Bar ref='b' /> : <Bar ref='top' />
      }
    }
    render(<Foo />, scratch)
    innerInst.setState({
      hide: true
    })
    innerInst.forceUpdate()
    expect(innerInst.refs['top']).toBe(undefined)
  })

  it('should not pass refs to children', () => {
    // let innerInst
    const spy = sinon.spy()

    class Inner extends Component {
      render () {
        return <div />
      }
    }
    class Bar extends Component {
      render () {
        return <Inner {...this.props} />
      }
    }
    class Foo extends Component {
      render () {
        return <Bar ref={spy} />
      }
    }
    render(<Foo />, scratch)
    expect(spy.callCount).toBe(1)
  })

  describe('forwardRef', () => {
    it('should pass ref with createRef', () => {
      const App = forwardRef((_, ref) => <div ref={ref}>foo</div>)
      const ref = createRef()
      render(<App ref={ref} />, scratch)

      expect(ref.current).toEqual(scratch.firstChild)
    })

    it('should share the same ref reference', () => {
      let passedRef
      const App = forwardRef((_, ref) => {
        passedRef = ref
        return <div ref={ref}>foo</div>
      })

      const ref = createRef()
      render(<App ref={ref} />, scratch)

      expect(ref).toEqual(passedRef)
    })

    it('should pass ref with a callback', () => {
      const App = forwardRef((_, ref) => <div><span ref={ref}>foo</span></div>)
      let ref
      render(<App ref={x => (ref = x)} />, scratch)

      expect(ref).toEqual(scratch.firstChild.firstChild)
    })

    it('should forward props', () => {
      const spy = sinon.spy()
      const App = forwardRef(spy)
      render(<App foo='bar' />, scratch)

      expect(spy.calledWithMatch({ foo: 'bar' })).toBeTruthy()
    })

    it('should support nesting', () => {
      let passedRef
      const Inner = forwardRef((_, ref) => {
        passedRef = ref
        return <div ref={ref}>inner</div>
      })
      const App = forwardRef((_, ref) => <Inner ref={ref} />)

      const ref = createRef()
      render(<App ref={ref} />, scratch)

      expect(ref).toEqual(passedRef)
    })

    it('should forward null on unmount', () => {
      let passedRef
      const App = forwardRef((_, ref) => {
        passedRef = ref
        return <div ref={ref}>foo</div>
      })

      const ref = createRef()
      render(<App ref={ref} />, scratch)
      render(null, scratch)

      expect(passedRef.current).toEqual(null)
    })

    // it.skip('should be able to render and hydrate forwardRef components', () => {
    //   const Foo = ({ label, forwardedRef }) => (
    //     <div ref={forwardedRef}>{label}</div>
    //   )
    //   const App = forwardRef((props, ref) => (
    //     <Foo {...props} forwardedRef={ref} />
    //   ))

    //   const ref = createRef()
    //   const markup = <App ref={ref} label='Hi' />

    //   const element = document.createElement('div')
    //   element.innerHTML = '<div>Hi</div>'
    //   expect(element.textContent).toEqual('Hi')
    //   expect(ref.current == null).toEqual(true)

    //   hydrate(markup, element)
    //   expect(element.textContent).toEqual('Hi')
    //   expect(ref.current.tagName).toEqual('DIV')
    // })

    it('should update refs when switching between children', () => {
      function Foo ({ forwardedRef, setRefOnDiv }) {
        return (
          <section>
            <div ref={setRefOnDiv ? forwardedRef : null}>First</div>
            <span ref={setRefOnDiv ? null : forwardedRef}>Second</span>
          </section>
        )
      }

      const App = forwardRef((props, ref) => (
        <Foo {...props} forwardedRef={ref} />
      ))

      const ref = createRef()

      render(<App ref={ref} setRefOnDiv />, scratch)
      expect(ref.current.nodeName).toEqual('DIV')

      render(<App ref={ref} setRefOnDiv={false} />, scratch)
      expect(ref.current.nodeName).toEqual('SPAN')
    })

    it('should support rendering null', () => {
      const App = forwardRef(() => null)
      const ref = createRef()

      render(<App ref={ref} />, scratch)
      expect(ref.current == null).toEqual(true)
    })

    it('should support rendering null for multiple children', () => {
      const Foo = forwardRef(() => null)
      const ref = createRef()

      render(
        <div>
          <div />
          <Foo ref={ref} />
          <div />
        </div>,
        scratch
      )
      expect(ref.current == null).toEqual(true)
    })

    it('should not bailout if forwardRef is not wrapped in memo', () => {
      const Component = props => <div {...props} />

      let renderCount = 0

      const App = forwardRef((props, ref) => {
        renderCount++
        return <Component {...props} forwardedRef={ref} />
      })

      const ref = createRef()

      render(<App ref={ref} optional='foo' />, scratch)
      expect(renderCount).toEqual(1)

      render(<App ref={ref} optional='foo' />, scratch)
      expect(renderCount).toEqual(2)
    })

    it('should bailout if forwardRef is wrapped in memo', () => {
      const Component = props => <div ref={props.forwardedRef} />

      let renderCount = 0

      const App = memo(
        forwardRef((props, ref) => {
          renderCount++
          return <Component {...props} forwardedRef={ref} />
        })
      )

      const ref = createRef()

      render(<App ref={ref} optional='foo' />, scratch)
      expect(renderCount).toEqual(1)

      expect(ref.current.nodeName).toEqual('DIV')

      render(<App ref={ref} optional='foo' />, scratch)
      expect(renderCount).toEqual(1)

      const differentRef = createRef()

      render(
        <App ref={differentRef} optional='foo' />,
        scratch
      )
      expect(renderCount).toEqual(2)

      expect(ref.current == null).toEqual(true)
      expect(differentRef.current.nodeName).toEqual('DIV')

      render(<App ref={ref} optional='bar' />, scratch)
      expect(renderCount).toEqual(3)
    })

    it('should pass ref through memo() with custom comparer function', () => {
      const Foo = props => <div ref={props.forwardedRef} />

      let renderCount = 0

      const App = memo(
        forwardRef((props, ref) => {
          renderCount++
          return <Foo {...props} forwardedRef={ref} />
        }),
        (o, p) => o.a === p.a && o.b === p.b
      )

      const ref = createRef()

      render(<App ref={ref} a='0' b='0' c='1' />, scratch)
      expect(renderCount).toEqual(1)

      expect(ref.current.nodeName).toEqual('DIV')

      // Changing either a or b rerenders
      render(<App ref={ref} a='0' b='1' c='1' />, scratch)
      expect(renderCount).toEqual(2)

      // Changing c doesn't rerender
      render(<App ref={ref} a='0' b='1' c='2' />, scratch)
      expect(renderCount).toEqual(2)

      const App2 = memo(
        App,
        (o, p) => o.a === p.a && o.c === p.c
      )

      render(<App2 ref={ref} a='0' b='0' c='0' />, scratch)
      expect(renderCount).toEqual(3)

      // Changing just b no longer updates
      render(<App2 ref={ref} a='0' b='1' c='0' />, scratch)
      expect(renderCount).toEqual(3)

      // Changing just a and c updates
      render(<App2 ref={ref} a='2' b='2' c='2' />, scratch)
      expect(renderCount).toEqual(4)

      // Changing just c does not update
      render(<App2 ref={ref} a='2' b='2' c='3' />, scratch)
      expect(renderCount).toEqual(4)

      // Changing ref still rerenders
      const differentRef = createRef()

      render(<App2 ref={differentRef} a='2' b='2' c='3' />, scratch)
      // expect(renderCount).toEqual(5)

      expect(ref.current == null).toEqual(true)
      expect(differentRef.current.nodeName).toEqual('DIV')
    })
  })
})
