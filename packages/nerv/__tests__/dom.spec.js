/** @jsx createElement */
import {
  Component,
  createElement,
  render,
  unmountComponentAtNode,
  findDOMNode, // eslint-disable-next-line
  unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer,
  hydrate
} from '../src'
import { normalizeHTML } from './util'

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

      let m1, m2

      class Middle extends Component {
        render () {
          return null
        }
        componentDidMount () {
          m1 = this
          renderSubtreeIntoContainer(this, <Child />, portal2, function () {
            m2 = this
          })
        }
      }

      class Child extends Component {
        render () {
          return <div>{this.context.value}</div>
        }
      }

      render(<Parent value='foo' />, container)
      expect(portal2.textContent).toBe('foo')
      expect(m1).not.toEqual(m2)
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

  describe('hydrate', () => {
    it('should do nothing when container is not a dom element', () => {
      const t = hydrate('', null)
      expect(t).toBeFalsy()
    })

    it('should clean all dom element in container', () => {
      const dom = `<div><div>1</div><span>2</span><a href="#">ssd</a></div>`
      const div = document.createElement('div')
      div.innerHTML = dom
      const vnode = (
        <div>
          <div>1</div>
          <span>2</span>
          <a href='#'>ssd</a>
        </div>
      )
      hydrate(vnode, div)
      expect(div.innerHTML).toBe(normalizeHTML(dom))
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

    describe('findDOMNode', () => {
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
        // expect(findDOMNode(Comp).firstChild.textContent).toBe('test')
      })

      it('should return null while input is invalid', () => {
        expect(findDOMNode(false)).toBe(null)
        expect(findDOMNode(undefined)).toBe(null)
        expect(findDOMNode(null)).toBe(null)
        expect(findDOMNode(true)).toBe(null)
      })
    })
  })
})
