import h from '../src/vdom/h'
import diff from '../src/vdom/diff'
import VPatch from '../src/vdom/vpatch'

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
    expect(Array.isArray(diffResult)).toBe(true)
    diffResult.forEach(item => {
      if (item.type === VPatch.PROPS) {
        expect(item.patch.style.width).toBe('10px')
        expect(item.patch.style.height).toBe('200px')
        expect(item.patch.attributes.prop).toBe('cc')
      } else if (item.type === VPatch.ORDER) {
        expect(item.patch.removes).toBeDefined()
        expect(item.patch.inserts).toBeDefined()
        expect(Array.isArray(item.patch.removes)).toBeTruthy()
        expect(Array.isArray(item.patch.inserts)).toBeTruthy()
      } else if (item.type === VPatch.INSERT) {
        expect(item.patch.key.match(/3|4/)).toBeTruthy()
      }
    })
  })
})
