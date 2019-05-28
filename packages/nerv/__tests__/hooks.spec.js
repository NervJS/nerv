/** @jsx createElement */
import {
  createElement,
  useEffect,
  useState,
  useReducer,
  useLayoutEffect,
  render,
  nextTick,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  Component
} from '../src'
import { rerender } from '../src/render-queue'
import { delay } from './util'
import sinon from 'sinon'

const isNode = !!(
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node
)

if (isNode) it.skipKarma = it

describe('hooks', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  describe('useState', () => {
    it('serves the same state across render calls', () => {
      const stateHistory = []

      function Comp () {
        const [state] = useState({ a: 1 })
        stateHistory.push(state)
        return <div />
      }

      render(<Comp />, scratch)
      render(<Comp />, scratch)

      expect(stateHistory).toEqual([{ a: 1 }, { a: 1 }])
      expect(stateHistory[0]).toEqual(stateHistory[1])
    })

    it('rerenders when setting the state', async () => {
      let lastState
      let doSetState

      const Comp = sinon.spy(() => {
        const [state, setState] = useState(0)
        lastState = state
        doSetState = setState
        return <div />
      })

      render(<Comp />, scratch)
      expect(lastState).toEqual(0)
      expect(Comp.calledOnce).toBeTruthy()

      doSetState(1)
      rerender()
      // await nextTick()
      expect(lastState).toEqual(1)
      expect(Comp.calledTwice).toBeTruthy()

      // Updater function style
      doSetState(current => current * 10)
      rerender()
      // await nextTick()
      expect(lastState).toEqual(10)
      expect(Comp.calledThrice).toBeTruthy()
    })

    it('can be set by another component', async () => {
      let handleClick
      function StateContainer () {
        const [count, setCount] = useState(0)
        handleClick = () => {
          setCount(c => c + 10)
        }
        return (
          <div>
            <p>Count: {count}</p>
            <Increment increment={handleClick} />
          </div>
        )
      }

      function Increment (props) {
        return <button onClick={props.increment}>Increment</button>
      }

      render(<StateContainer />, scratch)
      expect(scratch.textContent).toMatch('Count: 0')

      handleClick()

      rerender()
      // await nextTick()
      expect(scratch.textContent).toMatch('Count: 10')
    })

    it('can initialize the state via a function', () => {
      const initState = sinon.spy(() => {
        1
      })

      function Comp () {
        useState(initState)
        return <div />
      }

      render(<Comp />, scratch)
      // render(<Comp />, scratch)

      expect(initState.calledOnce).toBeTruthy()
    })

    it('works inside a function component with useState', () => {
      function App (props) {
        const [value] = useState(props.value)

        return <span key={value}>{value}</span>
      }

      render(<App value={2} />, scratch)
      expect(scratch.childNodes[0].childNodes[0].data).toEqual('2')
    })

    it('lazy state initializer', async () => {
      let stateUpdater = null
      function Counter (props) {
        const [count, updateCount] = useState(() => {
          return props.initialState + 1
        })
        stateUpdater = updateCount
        return <span>{count}</span>
      }

      render(<Counter initialState={1} />, scratch)
      expect(scratch.childNodes[0].childNodes[0].data).toEqual('2')

      stateUpdater(10)
      rerender()
      // await nextTick()
      expect(scratch.childNodes[0].childNodes[0].data).toEqual('10')
    })

    it('returns the same updater function every time', async () => {
      const updaters = []
      function Counter () {
        const [count, updateCount] = useState(0)
        updaters.push(updateCount)
        return <span>{count}</span>
      }
      render(<Counter />, scratch)

      expect(scratch.childNodes[0].childNodes[0].data).toEqual('0')

      updaters[0](1)

      // await nextTick()
      rerender()

      expect(scratch.childNodes[0].childNodes[0].data).toEqual('1')

      updaters[0](count => count + 10)
      rerender()
      // await nextTick()

      expect(scratch.childNodes[0].childNodes[0].data).toEqual('11')

      expect(updaters).toEqual([updaters[0], updaters[0], updaters[0]])
    })

    it('updates multiple times within same render function', async () => {
      const logs = []
      function Counter ({ row: newRow }) {
        const [count, setCount] = useState(0)
        if (count < 12) {
          setCount(c => c + 1)
          setCount(c => c + 1)
          setCount(c => c + 1)
        }
        logs.push('Render: ' + count)
        return <span>{count}</span>
      }

      render(<Counter />, scratch)
      await delay(50)
      expect(logs).toEqual([
        // Should increase by three each time
        'Render: 0',
        'Render: 3',
        'Render: 6',
        'Render: 9',
        'Render: 12'
      ])

      expect(scratch.childNodes[0].childNodes[0].data).toEqual('12')
    })
  })

  describe('useEffect', () => {
    it('emit effect after render', async () => {
      let counter = 0

      function Comp () {
        useEffect(() => {
          counter += 1
        })
        return <div />
      }

      render(<Comp />, scratch)

      await nextTick()
      await delay(5)

      expect(counter).toBe(1)
    })

    it('performs the effect only if one of the inputs changed', async () => {
      const callback = sinon.spy()

      function Comp (props) {
        useEffect(callback, [props.a, props.b])
        return null
      }

      render(<Comp a={1} b={2} />, scratch)

      await nextTick()
      await delay(5)

      expect(callback.calledOnce).toBeTruthy()

      render(<Comp a={2} b={2} />, scratch)

      await nextTick()
      await delay(5)
      expect(callback.calledTwice).toBeTruthy()

      render(<Comp a={2} b={2} />, scratch)

      await nextTick()
      await delay(5)

      expect(callback.calledTwice).toBeTruthy()

      // return scheduleEffectAssert(() => expect(callback).to.be.calledOnce)
      //   .then(() => render(<Comp a={1} b={2} />, scratch))
      //   .then(() => scheduleEffectAssert(() => expect(callback).to.be.calledOnce))
      //   .then(() => render(<Comp a={2} b={2} />, scratch))
      //   .then(() => scheduleEffectAssert(() => expect(callback).to.be.calledTwice))
      //   .then(() => render(<Comp a={2} b={2} />, scratch))
      //   .then(() => scheduleEffectAssert(() => expect(callback).to.be.calledTwice))
    })

    it('performs the effect at mount time and never again if an empty input Array is passed', async () => {
      const callback = sinon.spy()

      function Comp () {
        useEffect(callback, [])
        return null
      }

      render(<Comp />, scratch)
      render(<Comp />, scratch)

      expect(callback.calledOnce).toBeTruthy()

      await nextTick()
      await delay(5)

      expect(callback.calledOnce).toBeTruthy()

      render(<Comp />, scratch)

      await nextTick()

      await nextTick()
      await delay(5)
      expect(callback.calledOnce).toBeTruthy()
    })
    it('cleanups the effect when the component get unmounted if the effect was called before', async () => {
      const cleanupFunction = sinon.spy()
      const callback = sinon.spy(() => cleanupFunction)

      function Comp () {
        useEffect(callback)
        return null
      }

      render(<Comp />, scratch)
      await nextTick()
      await delay(5)
      render(null, scratch)
      rerender()
      expect(cleanupFunction.calledOnce).toBeTruthy()
    })

    it('works with closure effect callbacks capturing props', async () => {
      const values = []

      function Comp (props) {
        useEffect(() => values.push(props.value))
        return <div />
      }

      render(<Comp value={1} />, scratch)
      render(<Comp value={2} />, scratch)

      await nextTick()
      await delay(5)
      await nextTick()
      await delay(5)

      expect(values).toEqual([1, 2])
    })
  })

  describe('useReducer', () => {
    it('works with useReducer', async () => {
      const logs = []
      function reducer (state, action) {
        return action === 'increment' ? state + 1 : state
      }
      function Counter ({ row: newRow }) {
        const [count, dispatch] = useReducer(reducer, 0)
        if (count < 3) {
          dispatch('increment')
        }
        logs.push('Render: ' + count)
        return <span>{count}</span>
      }

      render(<Counter />, scratch)
      await delay(5)
      expect(logs).toEqual(['Render: 0', 'Render: 1', 'Render: 2', 'Render: 3'])
      expect(scratch.childNodes[0].childNodes[0].data).toEqual('3')
    })
  })

  describe('useLayoutEffect', () => {
    it('mount and update a function component with useLayoutEffect', () => {
      let renderCounter = 0
      let effectCounter = 0
      let cleanupCounter = 0

      function Counter (props) {
        useLayoutEffect(() => {
          ++effectCounter
          return () => {
            ++cleanupCounter
          }
        })
        ++renderCounter
        return <span>{props.count}</span>
      }

      render(<Counter count={0} />, scratch)
      expect(effectCounter).toEqual(1)
      expect(renderCounter).toEqual(1)
      expect(cleanupCounter).toEqual(0)

      render(<Counter count={1} />, scratch)
      expect(renderCounter).toEqual(2)
      expect(effectCounter).toEqual(2)
      expect(cleanupCounter).toEqual(1)

      render(<Counter count={2} />, scratch)
      expect(renderCounter).toEqual(3)
      expect(effectCounter).toEqual(3)
      expect(cleanupCounter).toEqual(2)
    })

    it('only update if the inputs has changed with useLayoutEffect', async () => {
      let renderCounter = 0
      let effectCounter = 0
      let cleanupCounter = 0

      function Counter (props) {
        const [text, udpateText] = useState('foo')
        useLayoutEffect(() => {
          ++effectCounter
          udpateText('bar')
          return () => {
            ++cleanupCounter
          }
        }, [props.count])
        ++renderCounter
        return <span>{text}</span>
      }

      render(<Counter count={0} />, scratch)
      await delay(5)
      expect(effectCounter).toEqual(1)
      expect(renderCounter).toEqual(2)
      expect(cleanupCounter).toEqual(0)

      render(<Counter count={0} />, scratch)
      await delay(5)

      expect(effectCounter).toEqual(1)
      expect(renderCounter).toEqual(3)
      expect(cleanupCounter).toEqual(0)

      render(<Counter count={1} />, scratch)

      await delay(5)

      expect(effectCounter).toEqual(2)
      // expect(renderCounter).toEqual(4)
      expect(cleanupCounter).toEqual(1)
    })

    it('update when the inputs has changed with useLayoutEffect', async () => {
      // let renderCounter = 0
      let effectCounter = 0
      let cleanupCounter = 0

      function Counter (props) {
        const [count, updateCount] = useState(0)
        useLayoutEffect(() => {
          ++effectCounter
          updateCount(1)
          return () => {
            ++cleanupCounter
          }
        }, [count])
        // ++renderCounter
        return <span>{count}</span>
      }

      render(<Counter />, scratch)
      await delay(5)
      expect(effectCounter).toEqual(2)
      // expect(renderCounter).toEqual(2)
      expect(cleanupCounter).toEqual(1)
    })

    it('would run only on mount and clean up on unmount with useLayoutEffect', async () => {
      let renderCounter = 0
      let effectCounter = 0
      let cleanupCounter = 0

      function Counter () {
        const [count, updateCount] = useState(0)
        useLayoutEffect(() => {
          ++effectCounter
          updateCount(count + 1)
          return () => {
            ++cleanupCounter
          }
        }, [])
        ++renderCounter
        return <span>{count}</span>
      }

      render(<Counter />, scratch)
      expect(effectCounter).toEqual(1)
      await delay(5)
      expect(renderCounter).toEqual(2)
      expect(cleanupCounter).toEqual(0)
    })
  })

  describe('useMemo', () => {
    it('only recomputes the result when inputs change', () => {
      const memoFunction = sinon.spy((a, b) => a + b)
      const results = []

      function Comp ({ a, b }) {
        const result = useMemo(() => memoFunction(a, b), [a, b])
        results.push(result)
        return null
      }

      render(<Comp a={1} b={1} />, scratch)
      render(<Comp a={1} b={1} />, scratch)

      expect(results).toEqual([2, 2])
      expect(memoFunction.calledOnce).toBeTruthy()

      render(<Comp a={1} b={2} />, scratch)
      render(<Comp a={1} b={2} />, scratch)

      expect(results).toEqual([2, 2, 3, 3])
      expect(memoFunction).toBeTruthy()
    })
  })

  describe('useCallback', () => {
    it('only recomputes the callback when inputs change', () => {
      const callbacks = []

      function Comp ({ a, b }) {
        const cb = useCallback(() => a + b, [a, b])
        callbacks.push(cb)
        return null
      }

      render(<Comp a={1} b={1} />, scratch)
      render(<Comp a={1} b={1} />, scratch)

      expect(callbacks[0]).toEqual(callbacks[1])
      expect(callbacks[0]()).toEqual(2)

      render(<Comp a={1} b={2} />, scratch)
      render(<Comp a={1} b={2} />, scratch)

      expect(callbacks[1]).not.toEqual(callbacks[2])
      expect(callbacks[2]).toEqual(callbacks[3])
      expect(callbacks[2]()).toEqual(3)
    })
  })

  describe('useRef', () => {
    it('provides a stable reference', () => {
      const values = []
      function Comp () {
        const ref = useRef(1)
        values.push(ref.current)
        ref.current = 2
        return null
      }
      render(<Comp />, scratch)
      render(<Comp />, scratch)
      expect(values).toEqual([1, 2])
    })
  })

  describe('combinations', () => {
    it('can mix useState hooks', () => {
      const states = {}
      const setStates = {}

      function Parent () {
        const [state1, setState1] = useState(1)
        const [state2, setState2] = useState(2)

        Object.assign(states, { state1, state2 })
        Object.assign(setStates, { setState1, setState2 })

        return <Child />
      }

      function Child () {
        const [state3, setState3] = useState(3)
        const [state4, setState4] = useState(4)

        Object.assign(states, { state3, state4 })
        Object.assign(setStates, { setState3, setState4 })

        return null
      }

      render(<Parent />, scratch)
      expect(states).toEqual({ state1: 1, state2: 2, state3: 3, state4: 4 })

      setStates.setState2(n => n * 10)
      setStates.setState3(n => n * 10)
      rerender()
      expect(states).toEqual({ state1: 1, state2: 20, state3: 30, state4: 4 })
    })

    it('can rerender synchronously from within a layout effect', () => {
      const didRender = sinon.spy()

      function Comp () {
        const [counter, setCounter] = useState(0)

        useLayoutEffect(() => {
          if (counter === 0) setCounter(1)
        })

        didRender(counter)
        return null
      }

      render(<Comp />, scratch)
      rerender()

      expect(didRender.calledTwice).toBeTruthy()
      expect(didRender.calledWith(1)).toBeTruthy()

      // expect(didRender).to.have.been.calledTwice.and.calledWith(1)
    })

    it('can access refs from within a layout effect callback', () => {
      let refAtLayoutTime

      function Comp () {
        const input = useRef()

        useLayoutEffect(() => {
          refAtLayoutTime = input.current
        })

        return <input ref={input} value='hello' />
      }

      render(<Comp />, scratch)

      expect(refAtLayoutTime.value).toEqual('hello')
    })

    it('can use multiple useState and useReducer hooks', () => {
      let states = []
      let dispatchState4

      function reducer1 (state, action) {
        switch (action.type) {
          case 'increment':
            return state + action.count
        }
      }

      function reducer2 (state, action) {
        switch (action.type) {
          case 'increment':
            return state + action.count * 2
        }
      }

      function Comp () {
        const [state1] = useState(0)
        const [state2] = useReducer(reducer1, 10)
        const [state3] = useState(1)
        const [state4, dispatch] = useReducer(reducer2, 20)

        dispatchState4 = dispatch
        states.push(state1, state2, state3, state4)

        return null
      }

      render(<Comp />, scratch)

      expect(states).toEqual([0, 10, 1, 20])

      states = []

      dispatchState4({ type: 'increment', count: 10 })
      rerender()

      expect(states).toEqual([0, 10, 1, 40])
    })

    it.skipKarma('ensures useEffect always schedule after the next paint following a redraw effect, when using the default debounce strategy', async () => {
      let effectCount = 0

      function Comp () {
        const [counter, setCounter] = useState(0)
        useEffect(() => {
          if (counter === 0) setCounter(1)
          effectCount++
        })

        return null
      }

      render(<Comp />, scratch)
      expect(effectCount).toEqual(0)
      await nextTick()
      await delay(5)

      expect(effectCount).toEqual(2)
    })

    it('can rerender asynchronously from within an effect', async () => {
      const didRender = sinon.spy()

      function Comp () {
        const [counter, setCounter] = useState(0)

        useEffect(() => {
          if (counter === 0) setCounter(1)
        })

        didRender(counter)
        return null
      }

      render(<Comp />, scratch)

      await nextTick()
      await delay(5)
      rerender()
      expect(didRender.calledTwice).toBeTruthy()
      expect(didRender.calledWith(1)).toBeTruthy()
    })
  })

  describe('useContext', () => {
    it('gets values from context', () => {
      const values = []
      const Context = createContext(13)

      function Comp () {
        const value = useContext(Context)
        values.push(value)
        return null
      }

      render(<Comp />, scratch)
      render(
        <Context.Provider value={42}>
          <Comp />
        </Context.Provider>,
        scratch
      )
      render(
        <Context.Provider value={69}>
          <Comp />
        </Context.Provider>,
        scratch
      )

      expect(values).toEqual([13, 42, 69])
    })

    it('should use default value', () => {
      const Foo = createContext(42)
      const spy = sinon.spy()

      function App () {
        spy(useContext(Foo))
        return <div />
      }

      render(<App />, scratch)
      expect(spy.calledWith(42)).toBeTruthy()
    })

    it('should update when value changes with nonUpdating Component on top', async () => {
      const spy = sinon.spy()
      const Ctx = createContext(0)

      class NoUpdate extends Component {
        shouldComponentUpdate () {
          return false
        }
        render () {
          return this.props.children
        }
      }

      function App (props) {
        return (
          <Ctx.Provider value={props.value}>
            <NoUpdate>
              <Comp />
            </NoUpdate>
          </Ctx.Provider>
        )
      }

      function Comp () {
        const value = useContext(Ctx)
        spy(value)
        return <h1>{value}</h1>
      }

      render(<App value={0} />, scratch)
      expect(spy.calledOnce).toBeTruthy()
      expect(spy.calledWith(0)).toBeTruthy()
      // expect(spy).to.be.calledOnce
      // expect(spy).to.be.calledWith(0)
      render(<App value={1} />, scratch)
      await delay(5)
      // Should not be called a third time
      expect(spy.calledTwice).toBeTruthy()
      expect(spy.calledWith(1)).toBeTruthy()
    })

    it('should only update when value has changed', done => {
      const spy = sinon.spy()
      const Ctx = createContext(0)

      function App (props) {
        return (
          <Ctx.Provider value={props.value}>
            <Comp />
          </Ctx.Provider>
        )
      }

      function Comp () {
        const value = useContext(Ctx)
        spy(value)
        return <h1>{value}</h1>
      }

      render(<App value={0} />, scratch)
      expect(spy.calledOnce).toBeTruthy()
      expect(spy.calledWith(0)).toBeTruthy()
      // expect(spy).to.be.calledOnce
      // expect(spy).to.be.calledWith(0)
      render(<App value={1} />, scratch)
      expect(spy.calledTwice).toBeTruthy()
      expect(spy.calledWith(1)).toBeTruthy()
      // expect(spy).to.be.calledTwice
      // expect(spy).to.be.calledWith(1)

      // Wait for enqueued hook update
      setTimeout(() => {
        // Should not be called a third time
        expect(spy.calledTwice).toBeTruthy()
        done()
      }, 0)
    })

    it('should allow multiple context hooks at the same time', () => {
      const Foo = createContext(0)
      const Bar = createContext(10)
      const spy = sinon.spy()
      const unmountspy = sinon.spy()

      function Comp () {
        const foo = useContext(Foo)
        const bar = useContext(Bar)
        spy(foo, bar)
        useEffect(() => () => unmountspy())

        return <div />
      }

      render(
        <Foo.Provider value={0}>
          <Bar.Provider value={10}>
            <Comp />
          </Bar.Provider>
        </Foo.Provider>,
        scratch
      )

      // expect(spy).to.be.calledOnce
      // expect(spy).to.be.calledWith(0, 10)
      expect(spy.calledOnce).toBeTruthy()
      expect(spy.calledWith(0, 10)).toBeTruthy()

      render(
        <Foo.Provider value={11}>
          <Bar.Provider value={42}>
            <Comp />
          </Bar.Provider>
        </Foo.Provider>,
        scratch
      )

      expect(spy.calledTwice).toBeTruthy()
      expect(unmountspy.called).toBeFalsy()

      // expect(spy).to.be.calledTwice
      // expect(unmountspy).not.to.be.called
    })
  })
})
