/** @jsx createElement */
import { createElement, Component } from '../src/index'
import createVText from '../src/vdom/create-vtext'

describe('vtypes', () => {
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

  it('vnode type', () => {
    const div = <div />
    expect(div.type).toBe('VirtualNode')
  })

  it('vtext type', () => {
    const div = createVText('hhh')
    expect(div.type).toBe('VirtualText')
  })

  it('widget type', () => {
    class T extends Component {
      render () {
        return null
      }
    }
    const t = <T />
    expect(t.type).toBe('Widget')
  })

  it('stateless type', () => {
    const T = () => <div />
    const t = <T />
    expect(t.type).toBe('Widget')
  })
})
