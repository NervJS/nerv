/** @jsx createElement */
import { createElement, Component } from '../src/index'
import createVText from '../src/vdom/create-vtext'
import { VType } from 'nerv-shared'

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
    expect(div.vtype).toBe(VType.Node)
  })

  it('vtext type', () => {
    const div = createVText('hhh')
    expect(div.vtype).toBe(VType.Text)
  })

  it('widget type', () => {
    class T extends Component {
      render () {
        return null
      }
    }
    const t = <T />
    expect(t.vtype).toBe(VType.Composite)
  })

  it.skip('stateless type', () => {
    const T = () => <div />
    const t = <T />
    expect(t.vtype).toBe(VType.Stateless)
  })
})
