import test from 'ava'
import h from '#/h'
import diff from '#/diff'
import VPatch from '#/vpatch'

test('test diff two virtual dom tree simply', t => {
  const tree1 = h('div', {id: 'test', key: '0', style: { width : '100px' }}, [
    h('p', { key: '1', className: 'test_p' }, '1'),
    h('p', { key: '2', className: 'test_p' }, '2')
  ])
  const tree2 = h('div', {id: 'test', key: '0', style: { width : '10px', height: '200px' }, attributes: { prop: 'cc' }}, [
    h('p', { key: '1', className: 'test_p' }, '1'),
    h('p', { key: '3', className: 'test_p' }, '3'),
    h('p', { key: '2', className: 'test_p' }, '2'),
    h('p', { key: '4', className: 'test_p' }, '4')
  ])
  const diffSet = diff(tree1, tree2)
  const diffResult = diffSet['0']
  const class2type = {}
  t.is(class2type.toString.call(diffResult), '[object Array]')
  diffResult.forEach(item => {
    if (item.type === VPatch.PROPS) {
      t.is(item.patch.style.width, '10px')
      t.is(item.patch.style.height, '200px')
      t.is(item.patch.attributes.prop, 'cc')
    } else if (item.type === VPatch.ORDER) {
      t.is(item.patch.length, 2)
      item.patch.forEach(pi => {
        if (pi.index === 1) {
          t.is(pi.type, 'insert')
        } else if (pi.index === 3) {
          t.is(pi.type, 'insert')
        } else {
          t.fail()
        }
      })
    } else {
      t.fail()
    }
  })
})