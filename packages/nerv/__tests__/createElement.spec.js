import h from '../src/vdom/h'
import createElement from '../src/vdom/create-element'

describe('test create real dom tree from virtual dom tree', () => {
  it('test dom node', () => {
    const tree = h(
      'div',
      {
        id: 'test',
        key: '0',
        style: { width: '10px', height: '200px' },
        attributes: { prop: 'cc' }
      },
      [
        h('p', { key: '1', className: 'test_p' }, '1'),
        h('p', { key: '3', className: 'test_p' }, '3'),
        h('p', { key: '2', className: 'test_p' }, '2'),
        h('p', { key: '4', className: 'test_p' }, '4')
      ]
    )
    const dom = createElement(tree)
    expect(dom.tagName).toBe('DIV')
    expect(dom.childNodes.length).toBe(4)
    expect(dom.style.width).toBe('10px')
  })

  it('should throw error when a type can not be created', () => {
    expect(() => {
      createElement({})
    }).toThrowError('Unsupported VNode.')
  })

  it('should create document Fragment', () => {
    const dom = createElement([1, 2, undefined])
    expect(dom.innerHTML).toBe(undefined)
  })
})
