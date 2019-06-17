/** @jsx createElement */
import sinon from 'sinon'
import { connect, Provider } from '../dist/index.esm'
import { createElement, Component, render } from 'nervjs'
import { createStore } from 'redux'
import { renderIntoDocument } from './util'

const Empty = () => null

describe('nerv-redux', () => {
  const Child = <div />
  let container
  function renderToContainer (vnode) {
    return render(vnode, container)
  }

  beforeEach(() => {
    container = document.createElement('div')
    const c = container.firstElementChild
    if (c) {
      render(<Empty />, container)
    }
  })

  it('Provider and connect should be exported', () => {
    expect(Provider).toBeDefined()
    expect(connect).toBeDefined()
  })

  it('should enforce only one child', () => {
    const store = createStore(() => ({}))

    expect(() =>
      render(
        <Provider store={store}>
          <Child />
        </Provider>,
        container
      )
    ).not.toThrow()

    // expect(() =>
    //   renderToContainer(
    //     <Provider store={store}>
    //       <Child />
    //       <Child />
    //     </Provider>
    //   )
    // ).toThrowError(/Provider expects only one child/)

    // expect(() => renderToContainer(<Provider store={store} />)).toThrowError(
    //   /Provider expects only one child/
    // )
  })

  it('should have store in the context', () => {
    const store = createStore(() => ({}))
    let child
    const getRef = (ref) => {
      child = ref
    }
    class ProviderChild extends Component {
      render () { return null }
    }
    const instance = renderToContainer(
      <Provider store={store}>
        <ProviderChild ref={getRef} />
      </Provider>
    )

    expect(child.context[Object.keys(child.context)[0]].value.store).toEqual(store)

    // shouldn't modify Provider.context
    expect(instance.context).toEqual({})
  })

  it('should pass state consistently to mapState', (done) => {
    const store = createStore((state = 0, action) => {
      return action.type === '+' ? state + 1 : state - 1
    })
    const mapState = sinon.spy(state => ({ count: state }))
    class Outer extends Component {
      render () {
        return <div>{this.props.count}</div>
      }
    }
    const App = connect(mapState)(Outer)
    renderIntoDocument(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(mapState.called).toBeTruthy()
    store.dispatch({ type: '+' })
    setTimeout(() => {
      expect(mapState.callCount).toBe(2)
      expect(store.getState()).toEqual(0)
      done()
    }, 1)
  })
})
