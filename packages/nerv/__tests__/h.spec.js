import h from '../src/vdom/h'
import { VType } from 'nerv-shared'

describe('test generate virtual dom tree', () => {
  it('test make virtual dom tree simply', () => {
    const tree = h('div', { id: 'test', key: '0' }, 'test')
    expect(tree.type).toBe('div')
    expect(tree.children.text).toBe('test')
    // expect(tree.children[0].text).toBe('test')
  })

  it('test make virtual dom tree with children', () => {
    const tree = h('ul', { key: '0', id: 'test', className: 'list' }, [
      h(
        'li',
        { key: '1', className: 'list_item' },
        h('span', { key: '2', className: 'list_item_text' }, '1')
      ),
      h(
        'li',
        { key: '3', className: 'list_item' },
        h('span', { key: '4', className: 'list_item_text' }, '2')
      ),
      h(
        'li',
        { key: '5', className: 'list_item' },
        h('span', { key: '6', className: 'list_item_text' }, '3')
      )
    ])
    expect(tree.type).toBe('ul')
    expect(tree.key).toBe('0')
    expect(tree.props.id).toBe('test')
    expect(tree.props.className).toBe('list')
    expect(tree.children.length).toBe(3)
    expect(tree.children[0].key).toBe('1')
    expect(tree.children[0].children.children.vtype).toBe(VType.Text)
  })
})
