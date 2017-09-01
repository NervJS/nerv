import { assert } from 'chai'

import h from '../../src/lib/vdom/h'
import diff from '../../src/lib/vdom/diff'
import VPatch from '../../src/lib/vdom/vpatch'

describe('test dom diff algorithm', () => {
  it('test diff two virtual dom tree simply', () => {
    const tree1 = h('div', {id: 'test', key: '0', style: { width: '100px' }}, [
      h('p', { key: '1', className: 'test_p' }, '1'),
      h('p', { key: '2', className: 'test_p' }, '2')
    ])
    const tree2 = h('div', {id: 'test', key: '0', style: { width: '10px', height: '200px' }, attributes: { prop: 'cc' }}, [
      h('p', { key: '1', className: 'test_p' }, '1'),
      h('p', { key: '3', className: 'test_p' }, '3'),
      h('p', { key: '2', className: 'test_p' }, '2'),
      h('p', { key: '4', className: 'test_p' }, '4')
    ])
    const diffSet = diff(tree1, tree2)
    const diffResult = diffSet['0']
    assert.isArray(diffResult)
    diffResult.forEach(item => {
      if (item.type === VPatch.PROPS) {
        assert.equal(item.patch.style.width, '10px')
        assert.equal(item.patch.style.height, '200px')
        assert.equal(item.patch.attributes.prop, 'cc')
      } else if (item.type === VPatch.ORDER) {
        assert.property(item.patch, 'removes')
        assert.property(item.patch, 'inserts')
        assert.isArray(item.patch.removes)
        assert.isArray(item.patch.inserts)
      } else if (item.type === VPatch.INSERT) {
        assert.match(item.patch.key, /3|4/)
      } else {
        assert.fail()
      }
    })
  })
})
