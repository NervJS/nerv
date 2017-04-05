import test from 'ava';
import h from '#/h';
import diff from '#/diff';

test('test diff two virtual dom tree simply', t => {
	const tree1 = h('div', {id: 'test', key: '0', style: { width : '100px' }}, [
    h('p.test_p', { key: '1' }, '1'),
    h('p.test_p', { key: '2' }, '2')
  ]);
  const tree2 = h('div', {id: 'test', key: '0', style: { width : '10px', height: '200px' }, attributes: { prop: 'cc' }}, [
    h('p.test_p', { key: '1' }, '1'),
    h('p.test_p', { key: '3' }, '3'),
    h('p.test_p', { key: '2' }, '2'),
    h('p.test_p', { key: '4' }, '4')
  ]);
  const patches = diff(tree1, tree2);

});