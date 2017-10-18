/** @jsx createElement */
import { createElement, render, unmountComponentAtNode } from '../../src'

describe('unmountComponentAtNode', () => {
  let scratch

  beforeAll(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  afterAll(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('returns false on non-Nerv containers', () => {
    var d = document.createElement('div')
    d.innerHTML = '<b>hellooo</b>'
    expect(unmountComponentAtNode(d)).toBe(false)
    expect(d.textContent).toBe('hellooo')
  })

  // it('returns false on a vnode', () => {
  //   const d = createElement('div')
  //   render(d)
  // })

  // it('returns true on node has a component', () => {
  //   class Comp extends Component {
  //     render () {
  //       return <span>test</span>
  //     }
  //   }

  //   const dom = render(<Comp />, scratch)
  //   console.log(scratch.innerHTML)
  //   expect(unmountComponentAtNode(dom)).toBe(true)
  // })

  it('returns true on node has a stateless', () => {
    const Comp = () => <span>test</span>

    const dom = render(<Comp />, scratch)
    expect(unmountComponentAtNode(dom)).toBe(true)
  })
})
