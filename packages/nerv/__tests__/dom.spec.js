/** @jsx createElement */
import {
  Component,
  createElement,
  render,
  unmountComponentAtNode
} from '../src'

describe('dom', () => {
  let scratch

  beforeAll(() => {
    scratch = document.createElement('div')
    scratch.id = 'test'
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  afterAll(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
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
  })
})
