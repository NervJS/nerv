import { Util } from '../../src'
import shallowEqual from '../../src/lib/util/shallow-equal'
// import SimpleMap from '../../src/lib/util/simple-map'

describe('Util', () => {
  // it('types', () => {
  //   const a = 1
  //   const b = 'b'
  //   const c = () => {}
  //   const d = {}
  //   const e = new Date()
  //   const f = [1, 2, 3]
  //   const g = /\s/
  //   const h = false
  //   const i = new Error('error')

  //   expect(Util.isNumber(a)).to.be.true
  //   expect(Util.isString(b)).to.be.true
  //   expect(Util.isFunction(c)).to.be.true
  //   expect(Util.isObject(d)).to.be.true
  //   expect(Util.isDate(e)).to.be.true
  //   expect(Util.isArray(f)).to.be.true
  //   expect(Util.isRegExp(g)).to.be.true
  //   expect(Util.isBoolean(h)).to.be.true
  //   expect(Util.isError(i)).to.be.true
  // })

  // it('isEmptyObject', () => {
  //   expect(Util.isEmptyObject({a: 1})).not.to.be.true
  //   expect(Util.isEmptyObject({})).to.be.true
  //   expect(Util.isEmptyObject(null)).to.be.true
  //   expect(Util.isEmptyObject(undefined)).to.be.true
  // })

  // it('isNative', () => {
  //   function a () {}
  //   expect(Util.isNative(a)).not.to.be.true
  //   expect(Util.isNative(Array)).to.be.true
  //   expect(Util.isNative(setTimeout)).to.be.true
  // })

  // it('extend && clone', () => {
  //   let a = { a: 1, b: 2 }
  //   Util.extend(a, { c: 1 })
  //   expect(a).to.have.property('a', 1)
  //   expect(a).to.have.property('b', 2)
  //   expect(a).to.have.property('c', 1)
  //   expect(a).not.to.have.property('d')

  //   Util.extend(a, { a: 2 })
  //   expect(a).to.deep.equal({a: 2, b: 2, c: 1})

  //   Util.extend(a, { a: { aa: 1, bb: 2 } })
  //   expect(a).to.deep.equal({a: { aa: 1, bb: 2 }, b: 2, c: 1})

  //   let b = Util.clone(a)
  //   expect(b).to.deep.equal({a: { aa: 1, bb: 2 }, b: 2, c: 1})
  //   b.b = 10
  //   expect(b).to.have.property('b', 10)
  //   expect(a).to.have.property('b', 2)
  // })

  // it('proxy', () => {
  //   const ctx = { a: 'sdsd' }
  //   const obj = {
  //     a: 0,
  //     fn: function (arg) {
  //       return arg ? this.a + arg : this.a
  //     }
  //   }
  //   expect(obj.fn(1)).to.be.equal(1)
  //   expect(Util.proxy(obj.fn, ctx)('ddd')).to.be.equal('sdsdddd')
  // })

  // it('shallowEqual', () => {
  //   let a = {a: 1}
  //   let b = {a: 2}
  //   let c = {a: 1}
  //   let d = {a: 1, v: []}
  //   let e = {a: 1, v: []}
  //   const arr1 = []
  //   let f = {a: 1, v: arr1}
  //   let g = {a: 1, v: arr1}
  //   expect(shallowEqual(a, b)).not.to.be.true
  //   expect(shallowEqual(a, c)).to.be.true
  //   expect(shallowEqual(d, e)).not.to.be.true
  //   expect(shallowEqual(f, g)).to.be.true
  // })

  // it('SimpleMap', () => {
  //   const map = new SimpleMap()
  //   expect(map.size()).to.be.equal(0)
  //   map.set('a', '1')
  //   map.set('b', { a: 1 })
  //   expect(map.get('a')).to.be.equal('1')
  //   expect(map.get('b')).to.deep.be.equal({a: 1})
  //   expect(map.size()).to.be.equal(2)
  //   expect(map.has('a')).to.be.true
  //   expect(map.has('b')).to.be.true
  //   expect(map.has('sdsd')).not.to.be.true
  //   map.remove('a')
  //   expect(map.has('a')).not.to.be.true
  //   expect(map.size()).to.be.equal(1)
  //   map.clear()
  //   expect(map.has('b')).not.to.be.true
  //   expect(map.size()).to.be.equal(0)
  // })
})
