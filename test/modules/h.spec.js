import assert from 'power-assert'
import h from '../../src/vdom/h'

describe('test generate virtual dom tree', () => {
  it('test make virtual dom tree simply', () => {
    const tree = h('div', {id: 'test', key: '0'}, 'test')
    assert.equal(tree.tagName, 'div')
    assert.equal(tree.children.length, 1)
    assert.equal(tree.children[0].text, 'test')
  })

  it('test make virtual dom tree with children', () => {
    const tree = h('ul', {key: '0', id: 'test', className: 'list'}, [
      h('li', {key: '1', className: 'list_item'}, h('span', {key: '2', className: 'list_item_text'}, '1')),
      h('li', {key: '3', className: 'list_item'}, h('span', {key: '4', className: 'list_item_text'}, '2')),
      h('li', {key: '5', className: 'list_item'}, h('span', {key: '6', className: 'list_item_text'}, '3'))
    ])
    assert.equal(tree.tagName, 'ul')
    assert.equal(tree.key, '0')
    assert.equal(tree.props.id, 'test')
    assert.equal(tree.props.className, 'list')
    assert.equal(tree.children.length, 3)
    assert.equal(tree.children[0].key, '1')
    assert.equal(tree.children[0].children[0].children[0].type, 'VirtualText')
  })
})
