import * as Util from '../../src/util/index'
import shallowEqual from '../../src/util/shallow-equal'
import nextTick from '../../src/util/next-tick'
import SimpleMap from '../../src/util/simple-map'

describe('Util', () => {
  const Proto = () => (this.a = 'a')
  Proto.prototype.b = 'b'

  it('types', () => {
    const a = 1
    const b = 'b'
    const c = () => {}
    const d = {}
    const f = [1, 2, 3]
    const h = false

    expect(Util.isNumber(a)).to.be.true
    expect(Util.isString(b)).to.be.true
    expect(Util.isFunction(c)).to.be.true
    expect(Util.isObject(d)).to.be.true
    expect(Util.isArray(f)).to.be.true
    expect(Util.isBoolean(h)).to.be.true
  })

  it('isEmptyObject', () => {
    expect(Util.isEmptyObject({a: 1})).not.to.be.true
    expect(Util.isEmptyObject({})).to.be.true
    expect(Util.isEmptyObject(null)).to.be.true
    expect(Util.isEmptyObject(undefined)).to.be.true
    expect(Util.isEmptyObject(new Proto())).to.be.true
  })

  it('isNative', () => {
    function a () {}
    expect(Util.isNative(a)).not.to.be.true
    expect(Util.isNative(Array)).to.be.true
    expect(Util.isNative(setTimeout)).to.be.true
  })

  it('extend && clone', () => {
    const a = { a: 1, b: 2 }
    Util.extend(a, { c: 1 })
    expect(a).to.have.property('a', 1)
    expect(a).to.have.property('b', 2)
    expect(a).to.have.property('c', 1)
    expect(a).not.to.have.property('d')

    Util.extend(a, { a: 2 })
    expect(a).to.deep.equal({a: 2, b: 2, c: 1})

    Util.extend(a, { a: { aa: 1, bb: 2 } })
    expect(a).to.deep.equal({a: { aa: 1, bb: 2 }, b: 2, c: 1})

    const b = Util.clone(a)
    expect(b).to.deep.equal({a: { aa: 1, bb: 2 }, b: 2, c: 1})
    b.b = 10
    expect(b).to.have.property('b', 10)
    expect(a).to.have.property('b', 2)
    const f = new Proto()
    Util.extend({}, f)
    expect(f).to.not.haveOwnProperty('b')
  })

  it('shallowEqual', () => {
    const a = {a: 1}
    const b = {a: 2}
    const c = {a: 1}
    const d = {a: 1, v: []}
    const e = {a: 1, v: []}
    const arr1 = []
    const f = {a: 1, v: arr1}
    const g = {a: 1, v: arr1}
    expect(shallowEqual(a, b)).not.to.be.true
    expect(shallowEqual(null, 110)).to.be.false
    expect(shallowEqual(+0, -0)).to.be.true
    expect(shallowEqual([], [1])).to.be.false
    expect(shallowEqual(a, c)).to.be.true
    expect(shallowEqual(d, e)).not.to.be.true
    expect(shallowEqual(f, g)).to.be.true
  })

  describe('nextTick', () => {
    it('accepts a callback', done => {
      nextTick(done)
    })

    it('returns a Promise when provided no callback', done => {
      nextTick().then(done)
    })

    it('throw error in callback can carry on', done => {
      nextTick(() => {
        throw new Error('e')
      })
      done()
    })
  })

  describe('simpleMap', () => {
    const map = new SimpleMap()
    it('get and set', done => {
      expect(map.clear()).to.be.undefined
      expect(map.get('a')).to.be.undefined
      expect(map.has('a')).to.be.false
      map.set('a', 1)
      expect(map.has('b')).to.be.false
      map.set('a', 1)
      expect(map.get('a')).to.be.equals(1)
      map.set('b', 2)
      expect(map.has('b')).to.be.true
      expect(map.get('b')).to.be.equals(2)
      expect(map.delete('c')).to.be.false
      expect(map.delete('b')).to.be.true
      map.clear()
      expect(map.size()).to.be.equals(0)
      done()
      // expect(map).to.haveOwnProperty('get')
      // expect(map).to.haveOwnProperty('has')
      // expect(map).to.haveOwnProperty('delete')
      // expect(map).to.haveOwnProperty('clear')
      // expect(map).to.haveOwnProperty('size')
    })
  })
})
