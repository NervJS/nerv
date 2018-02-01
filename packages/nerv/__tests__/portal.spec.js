/** @jsx createElement */
import {
  Component,
  createElement,
  render,
  createPortal,
  findDOMNode
} from '../src'
import { normalizeHTML } from './util'

function ownerDocument (node) {
  return (node && node.ownerDocument) || document
}

function getContainer (container, defaultContainer) {
  container = typeof container === 'function' ? container() : container
  return findDOMNode(container) || defaultContainer
}

function getOwnerDocument (element) {
  return ownerDocument(findDOMNode(element))
}

describe('createPortal', () => {
  class Portal extends Component {
    componentDidMount () {
      this.setContainer(this.props.container)
      this.forceUpdate(this.props.onRendered)
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.container !== this.props.container) {
        this.setContainer(nextProps.container)
      }
    }

    componentWillUnmount () {
      this.mountNode = null
    }

    setContainer (container) {
      this.mountNode = getContainer(container, getOwnerDocument(this).body)
    }

    /**
     * @public
     */
    getMountNode = () => {
      return this.mountNode
    }

    render () {
      const { children } = this.props

      return this.mountNode ? createPortal(children, this.mountNode) : null
    }
  }
  it('should create and remove portal', () => {
    let app
    class App extends Component {
      state = {
        show: false
      }

      constructor () {
        super(...arguments)
        app = this
      }

      handleClick = () => {
        this.setState({ show: !this.state.show })
      }

      container = null
      static = null

      render () {
        const { show } = this.state
        return (
          <div>
            <button onClick={this.handleClick}>
              {show ? 'Unmount children' : 'Mount children'}
            </button>
            <div ref={node => (this.static = node)}>
              <p>It looks like I will render here.</p>
              {show ? (
                <Portal container={this.container}>
                  <p>But I actually render here!</p>
                </Portal>
              ) : null}
            </div>
            <div
              ref={node => {
                this.container = node
              }}
            />
          </div>
        )
      }
    }
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<App />, div)
    expect(app.static.innerHTML).toBe(
      normalizeHTML('<p>It looks like I will render here.</p>')
    )
    expect(app.container.innerHTML).toBe('')
    app.handleClick()
    app.forceUpdate()
    expect(app.static.innerHTML).toBe(
      normalizeHTML('<p>It looks like I will render here.</p>')
    )
    expect(app.container.innerHTML).toBe(
      normalizeHTML('<p>But I actually render here!</p>')
    )
    app.handleClick()
    app.forceUpdate()
    expect(app.static.innerHTML).toBe(
      normalizeHTML('<p>It looks like I will render here.</p>')
    )
    expect(app.container.innerHTML).toBe('')
  })
})
