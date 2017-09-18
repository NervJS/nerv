/** @jsx createElement */
import { Component, createElement, cloneElement, render } from '../../src'

describe('cloneElement()', () => {
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

  it('can clone a vnode with props', () => {
    const vnode = (
      <div className='hh' style={{ width: '800px' }} />
    )
    const cloneVNode = cloneElement(vnode)
    expect(cloneVNode).to.have.property('tagName', 'div')
    expect(cloneVNode).to.have.property('props').that.have.nested.deep.property('style', { width: '800px' })
    expect(cloneVNode).to.have.property('props').that.have.property('className', 'hh')
    expect(cloneVNode).to.have.property('children').that.have.length(0)
  })

  it('can clone node with children', () => {
    const vnode = (
      <div>
        <div>1</div>
        <span>2</span>
        <a href='#'>ssd</a>
      </div>
    )
    const cloneVNode = cloneElement(vnode)
    render(cloneVNode, scratch)
    expect(scratch.innerHTML).to.equals('<div><div>1</div><span>2</span><a href="#">ssd</a></div>')
  })
  it('can clone node with children contains Components', () => {
    class C extends Component {
      render () {
        return <div className='ttt' />
      }
    }

    const vnode = (
      <div>
        <div className='cc'>1</div>
        <C className='ttt' />
        <span className='ppp'>sd</span>
      </div>
    )
    const cloneVNode = cloneElement(vnode)
    render(cloneVNode, scratch)
    expect(scratch.innerHTML).to.equals('<div><div class="cc">1</div><div class="ttt"></div><span class="ppp">sd</span></div>')
  })

  it('can clone node by new props', () => {
    const vnode = (
      <div>
        <div className='cc'>1</div>
        <span className='ppp'>sd</span>
      </div>
    )
    const cloneVNode = cloneElement(vnode, {
      style: {
        width: '800px'
      },
      className: 'hh'
    })
    render(cloneVNode, scratch)
    expect(scratch.firstChild).to.have.property('className', 'hh')
    expect(scratch.firstChild.style).to.have.property('width', '800px')
  })

  it('can clone node by new children', () => {
    const vnode = (
      <div>
        <div className='cc'>1</div>
        <span className='ppp'>sd</span>
      </div>
    )
    const cloneVNode = cloneElement(vnode, null, <span>1</span>)
    render(cloneVNode, scratch)
    expect(scratch.innerHTML).to.equals('<div><span>1</span></div>')
  })
})
