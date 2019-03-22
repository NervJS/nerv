/** @jsx createElement */
import { createElement, useEffect, useState, useReducer, useLayoutEffect, render, nextTick } from '../src'
import { delay } from './util'
import sinon from 'sinon'

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
      await nextTick()
      expect(lastState).toEqual(1)
      expect(Comp.calledTwice).toBeTruthy()

      // Updater function style
      doSetState(current => current * 10)
      await nextTick()
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
        return (<div>
          <p>Count: {count}</p>
          <Increment increment={handleClick} />
        </div>)
      }

      function Increment (props) {
        return <button onClick={props.increment}>Increment</button>
      }

      render(<StateContainer />, scratch)
      expect(scratch.textContent).toMatch('Count: 0')

      handleClick()

      // rerender()
      await nextTick()
      expect(scratch.textContent).toMatch('Count: 10')
    })

    it('can initialize the state via a function', () => {
      const initState = sinon.spy(() => { 1 })

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

        return (
          <span key={value}>{value}</span>
        )
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
      await nextTick()
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

      await nextTick()

      expect(scratch.childNodes[0].childNodes[0].data).toEqual('1')

      updaters[0](count => count + 10)

      await nextTick()

      expect(scratch.childNodes[0].childNodes[0].data).toEqual('11')

      expect(updaters).toEqual([updaters[0], updaters[0], updaters[0]])
    })

    it('updates multiple times within same render function', async () => {
      const logs = []
      function Counter ({row: newRow}) {
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

  describe.skip('useEffect', () => {
    it('emit effect after render', async () => {
      let counter = 0

      function Comp () {
        useEffect(() => {
          counter += 1
        })
        return <div />
      }

      render(<Comp />, scratch)

      await delay(5)

      expect(counter).toBe(1)
    })

    it('emit effect after update', async () => {
      let counter = 0

      function Comp () {
        useEffect(() => {
          counter += 1
        })
        return counter ? <div /> : null
      }

      render(<Comp />, scratch)

      await delay(10)

      expect(counter).toBe(2)
    })

    it('emit clean up after unmount component', async () => {
      let counter = 0

      function Comp () {
        useEffect(() => {
          counter += 1
        })
        return <div />
      }

      render(<Comp />, scratch)

      await delay(5)
      await nextTick()
      expect(counter).toBe(1)
    })
  })

  describe('useReducer', () => {
    it('works with useReducer', async () => {
      const logs = []
      function reducer (state, action) {
        return action === 'increment' ? state + 1 : state
      }
      function Counter ({row: newRow}) {
        const [count, dispatch] = useReducer(reducer, 0)
        if (count < 3) {
          dispatch('increment')
        }
        logs.push('Render: ' + count)
        return <span>{count}</span>
      }

      render(<Counter />, scratch)
      await delay(5)
      expect(logs).toEqual([
        'Render: 0',
        'Render: 1',
        'Render: 2',
        'Render: 3'
      ])
      expect(scratch.childNodes[0].childNodes[0].data).toEqual('3')
    })
  })

  describe('useLayoutEffect', () => {
    it('mount and update a function component with useLayoutEffect', () => {
      let renderCounter = 0
      let effectCounter = 0
      let cleanupCounter = 0

      function Counter (props) {
        useLayoutEffect(
          () => {
            ++effectCounter
            return () => {
              ++cleanupCounter
            }
          }
        )
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
        useLayoutEffect(
          () => {
            ++effectCounter
            udpateText('bar')
            return () => {
              ++cleanupCounter
            }
          },
          [props.count]
        )
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
        useLayoutEffect(
          () => {
            ++effectCounter
            updateCount(1)
            return () => {
              ++cleanupCounter
            }
          },
          [count]
        )
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
        useLayoutEffect(
          () => {
            ++effectCounter
            updateCount(count + 1)
            return () => {
              ++cleanupCounter
            }
          },
          []
        )
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
})
