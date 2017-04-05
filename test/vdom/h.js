import test from 'ava';
import h from '#/h';

test('test make virtual dom tree simply', t => {
	const tree = h('div', {id: 'test', key: '0'}, 'test');
  t.is(tree.tagName, 'DIV');
  t.is(tree.children.length, 1);
  t.is(tree.children[0].text, 'test');
});

test('test make virtual dom tree with children', t => {
  const tree = h('ul#test.list', {key: '0'}, [
    h('li.list_item', {key: '1'}, h('span.list_item_text', {key: '2'}, '1')),
    h('li.list_item', {key: '3'}, h('span.list_item_text', {key: '4'}, '2')),
    h('li.list_item', {key: '5'}, h('span.list_item_text', {key: '6'}, '3'))
  ]);
  t.is(tree.tagName, 'UL');
  t.is(tree.key, '0');
  t.is(tree.properties.id, 'test');
  t.is(tree.properties.className, 'list');
  t.is(tree.children.length, 3);
  t.is(tree.children[0].key, '1');
  t.is(tree.children[0].children[0].children[0].type, 'vtext');
});