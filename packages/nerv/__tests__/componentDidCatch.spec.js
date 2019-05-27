/** @jsx createElement */
/* eslint-disable */

import {
  Component,
  createElement,
  render,
  unmountComponentAtNode
} from '../src'
import { delay } from './util'
const Empty = () => null
function clearRender(dom) {
  scratch = document.createElement('div')
  const c = dom.firstElementChild
  if (c) {
    render(<Empty />, dom)
  }
}
function clearAll(...doms) {
  doms.forEach(clearRender)
}
describe('ComponentDidCatch', () => {
  let scratch

  let log

  let BrokenConstructor
  let BrokenComponentWillMount
  let BrokenComponentDidMount
  let BrokenComponentWillReceiveProps
  let BrokenComponentWillUpdate
  let BrokenComponentDidUpdate
  let BrokenComponentWillUnmount
  let BrokenRenderErrorBoundary
  let BrokenComponentWillMountErrorBoundary
  let BrokenComponentDidMountErrorBoundary
  let BrokenRender
  let ErrorBoundary
  let ErrorMessage
  let NoopErrorBoundary
  let RetryErrorBoundary
  let Normal
  beforeAll(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch = document.createElement('div')
    const c = scratch.firstElementChild
    if (c) {
      render(<Empty />, scratch)
    }

    log = []

    BrokenConstructor = class extends Component {
      constructor(props) {
        super(props)
        log.push('BrokenConstructor constructor [!]')
        throw new Error('Hello')
      }
      render() {
        log.push('BrokenConstructor render')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenConstructor componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenConstructor componentDidMount')
      }
      componentWillReceiveProps() {
        log.push('BrokenConstructor componentWillReceiveProps')
      }
      componentWillUpdate() {
        log.push('BrokenConstructor componentWillUpdate')
      }
      componentDidUpdate() {
        log.push('BrokenConstructor componentDidUpdate')
      }
      componentWillUnmount() {
        log.push('BrokenConstructor componentWillUnmount')
      }
    }

    BrokenComponentWillMount = class extends Component {
      constructor(props) {
        super(props)
        log.push('BrokenComponentWillMount constructor')
      }
      render() {
        log.push('BrokenComponentWillMount render')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentWillMount componentWillMount [!]')
        throw new Error('Hello')
      }
      componentDidMount() {
        log.push('BrokenComponentWillMount componentDidMount')
      }
      componentWillReceiveProps() {
        log.push('BrokenComponentWillMount componentWillReceiveProps')
      }
      componentWillUpdate() {
        log.push('BrokenComponentWillMount componentWillUpdate')
      }
      componentDidUpdate() {
        log.push('BrokenComponentWillMount componentDidUpdate')
      }
      componentWillUnmount() {
        log.push('BrokenComponentWillMount componentWillUnmount')
      }
    }

    BrokenComponentDidMount = class extends Component {
      constructor(props) {
        super(props)
        log.push('BrokenComponentDidMount constructor')
      }
      render() {
        log.push('BrokenComponentDidMount render')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentDidMount componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenComponentDidMount componentDidMount [!]')
        throw new Error('Hello')
      }
      componentWillReceiveProps() {
        log.push('BrokenComponentDidMount componentWillReceiveProps')
      }
      componentWillUpdate() {
        log.push('BrokenComponentDidMount componentWillUpdate')
      }
      componentDidUpdate() {
        log.push('BrokenComponentDidMount componentDidUpdate')
      }
      componentWillUnmount() {
        log.push('BrokenComponentDidMount componentWillUnmount')
      }
    }

    BrokenComponentWillReceiveProps = class extends Component {
      constructor(props) {
        super(props)
        log.push('BrokenComponentWillReceiveProps constructor')
      }
      render() {
        log.push('BrokenComponentWillReceiveProps render')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentWillReceiveProps componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenComponentWillReceiveProps componentDidMount')
      }
      componentWillReceiveProps() {
        log.push(
          'BrokenComponentWillReceiveProps componentWillReceiveProps [!]'
        )
        throw new Error('Hello')
      }
      componentWillUpdate() {
        log.push('BrokenComponentWillReceiveProps componentWillUpdate')
      }
      componentDidUpdate() {
        log.push('BrokenComponentWillReceiveProps componentDidUpdate')
      }
      componentWillUnmount() {
        log.push('BrokenComponentWillReceiveProps componentWillUnmount')
      }
    }

    BrokenComponentWillUpdate = class extends Component {
      constructor(props) {
        super(props)
        log.push('BrokenComponentWillUpdate constructor')
      }
      render() {
        log.push('BrokenComponentWillUpdate render')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentWillUpdate componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenComponentWillUpdate componentDidMount')
      }
      componentWillReceiveProps() {
        log.push('BrokenComponentWillUpdate componentWillReceiveProps')
      }
      componentWillUpdate() {
        log.push('BrokenComponentWillUpdate componentWillUpdate [!]')
        throw new Error('Hello')
      }
      componentDidUpdate() {
        log.push('BrokenComponentWillUpdate componentDidUpdate')
      }
      componentWillUnmount() {
        log.push('BrokenComponentWillUpdate componentWillUnmount')
      }
    }

    BrokenComponentDidUpdate = class extends Component {
      static defaultProps = {
        errorText: 'Hello'
      }
      constructor(props) {
        super(props)
        log.push('BrokenComponentDidUpdate constructor')
      }
      render() {
        log.push('BrokenComponentDidUpdate render')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentDidUpdate componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenComponentDidUpdate componentDidMount')
      }
      componentWillReceiveProps() {
        log.push('BrokenComponentDidUpdate componentWillReceiveProps')
      }
      componentWillUpdate() {
        log.push('BrokenComponentDidUpdate componentWillUpdate')
      }
      componentDidUpdate() {
        log.push('BrokenComponentDidUpdate componentDidUpdate [!]')
        throw new Error(this.props.errorText)
      }
      componentWillUnmount() {
        log.push('BrokenComponentDidUpdate componentWillUnmount')
      }
    }

    BrokenComponentWillUnmount = class extends Component {
      static defaultProps = {
        errorText: 'Hello'
      }
      constructor(props) {
        super(props)
        log.push('BrokenComponentWillUnmount constructor')
      }
      render() {
        log.push('BrokenComponentWillUnmount render')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentWillUnmount componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenComponentWillUnmount componentDidMount')
      }
      componentWillReceiveProps() {
        log.push('BrokenComponentWillUnmount componentWillReceiveProps')
      }
      componentWillUpdate() {
        log.push('BrokenComponentWillUnmount componentWillUpdate')
      }
      componentDidUpdate() {
        log.push('BrokenComponentWillUnmount componentDidUpdate')
      }
      componentWillUnmount() {
        log.push('BrokenComponentWillUnmount componentWillUnmount [!]')
        throw new Error(this.props.errorText)
      }
    }

    BrokenComponentWillMountErrorBoundary = class extends Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
        log.push('BrokenComponentWillMountErrorBoundary constructor')
      }
      render() {
        if (this.state.error) {
          log.push('BrokenComponentWillMountErrorBoundary render error')
          return <div>Caught an error: {this.state.error.message}.</div>
        }
        log.push('BrokenComponentWillMountErrorBoundary render success')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentWillMountErrorBoundary componentWillMount [!]')
        throw new Error('Hello')
      }
      componentDidMount() {
        log.push('BrokenComponentWillMountErrorBoundary componentDidMount')
      }
      componentWillUnmount() {
        log.push('BrokenComponentWillMountErrorBoundary componentWillUnmount')
      }
      componentDidCatch(error) {
        log.push('BrokenComponentWillMountErrorBoundary componentDidCatch')
        this.setState({ error })
      }
    }

    BrokenComponentDidMountErrorBoundary = class extends Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
        log.push('BrokenComponentDidMountErrorBoundary constructor')
      }
      render() {
        if (this.state.error) {
          log.push('BrokenComponentDidMountErrorBoundary render error')
          return <div>Caught an error: {this.state.error.message}.</div>
        }
        log.push('BrokenComponentDidMountErrorBoundary render success')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenComponentDidMountErrorBoundary componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenComponentDidMountErrorBoundary componentDidMount [!]')
        throw new Error('Hello')
      }
      componentWillUnmount() {
        log.push('BrokenComponentDidMountErrorBoundary componentWillUnmount')
      }
      componentDidCatch(error) {
        log.push('BrokenComponentDidMountErrorBoundary componentDidCatch')
        this.setState({ error })
      }
    }

    BrokenRenderErrorBoundary = class extends Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
        log.push('BrokenRenderErrorBoundary constructor')
      }
      render() {
        if (this.state.error) {
          log.push('BrokenRenderErrorBoundary render error [!]')
          throw new Error('Hello')
        }
        log.push('BrokenRenderErrorBoundary render success')
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push('BrokenRenderErrorBoundary componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenRenderErrorBoundary componentDidMount')
      }
      componentWillUnmount() {
        log.push('BrokenRenderErrorBoundary componentWillUnmount')
      }
      componentDidCatch(error) {
        log.push('BrokenRenderErrorBoundary componentDidCatch')
        this.setState({ error })
      }
    }

    BrokenRender = class extends Component {
      constructor(props) {
        super(props)
        log.push('BrokenRender constructor')
      }
      render() {
        log.push('BrokenRender render [!]')
        throw new Error('Hello')
      }
      componentWillMount() {
        log.push('BrokenRender componentWillMount')
      }
      componentDidMount() {
        log.push('BrokenRender componentDidMount')
      }
      componentWillReceiveProps() {
        log.push('BrokenRender componentWillReceiveProps')
      }
      componentWillUpdate() {
        log.push('BrokenRender componentWillUpdate')
      }
      componentDidUpdate() {
        log.push('BrokenRender componentDidUpdate')
      }
      componentWillUnmount() {
        log.push('BrokenRender componentWillUnmount')
      }
    }

    NoopErrorBoundary = class extends Component {
      constructor(props) {
        super(props)
        log.push('NoopErrorBoundary constructor')
      }
      render() {
        log.push('NoopErrorBoundary render')
        return <BrokenRender />
      }
      componentWillMount() {
        log.push('NoopErrorBoundary componentWillMount')
      }
      componentDidMount() {
        log.push('NoopErrorBoundary componentDidMount')
      }
      componentWillUnmount() {
        log.push('NoopErrorBoundary componentWillUnmount')
      }
      componentDidCatch() {
        log.push('NoopErrorBoundary componentDidCatch')
      }
    }

    Normal = class extends Component {
      static defaultProps = {
        logName: 'Normal'
      }
      constructor(props) {
        super(props)
        log.push(`${this.props.logName} constructor`)
      }
      render() {
        log.push(`${this.props.logName} render`)
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        log.push(`${this.props.logName} componentWillMount`)
      }
      componentDidMount() {
        log.push(`${this.props.logName} componentDidMount`)
      }
      componentWillReceiveProps() {
        log.push(`${this.props.logName} componentWillReceiveProps`)
      }
      componentWillUpdate() {
        log.push(`${this.props.logName} componentWillUpdate`)
      }
      componentDidUpdate() {
        log.push(`${this.props.logName} componentDidUpdate`)
      }
      componentWillUnmount() {
        log.push(`${this.props.logName} componentWillUnmount`)
      }
    }

    ErrorBoundary = class extends Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
        log.push(`${this.props.logName} constructor`)
      }
      render() {
        if (this.state.error && !this.props.forceRetry) {
          log.push(`${this.props.logName} render error`)
          return `Caught an error: ${this.state.error.message}.`
        }
        log.push(`${this.props.logName} render success`)
        return <div>{this.props.children}</div>
      }
      componentDidCatch(error) {
        log.push(`${this.props.logName} componentDidCatch`)
        this.setState({ error })
      }
      componentWillMount() {
        log.push(`${this.props.logName} componentWillMount`)
      }
      componentDidMount() {
        log.push(`${this.props.logName} componentDidMount`)
      }
      componentWillReceiveProps() {
        log.push(`${this.props.logName} componentWillReceiveProps`)
      }
      componentWillUpdate() {
        log.push(`${this.props.logName} componentWillUpdate`)
      }
      componentDidUpdate() {
        log.push(`${this.props.logName} componentDidUpdate`)
      }
      componentWillUnmount() {
        log.push(`${this.props.logName} componentWillUnmount`)
      }
    }
    ErrorBoundary.defaultProps = {
      logName: 'ErrorBoundary',
      renderError(error, props) {
        return (
          <div ref={props.errorMessageRef}>
            Caught an error: {error.message}.
          </div>
        )
      }
    }

    RetryErrorBoundary = class extends Component {
      state = {}
      constructor(props) {
        super(props)
        log.push('RetryErrorBoundary constructor')
      }
      render() {
        log.push('RetryErrorBoundary render')
        return <BrokenRender />
      }
      componentWillMount() {
        log.push('RetryErrorBoundary componentWillMount')
      }
      componentDidMount() {
        log.push('RetryErrorBoundary componentDidMount')
      }
      componentWillUnmount() {
        log.push('RetryErrorBoundary componentWillUnmount')
      }
      componentDidCatch(e) {
        log.push('RetryErrorBoundary componentDidCatch [!]')
        // In Fiber, calling setState() (and failing) is treated as a rethrow.
        this.setState({})
      }
    }

    ErrorMessage = class extends Component {
      constructor(props) {
        super(props)
        log.push('ErrorMessage constructor')
      }
      componentWillMount() {
        log.push('ErrorMessage componentWillMount')
      }
      componentDidMount() {
        log.push('ErrorMessage componentDidMount')
      }
      componentWillUnmount() {
        log.push('ErrorMessage componentWillUnmount')
      }
      render() {
        log.push('ErrorMessage render')
        return <div>Caught an error: {this.props.message}.</div>
      }
    }
  })

  it('does not swallow exceptions on mounting without boundaries', () => {
    var container = document.createElement('div')
    expect(() => {
      render(<BrokenRender />, container)
    }).toThrowError('Hello')

    container = document.createElement('div')
    expect(() => {
      render(<BrokenComponentWillMount />, container)
    }).toThrowError('Hello')

    container = document.createElement('div')
    expect(() => {
      render(<BrokenComponentDidMount />, container)
    }).toThrowError('Hello')
  })

  it('does not swallow exceptions on unmounting without boundaries', () => {
    var container = document.createElement('div')
    render(<BrokenComponentWillUnmount />, container)
    expect(() => {
      unmountComponentAtNode(container)
    }).toThrowError('Hello')
  })

  it('prevents errors from leaking into other roots', async () => {
    var container1 = document.createElement('div')
    var container2 = document.createElement('div')
    var container3 = document.createElement('div')

    render(<span>Before 1</span>, container1)
    expect(() => {
      render(<BrokenRender />, container2)
    }).toThrowError('Hello')
    render(
      <ErrorBoundary>
        <BrokenRender />
      </ErrorBoundary>,
      container3
    )
    await delay()
    expect(container1.firstChild.textContent).toBe('Before 1')
    expect(container2.firstChild).toBe(null)
    expect(container3.firstChild.textContent).toBe('Caught an error: Hello.')
    container1 = document.createElement('div')
    container2 = document.createElement('div')
    container3 = document.createElement('div')
    render(<span>After 1</span>, container1)
    render(<span>After 2</span>, container2)
    render(<ErrorBoundary forceRetry>After 3</ErrorBoundary>, container3)
    expect(container1.firstChild.textContent).toBe('After 1')
    expect(container2.firstChild.textContent).toBe('After 2')
    expect(container3.firstChild.textContent).toBe('After 3')

    unmountComponentAtNode(container1)
    unmountComponentAtNode(container2)
    unmountComponentAtNode(container3)
    expect(container1.firstChild).toBe(null)
    expect(container2.firstChild).toBe(null)
    expect(container3.firstChild).toBe(null)
  })

  it('renders an error state if child throws in render', async () => {
    var container = document.createElement('div')
    render(
      <ErrorBoundary>
        <BrokenRender />
      </ErrorBoundary>,
      container
    )
    await delay()
    expect(container.firstChild.textContent).toBe('Caught an error: Hello.')

    log.length = 0
    unmountComponentAtNode(container)
    expect(log).toEqual(['ErrorBoundary componentWillUnmount'])
  })

  it('renders an error state if child throws in componentWillMount', async () => {
    var container = document.createElement('div')
    render(
      <ErrorBoundary>
        <BrokenComponentWillMount />
      </ErrorBoundary>,
      container
    )
    await delay()
    expect(container.firstChild.textContent).toBe('Caught an error: Hello.')
    log.length = 0
    unmountComponentAtNode(container)
    expect(log).toEqual(['ErrorBoundary componentWillUnmount'])
  })

  it('renders an error state if context provider throws in componentWillMount', async () => {
    class BrokenComponentWillMountWithContext extends Component {
      getChildContext() {
        return { foo: 42 }
      }
      render() {
        return <div>{this.props.children}</div>
      }
      componentWillMount() {
        throw new Error('Hello')
      }
    }

    var container = document.createElement('div')
    render(
      <ErrorBoundary>
        <BrokenComponentWillMountWithContext />
      </ErrorBoundary>,
      container
    )
    await delay()
    expect(container.firstChild.textContent).toBe('Caught an error: Hello.')
  })

  // @TODO: componentDid(Mount|Catch) runs forever
  // it('propagates errors on retry on mounting', async () => {
  //   var container = document.createElement('div')
  //   render(
  //     <ErrorBoundary>
  //       <RetryErrorBoundary />
  //     </ErrorBoundary>,
  //     container
  //   )
  //   await delay()
  //   expect(container.firstChild.textContent).toBe('Caught an error: Hello.')

  //   log.length = 0
  //   unmountComponentAtNode(container)
  //   expect(log).toEqual(['ErrorBoundary componentWillUnmount'])
  // })

  it('propagates errors inside boundary during componentWillMount', async () => {
    var container = document.createElement('div')
    render(
      <ErrorBoundary>
        <BrokenComponentWillMountErrorBoundary />
      </ErrorBoundary>,
      container
    )
    await delay()
    expect(container.firstChild.textContent).toBe('Caught an error: Hello.')

    log.length = 0
    unmountComponentAtNode(container)
    expect(log.indexOf('ErrorBoundary componentWillUnmount') !== -1).toBeTruthy()
  })

  it.skip('propagates errors inside boundary while rendering error state', async () => {
    var container = document.createElement('div')
    render(
      <ErrorBoundary>
        <BrokenRenderErrorBoundary>
          <BrokenRender />
        </BrokenRenderErrorBoundary>
      </ErrorBoundary>,
      container
    )
    await delay()
    expect(container.firstChild.textContent).toBe('Caught an error: Hello.')

    log.length = 0
    unmountComponentAtNode(container)
    expect([...log[0]]).toEqual(['ErrorBoundary componentWillUnmount'])
  })

  // @TODO: we call componentWillUnmount for now
  it('does not call componentWillUnmount when aborting initial mount', async () => {
    var container = document.createElement('div')
    render(
      <ErrorBoundary>
        <Normal />
        <BrokenRender />
        <Normal />
      </ErrorBoundary>,
      container
    )
    await delay()
    expect(container.firstChild.textContent).toBe('Caught an error: Hello.')

    log.length = 0
    unmountComponentAtNode(container)
    expect(log).toEqual(['ErrorBoundary componentWillUnmount'])
  })

  // @TODO: render() diff and replace the old vnode instead of appended
  it('successfully mounts if no error occurs', async () => {
    var container = document.createElement('div')
    render(
      <ErrorBoundary>
        <div>Mounted successfully.</div>
      </ErrorBoundary>,
      container
    )
    await delay()
    expect(container.firstChild.textContent).toBe('Mounted successfully.')
    expect(log).toEqual([
      'ErrorBoundary constructor',
      'ErrorBoundary componentWillMount',
      'ErrorBoundary render success',
      'ErrorBoundary componentDidMount'
    ])

    log.length = 0
    unmountComponentAtNode(container)
    expect(log).toEqual(['ErrorBoundary componentWillUnmount'])
  })

  it('catches render error in Grand son', () => {
    const grandsonError = new Error('error')
    class ErrorBoundary extends Component {
      componentDidCatch(error) {
        expect(error).toBe(grandsonError)
      }
      render() {
        return <Inner />
      }
    }

    class Inner extends Component {
      render() {
        return <GrandSon />
      }
    }

    class GrandSon extends Component {
      render() {
        throw grandsonError
      }
    }

    render(<ErrorBoundary />, scratch)
  })

  it('catches lifeCycles errors in a boundary', async () => {
    class ErrorBoundary extends Component {
      state = { error: null }
      componentDidCatch(error) {
        this.setState({ error })
      }
      render() {
        if (this.state.error) {
          return <span>{`Caught an error: ${this.state.error.message}.`}</span>
        }
        return <div>{this.props.children}</div>
      }
    }

    class BrokenRender extends Component {
      componentDidMount() {
        throw new Error('Hello')
      }
      render() {
        return <span>Hello</span>
      }
    }
    // let app
    render(
      <ErrorBoundary>
        <BrokenRender />
      </ErrorBoundary>,
      scratch
    )

    await delay()
    expect(scratch.firstChild.textContent).toBe('Caught an error: Hello.')
  })

  it('catches render errors in a component', async () => {
    class BrokenRender extends Component {
      state = { error: null }
      componentDidCatch(error) {
        this.setState({ error })
      }
      render() {
        if (this.state.error) {
          return <span>{`Caught an error: ${this.state.error.message}.`}</span>
        }
        throw new Error('broken')
      }
    }
    render(<BrokenRender />, scratch)
    await delay()
    expect(scratch.firstChild.textContent).toBe('Caught an error: broken.')
  })

  it('catches lifeCycles errors in a component', () => {})
})
