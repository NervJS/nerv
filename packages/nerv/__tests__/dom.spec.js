/** @jsx createElement */
import {
  Component,
  createElement,
  render,
  unmountComponentAtNode,
  findDOMNode, // eslint-disable-next-line
  unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer
} from '../src'
import { createPortal } from '../src/dom'

describe('dom', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  describe('unstable_renderSubtreeIntoContainer', () => {
    it('should get context through middle non-context-provider layer', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const portal1 = document.createElement('div')
      const portal2 = document.createElement('div')

      class Parent extends Component {
        render () {
          return null
        }
        getChildContext () {
          return { value: this.props.value }
        }
        componentDidMount () {
          renderSubtreeIntoContainer(this, <Middle />, portal1)
        }
      }

      class Middle extends Component {
        render () {
          return null
        }
        componentDidMount () {
          renderSubtreeIntoContainer(this, <Child />, portal2)
        }
      }

      class Child extends Component {
        render () {
          return <div>{this.context.value}</div>
        }
      }

      render(<Parent value='foo' />, container)
      expect(portal2.textContent).toBe('foo')
    })

    it('should get context through non-context-provider parent', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const portal = document.createElement('div')

      class Parent extends Component {
        render () {
          return <Middle />
        }
        getChildContext () {
          return { value: this.props.value }
        }
      }

      class Middle extends Component {
        render () {
          return null
        }
        componentDidMount () {
          renderSubtreeIntoContainer(this, <Child />, portal)
        }
      }

      class Child extends Component {
        render () {
          return <div>{this.context.value}</div>
        }
      }

      render(<Parent value='foo' />, container)
      expect(portal.textContent).toBe('foo')
    })

    it('should render portal with non-context-provider parent', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const portal = document.createElement('div')

      class Parent extends Component {
        render () {
          return null
        }

        componentDidMount () {
          renderSubtreeIntoContainer(this, <div>hello</div>, portal)
        }
      }

      render(<Parent bar='initial' />, container)
      expect(portal.firstChild.innerHTML).toBe('hello')
    })

    it('should update context if it changes due to setState', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const portal = document.createElement('div')

      class Comp extends Component {
        render () {
          return <div>{this.context.foo + '-' + this.context.getFoo()}</div>
        }
      }

      class Parent extends Component {
        state = {
          bar: 'initial'
        }

        getChildContext () {
          return {
            foo: this.state.bar,
            getFoo: () => this.state.bar
          }
        }

        render () {
          return null
        }

        componentDidMount () {
          renderSubtreeIntoContainer(this, <Comp />, portal)
        }

        componentDidUpdate () {
          renderSubtreeIntoContainer(this, <Comp />, portal)
        }
      }

      const instance = render(<Parent />, container)
      expect(portal.firstChild.innerHTML).toBe('initial-initial')
      instance.setState({ bar: 'changed' })
      instance.forceUpdate()
      expect(portal.firstChild.innerHTML).toBe('changed-changed')
    })

    it('should update context if it changes due to re-render', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const portal = document.createElement('div')

      class Comp extends Component {
        render () {
          return <div>{this.context.foo + '-' + this.context.getFoo()}</div>
        }
      }

      class Parent extends Component {
        getChildContext () {
          return {
            foo: this.props.bar,
            getFoo: () => this.props.bar
          }
        }

        render () {
          return null
        }

        componentDidMount () {
          renderSubtreeIntoContainer(this, <Comp />, portal)
        }

        componentDidUpdate () {
          renderSubtreeIntoContainer(this, <Comp />, portal)
        }
      }

      render(<Parent bar='initial' />, container)
      expect(portal.firstChild.innerHTML).toBe('initial-initial')
      render(<Parent bar='changed' />, container)
      expect(portal.firstChild.innerHTML).toBe('changed-changed')
    })
  })

  describe('unmountComponentAtNode', () => {
    it('returns false on non-Nerv containers', () => {
      var d = document.createElement('div')
      d.innerHTML = '<b>hellooo</b>'
      expect(unmountComponentAtNode(d)).toBe(false)
      expect(d.textContent).toBe('hellooo')
    })

    it('returns false on a vnode', () => {
      const d = createElement('div')
      render(d, scratch)
      expect(unmountComponentAtNode(d)).toBe(false)
    })

    it('returns true on node has a component', () => {
      class Comp extends Component {
        render () {
          return <span>test</span>
        }
      }

      render(<Comp />, scratch)
      expect(unmountComponentAtNode(scratch)).toBe(true)
      expect(scratch.textContent).toBe('')
    })

    it('returns true on node has a vnode', () => {
      render(<b>hellooo</b>, scratch)
      expect(scratch.textContent).toBe('hellooo')
      expect(unmountComponentAtNode(scratch)).toBe(true)
      expect(scratch.textContent).toBe('')
    })

    it('returns true on node has a stateless', () => {
      const Comp = () => <span>test</span>
      render(<Comp />, scratch)
      expect(unmountComponentAtNode(scratch)).toBe(true)
      expect(scratch.textContent).toBe('')
    })

    it('should findDomNode works', () => {
      const B = <b>hellooo</b>
      render(B, scratch)
      expect(findDOMNode(B).firstChild.textContent).toBe('hellooo')
      // expect(findDOMNode(B)).toBe(B)
      let app
      class Comp extends Component {
        constructor () {
          super()
          app = this
        }
        render () {
          return <span>test</span>
        }
      }
      const C = <Comp />
      render(C, scratch)
      expect(findDOMNode(app).textContent).toBe('test')
      createPortal(B, scratch)
      // expect(findDOMNode(Comp).firstChild.textContent).toBe('test')
    })
  })
})
