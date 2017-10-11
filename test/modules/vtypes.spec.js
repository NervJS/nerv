/** @jsx createElement */
import { createElement, Component } from '../../src/index'
import createVText from '../../src/vdom/create-vtext'

describe('vtypes', () => {
  let scratch

  before(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('vnode type', () => {
    const div = <div />
    expect(div).to.have.property('type').that.to.equal('VirtualNode')
  })

  it('vtext type', () => {
    const div = createVText('hhh')
    expect(div).to.have.property('type').that.to.equal('VirtualText')
  })

  it('widget type', () => {
    class T extends Component {
      render () {
        return null
      }
    }
    const t = <T />
    expect(t).to.have.property('type').that.to.equal('Widget')
  })
})
