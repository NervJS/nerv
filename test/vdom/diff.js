import test from 'ava';
import h from '#/h';
import diff from '#/diff';

test('test diff two virtual dom tree simply', t => {
	const tree1 = h('div', {id: 'test', key: '0', style: { width : '100px' }}, [
    h('p', { key: '1', className: 'test_p' }, '1'),
    h('p', { key: '2', className: 'test_p' }, '2')
  ]);
  const tree2 = h('div', {id: 'test', key: '0', style: { width : '10px', height: '200px' }, attributes: { prop: 'cc' }}, [
    h('p', { key: '1', className: 'test_p' }, '1'),
    h('p', { key: '3', className: 'test_p' }, '3'),
    h('p', { key: '2', className: 'test_p' }, '2'),
    h('p', { key: '4', className: 'test_p' }, '4')
  ]);
  const patches = diff(tree1, tree2);
});