/** @jsx createElement */
import {
  Component,
  createElement,
  render,
  unmountComponentAtNode,
  findDOMNode
} from '../src'
import { createPortal } from '../src/dom'

describe('dom', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
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
