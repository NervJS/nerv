/** @jsx createElement */
import { Component, createElement, render, createContext } from '../src/index'
import { rerender } from '../src/render-queue'
import { uid } from '../src/create-context'
import sinon from 'sinon'
import { normalizeHTML } from './util'

describe('create-context', () => {
  /**
   * @type {Element} scratch The current attached DOM
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  it('should pass context to a consumer', () => {
    const { Provider, Consumer } = createContext()
    const CONTEXT = { a: 'a' }
    let inst

    class Inner extends Component {
      constructor () {
        super(...arguments)
        inst = this
      }
      render (props) {
        return <div>{this.props.a}</div>
      }
    }

    // const spy = sinon.spy(Inner.prototype, 'render')

    render(
      <Provider value={CONTEXT}>
        <div>
          <Consumer>{data => <Inner {...data} />}</Consumer>
        </div>
      </Provider>,
      scratch
    )

    expect(inst.context['__context_' + (uid - 1) + '__'].value).toBe(CONTEXT)
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div><div>a</div></div>'))
  })

  it('should preserve provider context through nesting providers', done => {
    const { Provider, Consumer } = createContext()
    const CONTEXT = { a: 'a' }
    const CHILD_CONTEXT = { b: 'b' }
    let inst

    class Inner extends Component {
      constructor () {
        super(...arguments)
        inst = this
      }
      render () {
        return (
          <div>
            {this.props.a} - {this.props.b}
          </div>
        )
      }
    }

    const spy = sinon.spy(Inner.prototype, 'render')

    render(
      <Provider value={CONTEXT}>
        <Consumer>
          {data => (
            <Provider value={CHILD_CONTEXT}>
              <Consumer>
                {childData => <Inner {...data} {...childData} />}
              </Consumer>
            </Provider>
          )}
        </Consumer>
      </Provider>,
      scratch
    )

    // initial render does not invoke anything but render():
    // expect(Inner.prototype.render).to.have.been.calledWithMatch(
    //   { ...CONTEXT, ...CHILD_CONTEXT },
    //   {},
    //   { ['__cC' + (uid - 1)]: {} }
    // )
    // debugger
    expect(inst.props.a).toBe('a')
    expect(inst.props.b).toBe('b')
    expect(inst.context['__context_' + (uid - 1) + '__']).not.toBeUndefined()
    expect(spy.calledOnce).toBeTruthy()
    // expect(Inner.prototype.render).to.be.calledOnce
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>a - b</div>'))
    setTimeout(() => {
      expect(spy.calledOnce).toBeTruthy()
      done()
    }, 0)
  })

  it('should preserve provider context between different providers', () => {
    const { Provider: ThemeProvider, Consumer: ThemeConsumer } = createContext()
    const { Provider: DataProvider, Consumer: DataConsumer } = createContext()
    const THEME_CONTEXT = { theme: 'black' }
    const DATA_CONTEXT = { global: 'a' }
    let inst

    class Inner extends Component {
      constructor () {
        super(...arguments)
        inst = this
      }
      render (props) {
        return (
          <div>
            {this.props.theme} - {this.props.global}
          </div>
        )
      }
    }

    sinon.spy(Inner.prototype, 'render')

    render(
      <ThemeProvider value={THEME_CONTEXT.theme}>
        <DataProvider value={DATA_CONTEXT}>
          <ThemeConsumer>
            {theme => (
              <DataConsumer>
                {data => <Inner theme={theme} {...data} />}
              </DataConsumer>
            )}
          </ThemeConsumer>
        </DataProvider>
      </ThemeProvider>,
      scratch
    )

    expect(inst.props.theme).toBe('black')
    expect(inst.props.global).toBe('a')
    expect(inst.context['__context_' + (uid - 1) + '__']).not.toBeUndefined()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>black - a</div>'))
  })

  it('should preserve provider context through nesting consumers', () => {
    const { Provider, Consumer } = createContext()
    const CONTEXT = { a: 'a' }
    let inst

    class Inner extends Component {
      constructor () {
        super(...arguments)
        inst = this
      }
      render (props) {
        return <div>{this.props.a}</div>
      }
    }

    sinon.spy(Inner.prototype, 'render')

    render(
      <Provider value={CONTEXT}>
        <Consumer>
          {data => (
            <Consumer>
              {childData => <Inner {...data} {...childData} />}
            </Consumer>
          )}
        </Consumer>
      </Provider>,
      scratch
    )

    expect(inst.props.a).toBe('a')
    expect(inst.context['__context_' + (uid - 1) + '__']).not.toBeUndefined()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>a</div>'))
  })

  it('should not emit when value does not update', () => {
    const { Provider, Consumer } = createContext()
    const CONTEXT = { a: 'a' }

    class NoUpdate extends Component {
      shouldComponentUpdate () {
        return false
      }

      render () {
        return this.props.children
      }
    }

    class Inner extends Component {
      render (props) {
        return <div>{this.props.a}</div>
      }
    }

    const spy = sinon.spy(Inner.prototype, 'render')

    render(
      <div>
        <Provider value={CONTEXT}>
          <NoUpdate>
            <Consumer>{data => <Inner {...data} />}</Consumer>
          </NoUpdate>
        </Provider>
      </div>,
      scratch
    )

    expect(spy.calledOnce).toBeTruthy()

    render(
      <div>
        <Provider value={CONTEXT}>
          <NoUpdate>
            <Consumer>{data => <Inner {...data} />}</Consumer>
          </NoUpdate>
        </Provider>
      </div>,
      scratch
    )

    expect(spy.calledOnce).toBeTruthy()
  })

  it('should preserve provider context through nested components', () => {
    const { Provider, Consumer } = createContext()
    const CONTEXT = { a: 'a' }
    let inst
    class Consumed extends Component {
      constructor () {
        super(...arguments)
        inst = this
      }
      render (props) {
        return <strong>{this.props.a}</strong>
      }
    }

    sinon.spy(Consumed.prototype, 'render')

    class Outer extends Component {
      render () {
        return (
          <div>
            <Inner />
          </div>
        )
      }
    }

    class Inner extends Component {
      render () {
        return <InnerMost />
      }
    }

    class InnerMost extends Component {
      render () {
        return (
          <div>
            <Consumer>{data => <Consumed {...data} />}</Consumer>
          </div>
        )
      }
    }

    render(
      <Provider value={CONTEXT}>
        <Outer />
      </Provider>,
      scratch
    )

    // initial render does not invoke anything but render():
    expect(inst.props.a).toBe('a')
    expect(inst.context['__context_' + (uid - 1) + '__']).not.toBeUndefined()
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div><strong>a</strong></div></div>')
    )
  })

  it('should propagates through shouldComponentUpdate false', done => {
    const { Provider, Consumer } = createContext()
    const CONTEXT = { a: 'a' }
    const UPDATED_CONTEXT = { a: 'b' }

    class Consumed extends Component {
      render (props) {
        return <strong>{this.props.a}</strong>
      }
    }

    const spy = sinon.spy(Consumed.prototype, 'render')

    class Outer extends Component {
      render () {
        return (
          <div>
            <Inner />
          </div>
        )
      }
    }

    class Inner extends Component {
      shouldComponentUpdate () {
        return false
      }

      render () {
        return <InnerMost />
      }
    }

    class InnerMost extends Component {
      render () {
        return (
          <div>
            <Consumer>{data => <Consumed {...data} />}</Consumer>
          </div>
        )
      }
    }

    class App extends Component {
      render () {
        return (
          <Provider value={this.props.value}>
            <Outer />
          </Provider>
        )
      }
    }

    render(<App value={CONTEXT} />, scratch)
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div><strong>a</strong></div></div>')
    )
    // expect(Consumed.prototype.render).to.have.been.calledOnce
    expect(spy.calledOnce).toBeTruthy()
    render(<App value={UPDATED_CONTEXT} />, scratch)

    rerender()
    // initial render does not invoke anything but render():
    // expect(Consumed.prototype.render).to.have.been.calledTwice
    expect(spy.calledTwice).toBeTruthy()
    // expect(Consumed.prototype.render).to.have.been.calledWithMatch({ ...UPDATED_CONTEXT }, {}, { ['__cC' + (ctxId - 1)]: {} });
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div><strong>b</strong></div></div>')
    )
    setTimeout(() => {
      expect(spy.calledTwice).toBeTruthy()
      // expect(Consumed.prototype.render).to.have.been.calledTwice
      done()
    })
  })

  it('should keep the right context at the right "depth"', () => {
    const { Provider, Consumer } = createContext()
    const CONTEXT = { theme: 'a', global: 1 }
    const NESTED_CONTEXT = { theme: 'b', global: 2 }
    let innerInst
    let nestedInst

    class Inner extends Component {
      constructor () {
        super(...arguments)
        innerInst = this
      }
      render (props) {
        return (
          <div>
            {this.props.theme} - {this.props.global}
          </div>
        )
      }
    }
    class Nested extends Component {
      constructor () {
        super(...arguments)
        nestedInst = this
      }
      render (props) {
        return (
          <div>
            {this.props.theme} - {this.props.global}
          </div>
        )
      }
    }

    render(
      <Provider value={CONTEXT}>
        <Provider value={NESTED_CONTEXT}>
          <Consumer>{data => <Nested {...data} />}</Consumer>
        </Provider>
        <Consumer>{data => <Inner {...data} />}</Consumer>
      </Provider>,
      scratch
    )

    expect(innerInst.props.theme).toBe(CONTEXT.theme)
    expect(innerInst.props.global).toBe(CONTEXT.global)
    expect(nestedInst.props.global).toBe(NESTED_CONTEXT.global)
    expect(nestedInst.props.theme).toBe(NESTED_CONTEXT.theme)

    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div>b - 2</div><div>a - 1</div>')
    )
  })

  describe('contextTypes', () => {
    it('should use default value', () => {
      const ctx = createContext('foo')

      let actual
      class App extends Component {
        render () {
          actual = this.context
          return <div>bar</div>
        }
      }

      App.contextType = ctx

      render(<App />, scratch)
      expect(actual).toEqual('foo')
    })
  })

  it('should use the value of the nearest Provider', () => {
    const ctx = createContext('foo')

    let actual
    class App extends Component {
      render () {
        actual = this.context
        return <div>bar</div>
      }
    }

    App.contextType = ctx
    const Provider = ctx.Provider

    render(
      <Provider value='bar'>
        <Provider value='bob'>
          <App />
        </Provider>
      </Provider>,
      scratch
    )
    expect(actual).toEqual('bob')
  })

  it('should pass the correct value after changing the context value', () => {
    const ctx = createContext('foo')
    let doSetState = null

    let actual
    class Children extends Component {
      render () {
        actual = this.context
        return <div>bar</div>
      }
    }

    Children.contextType = ctx
    const Provider = ctx.Provider

    class App extends Component {
      constructor () {
        super(...arguments)
        this.state = { value: 'bar' }
      }
      componentDidMount () {
        doSetState = (value) => {
          this.setState({ value })
        }
      }
      render () {
        return <Provider value={this.state.value}>
          <Children />
        </Provider>
      }
    }

    render(<App />, scratch)
    expect(actual).toEqual('bar')

    doSetState('bob')
    rerender()
    expect(actual).toEqual('bob')
  })

  it('should restore legacy context for children', () => {
    const Foo = createContext('foo')
    const spy = sinon.spy()

    class NewContext extends Component {
      render () {
        return <div>{this.props.children}</div>
      }
    }

    class OldContext extends Component {
      getChildContext () {
        return { foo: 'foo' }
      }

      render () {
        return <div>{this.props.children}</div>
      }
    }

    class Inner extends Component {
      render () {
        spy(this.context)
        return <div>Inner</div>
      }
    }

    NewContext.contextType = Foo

    render(
      <Foo.Provider value='bar'>
        <OldContext>
          <NewContext>
            <Inner />
          </NewContext>
        </OldContext>
      </Foo.Provider>,
      scratch
    )

    expect(spy.calledWithMatch({ foo: 'foo' })).toBeTruthy()
  })

  it('should call componentWillUnmount', () => {
    const Foo = createContext('foo')
    const spy = sinon.spy()

    let instance
    class App extends Component {
      constructor (props) {
        super(props)
        instance = this
      }

      componentWillUnmount () {
        spy(this)
      }

      render () {
        return <div />
      }
    }

    App.contextType = Foo

    render(
      <Foo.Provider value='foo'>
        <App />
      </Foo.Provider>,
      scratch
    )

    render(null, scratch)

    expect(spy.calledOnce).toBeTruthy()
    expect(spy.getCall(0).args[0]).toEqual(instance)
  })
})
