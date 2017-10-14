import * as Util from '../../src/util/index'
import shallowEqual from '../../src/util/shallow-equal'
import nextTick from '../../src/util/next-tick'
import SimpleMap from '../../src/util/simple-map'

describe('Util', () => {
  const Proto = () => ({})
  Proto.prototype.b = 'b'

  it('types', () => {
    const a = 1
    const b = 'b'
    const c = () => {}
    const d = {}
    const f = [1, 2, 3]
    const h = false

    expect(Util.isNumber(a)).toBeTruthy()
    expect(Util.isString(b)).toBeTruthy()
    expect(Util.isFunction(c)).toBeTruthy()
    expect(Util.isObject(d)).toBeTruthy()
    expect(Util.isArray(f)).toBeTruthy()
    expect(Util.isBoolean(h)).toBeTruthy()
  })

  it('isEmptyObject', () => {
    expect(Util.isEmptyObject({a: 1})).not.toBeTruthy()
    expect(Util.isEmptyObject({})).toBeTruthy()
    expect(Util.isEmptyObject(null)).toBeTruthy()
    expect(Util.isEmptyObject(undefined)).toBeTruthy()
  })

  it('isNative', () => {
    function a () {}
    expect(Util.isNative(a)).not.toBeTruthy()
    expect(Util.isNative(Array)).toBeTruthy()
  })

  it('extend && clone', () => {
    const a = { a: 1, b: 2 }
    Util.extend(a, { c: 1 })
    expect(a.a).toBe(1)
    expect(a.b).toBe(2)
    expect(a.c).toBe(1)
    expect(a.d).not.toBeDefined()

    Util.extend(a, { a: 2 })
    expect(a).toEqual({a: 2, b: 2, c: 1})

    Util.extend(a, { a: { aa: 1, bb: 2 } })
    expect(a).toEqual({a: { aa: 1, bb: 2 }, b: 2, c: 1})

    const b = Util.clone(a)
    expect(b).toEqual({a: { aa: 1, bb: 2 }, b: 2, c: 1})
    b.b = 10
    expect(b.b).toBe(10)
    expect(a.b).toBe(2)
    const f = new Proto()
    Util.extend({}, f)
    expect(f.b).not.toBeDefined()
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
    expect(shallowEqual(a, b)).not.toBeTruthy()
    expect(shallowEqual(null, 110)).toBeFalsy()
    expect(shallowEqual(+0, -0)).toBeTruthy()
    expect(shallowEqual([], [1])).toBeFalsy()
    expect(shallowEqual(a, c)).toBeTruthy()
    expect(shallowEqual(d, e)).not.toBeTruthy()
    expect(shallowEqual(f, g)).toBeTruthy()
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
      expect(map.clear()).toBeUndefined()
      expect(map.get('a')).toBeUndefined()
      expect(map.has('a')).toBeFalsy()
      map.set('a', 1)
      expect(map.size).toBe(1)
      expect(map.has('b')).toBeFalsy()
      map.set('a', 1)
      expect(map.size).toBe(1)
      expect(map.get('a')).toBe(1)
      map.set('b', 2)
      expect(map.size).toBe(2)
      expect(map.has('b')).toBeTruthy()
      expect(map.get('b')).toBe(2)
      expect(map.delete('c')).toBeFalsy()
      expect(map.delete('b')).toBeTruthy()
      expect(map.size).toBe(1)
      map.clear()
      expect(map.size).toEqual(0)
      done()
      // expect(map).to.haveOwnProperty('get')
      // expect(map).to.haveOwnProperty('has')
      // expect(map).to.haveOwnProperty('delete')
      // expect(map).to.haveOwnProperty('clear')
      // expect(map).to.haveOwnProperty('size')
    })
  })
})
