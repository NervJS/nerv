/** @jsx createElement */
import { Component, createElement, cloneElement, render } from '../src'
import createVText from '../src/vdom/create-vtext'
import { normalizeHTML } from './util'

describe('cloneElement()', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  it('can clone vtext', () => {
    const t = cloneElement(createVText('test'))
    expect(t.text).toEqual('test')
  })

  it('can clone string and number', () => {
    const t = cloneElement('test')
    const t1 = cloneElement(12)
    expect(t.text).toEqual('test')
    expect(t1.text).toEqual(12)
  })

  it('can clone svg', () => {
    if (document.documentMode === 8) {
      return
    }
    const t1 = createElement('svg')
    render(t1, scratch)
    const t2 = cloneElement(t1)
    expect(t2.namespace).toBeTruthy()
  })

  it('can clone fragment', () => {
    const f1 = [<div>1</div>, <span>2</span>]
    const f2 = cloneElement(f1)
    expect(f2[0].children.text).toBe('1')
    expect(f2[1].children.text).toBe('2')
  })

  it('can clone a vnode with props', () => {
    const vnode = <div className='hh' style={{ width: '800px' }} />
    const cloneVNode = cloneElement(vnode)
    expect(cloneVNode.type).toEqual('div')
    expect(cloneVNode.hasOwnProperty('props')).toBeTruthy()
    const { style } = cloneVNode.props
    expect(style.width).toBe('800px')
    expect(cloneVNode.props.className).toBe('hh')
    expect(cloneVNode.children.length).toBe(0)
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
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div>1</div><span>2</span><a href="#">ssd</a></div>')
    )
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
    expect(scratch.innerHTML).toEqual(
      normalizeHTML(
        '<div><div class="cc">1</div><div class="ttt"></div><span class="ppp">sd</span></div>'
      )
    )
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
    const dom = scratch.firstChild
    expect(dom.className).toBe('hh')
    expect(dom.style.width).toBe('800px')
    // expect(scratch.firstChild).to.have.property('className', 'hh')
    // expect(scratch.firstChild.style).to.have.property('width', '800px')
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
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><span>1</span></div>')
    )
  })

  it('can preserve empty children', () => {
    const Foo = props => <div>{props.children}</div>
    const Bar = props => <Foo {...props}>{'b'}</Foo>
    const C = cloneElement(<Bar />, {})
    render(C, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>b</div>'))
  })

  it('can clone false/null element', () => {
    const C = cloneElement(false)
    render(C, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(''))
    const C1 = cloneElement(null)
    render(C1, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(''))
  })
})
