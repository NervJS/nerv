import test from 'ava';
import h from '#/h';

test('test make virtual dom tree simply', t => {
	const tree = h('div', {id: 'test', key: '0'}, 'test');
  t.is(tree.tagName, 'div');
  t.is(tree.children.length, 1);
  t.is(tree.children[0].text, 'test');
});

test('test make virtual dom tree with children', t => {
  const tree = h('ul', {key: '0', id: 'test', className: 'list'}, [
    h('li', {key: '1', className: 'list_item'}, h('span', {key: '2', className: 'list_item_text'}, '1')),
    h('li', {key: '3', className: 'list_item'}, h('span', {key: '4', className: 'list_item_text'}, '2')),
    h('li', {key: '5', className: 'list_item'}, h('span', {key: '6', className: 'list_item_text'}, '3'))
  ]);
  t.is(tree.tagName, 'ul');
  t.is(tree.key, '0');
  t.is(tree.properties.id, 'test');
  t.is(tree.properties.className, 'list');
  t.is(tree.children.length, 3);
  t.is(tree.children[0].key, '1');
  t.is(tree.children[0].children[0].children[0].type, 'vtext');
});