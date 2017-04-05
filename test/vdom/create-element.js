import test from 'ava';
import h from '#/h';
import createElement from '#/create-element';

global.document = require('global/document');

test('test create real dom tree from virtual dom tree', t => {
  const tree = h('div', {id: 'test', key: '0', style: { width : '10px', height: '200px' }, attributes: { prop: 'cc' }}, [
    h('p.test_p', { key: '1' }, '1'),
    h('p.test_p', { key: '3' }, '3'),
    h('p.test_p', { key: '2' }, '2'),
    h('p.test_p', { key: '4' }, '4')
  ]);
  const dom = createElement(tree);
  t.is(dom.tagName, 'DIV');
  t.is(dom.childNodes.length, 4);
  t.is(dom.style.width, '10px');
});