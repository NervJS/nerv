import test from 'ava'
import h from '#/h'
import createElement from '#/create-element'

global.document = require('global/document')

test('test create real dom tree from virtual dom tree', t => {
  const tree = h('div', {id: 'test', key: '0', style: { width : '10px', height: '200px' }, attributes: { prop: 'cc' }}, [
    h('p', { key: '1', className: 'test_p' }, '1'),
    h('p', { key: '3', className: 'test_p' }, '3'),
    h('p', { key: '2', className: 'test_p' }, '2'),
    h('p', { key: '4', className: 'test_p' }, '4')
  ])
  const dom = createElement(tree)
  t.is(dom.tagName, 'DIV')
  t.is(dom.childNodes.length, 4)
  t.is(dom.style.width, '10px')
})