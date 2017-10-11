import assert from 'power-assert'

import h from '../../src/vdom/h'
import createElement from '../../src/vdom/create-element'

describe('test create real dom tree from virtual dom tree', () => {
  it('test dom node', () => {
    const tree = h('div', {id: 'test', key: '0', style: { width: '10px', height: '200px' }, attributes: { prop: 'cc' }}, [
      h('p', { key: '1', className: 'test_p' }, '1'),
      h('p', { key: '3', className: 'test_p' }, '3'),
      h('p', { key: '2', className: 'test_p' }, '2'),
      h('p', { key: '4', className: 'test_p' }, '4')
    ])
    const dom = createElement(tree)
    assert.equal(dom.tagName, 'DIV')
    assert.equal(dom.childNodes.length, 4)
    assert.equal(dom.style.width, '10px')
  })

  it('should create document Fragment', () => {
    const dom = createElement([1, 2, undefined])
    expect(dom.innerHTML).to.be.equal(undefined)
  })
})
