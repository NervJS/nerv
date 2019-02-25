/** @jsx createElement */
import { Component, createElement, render } from '../src/index.ts'
import createVText from '../src/vdom/create-vtext'
import {createContext} from '../src/vdom/create-context'
import { rerender } from '../src/render-queue'
import sinon from 'sinon'
import { CHILDREN_MATCHER, normalizeHTML } from './util'

describe('context', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  // it('should pass context to grandchildren', () => {
  //   const CONTEXT = { a: 'a' }
  //   const PROPS = { b: 'b' }
  //   let doRender = null

  //   class Outer extends Component {
  //     constructor () {
  //       super(...arguments)
  //       this.state = {}
  //     }
  //     componentDidMount () {
  //       doRender = () => {
  //         this.setState(PROPS)
  //       }
  //     }
  //     getChildContext () {
  //       return CONTEXT
  //     }
  //     render () {
  //       return (
  //         <div>
  //           <Inner {...this.state} />
  //         </div>
  //       )
  //     }
  //   }
  //   const getChildContextSpy = sinon.spy(Outer.prototype, 'getChildContext')

  //   class Inner extends Component {
  //     shouldComponentUpdate () {
  //       return true
  //     }
  //     componentWillReceiveProps () {}
  //     componentWillUpdate () {}
  //     componentDidUpdate () {}
  //     render () {
  //       return <div>{this.context && this.context.a}</div>
  //     }
  //   }
  //   const scu = sinon.spy(Inner.prototype, 'shouldComponentUpdate')
  //   const cwrp = sinon.spy(Inner.prototype, 'componentWillReceiveProps')
  //   const cwu = sinon.spy(Inner.prototype, 'componentWillUpdate')
  //   const cdu = sinon.spy(Inner.prototype, 'componentDidUpdate')

  //   render(<Outer />, scratch)

  //   expect(getChildContextSpy.callCount).toBe(1)

  //   CONTEXT.foo = 'bar'
  //   doRender()
  //   rerender()

  //   expect(getChildContextSpy.callCount).toBe(2)

  //   const props = { children: CHILDREN_MATCHER, ...PROPS }
  //   expect(scu.calledWith(props, {}, CONTEXT)).toBeTruthy()
  //   expect(cwrp.calledWith(props, CONTEXT)).toBeTruthy()
  //   expect(cwu.calledWith(props, {})).toBeTruthy()
  //   expect(cdu.calledWith({ children: CHILDREN_MATCHER }, {})).toBeTruthy()
  // })

  // it('should pass context to direct children', () => {
  //   const CONTEXT = { a: 'a' }
  //   const PROPS = { b: 'b' }

  //   let doRender = null

  //   class Outer extends Component {
  //     constructor () {
  //       super(...arguments)
  //       this.state = {}
  //     }
  //     componentDidMount () {
  //       doRender = () => {
  //         this.setState(PROPS)
  //       }
  //     }
  //     getChildContext () {
  //       return CONTEXT
  //     }
  //     render () {
  //       return <Inner {...this.state} />
  //     }
  //   }
  //   const getChildContextSpy = sinon.spy(Outer.prototype, 'getChildContext')

  //   class Inner extends Component {
  //     shouldComponentUpdate () {
  //       return true
  //     }
  //     componentWillReceiveProps () {}
  //     componentWillUpdate () {}
  //     componentDidUpdate () {}
  //     render () {
  //       return <div>{this.context && this.context.a}</div>
  //     }
  //   }
  //   const scu = sinon.spy(Inner.prototype, 'shouldComponentUpdate')
  //   const cwrp = sinon.spy(Inner.prototype, 'componentWillReceiveProps')
  //   const cwu = sinon.spy(Inner.prototype, 'componentWillUpdate')
  //   const cdu = sinon.spy(Inner.prototype, 'componentDidUpdate')
  //   const innerRender = sinon.spy(Inner.prototype, 'render')

  //   render(<Outer />, scratch)

  //   expect(getChildContextSpy.callCount).toBe(1)

  //   CONTEXT.foo = 'bar'
  //   doRender()
  //   rerender()

  //   expect(getChildContextSpy.callCount).toBe(2)

  //   const props = { children: CHILDREN_MATCHER, ...PROPS }
  //   expect(scu.calledWith(props, {}, CONTEXT)).toBeTruthy()
  //   expect(cwrp.calledWith(props, CONTEXT)).toBeTruthy()
  //   expect(cwu.calledWith(props, {})).toBeTruthy()
  //   expect(cdu.calledWith({ children: CHILDREN_MATCHER }, {})).toBeTruthy()
  //   expect(innerRender.returned(sinon.match({ children: [createVText('a')] })))
  // })

  // it('should preserve existing context properties when creating child contexts', () => {
  //   const outerContext = { outer: 1 }
  //   const innerContext = { inner: 2 }
  //   class Outer extends Component {
  //     getChildContext () {
  //       return { ...outerContext }
  //     }
  //     render () {
  //       return (
  //         <div>
  //           <Inner />
  //         </div>
  //       )
  //     }
  //   }

  //   class Inner extends Component {
  //     getChildContext () {
  //       return { ...innerContext }
  //     }
  //     render () {
  //       return <InnerMost />
  //     }
  //   }

  //   class InnerMost extends Component {
  //     render () {
  //       const { outer, inner } = this.context
  //       return (
  //         <strong>
  //           {outer}
  //           {inner}
  //         </strong>
  //       )
  //     }
  //   }

  //   render(<Outer />, scratch)
  //   expect(scratch.innerHTML).toEqual(
  //     normalizeHTML('<div><strong>12</strong></div>')
  //   )
  // })

  // it('Should child component constructor access context', () => {
  //   const randomNumber = Math.random()
  //   const CONTEXT = { info: randomNumber }
  //   class Outer extends Component {
  //     getChildContext () {
  //       return CONTEXT
  //     }
  //     render () {
  //       const x = 1
  //       return (
  //         <div>
  //           {
  //             x > 0 ? '1111' : '000'
  //           }
  //           <div>test</div>
  //           hehehe
  //           {/* <Inner /> */}
  //         </div>
  //       )
  //     }
  //   }

  //   class Inner extends Component {
  //     constructor (props, context) {
  //       super(props, context)
  //       expect(context.info).toEqual(CONTEXT.info)
  //       this.state = {
  //         s: null
  //       }
  //     }
  //     render () {
  //       return null
  //     }
  //   }

  //   render(<Outer />, scratch)
  // })
  it('Test render props', () => {
    class Test extends Component {
      render () {
        return (
          <div>
            123
          </div>
        )
      }
    }
    class Test2 extends Component {
      render () {
        return (
          <div style={this.props.style}>
            123123
            <Test />
          </div>
        )
      }
    }
    const defaultTheme = {
      backgroundColor: 'yellow',
      color: 'pink'
    }
    const fooTheme = {
      backgroundColor: 'red', 
      color: 'white'
    }
    const testTheme = {
      backgroundColor: 'green',
      color: 'green'
    }
    const secondId = 'iddddd'
    const ThemeContext = createContext(defaultTheme)
    const SecondContext = createContext(secondId)
    console.log('ThemeContext', ThemeContext)
    const Banner = ({theme, id}) => {
      return (<div style={theme} data-id={id}>Welcome!</div>)
    }
    class Content extends Component {
      static contextType = ThemeContext
      render () {
        console.log('contextType', this.context)
        return <ThemeContext.NervConsumer>
          {
            (value) => {
              return <SecondContext.NervConsumer>
                {
                  (id) => {
                    return <Banner theme={value} id={id} />
                  }
                }
              </SecondContext.NervConsumer>
            }
          }
        </ThemeContext.NervConsumer>
      }
    }
    class App extends Component {
      state = {
        theme: defaultTheme,
        second: secondId
      }
      handleClick = () => {
        this.setState({
          theme: this.state.theme === testTheme ? fooTheme : testTheme
        })
      }
      render () {
        return (
        <ThemeContext.NervProvider value={this.state.theme}>
          <SecondContext.NervProvider value={this.state.second}>
           <Content />
          </SecondContext.NervProvider>
          <button onClick={this.handleClick}>Toggle Theme</button>
        </ThemeContext.NervProvider>
        )
        // return <div>
        //   <Content2 theme={this.state.theme} />
        //   <button onClick={this.handleClick}>Toggle Theme</button>
        // </div>
      }
    }
    console.log(<ThemeContext.NervProvider />, '<App />')
    render(<App />, scratch)
  })
})
