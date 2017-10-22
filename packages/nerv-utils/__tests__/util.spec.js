import {
  isNative,
  isArray,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isString,
  extend,
  clone
} from '../src'

describe('Util', () => {
  it('types', () => {
    const a = 1
    const b = 'b'
    const c = () => {}
    const d = {}
    const f = [1, 2, 3]
    const h = false

    expect(isNumber(a)).toBeTruthy()
    expect(isString(b)).toBeTruthy()
    expect(isFunction(c)).toBeTruthy()
    expect(isObject(d)).toBeTruthy()
    expect(isArray(f)).toBeTruthy()
    expect(isBoolean(h)).toBeTruthy()
  })

  it('isNative', () => {
    function a () {}
    expect(isNative(a)).not.toBeTruthy()
    expect(isNative(Array)).toBeTruthy()
  })

  it('extend && clone', () => {
    const a = { a: 1, b: 2 }
    extend(a, { c: 1 })
    expect(a.a).toBe(1)
    expect(a.b).toBe(2)
    expect(a.c).toBe(1)
    expect(a.d).not.toBeDefined()

    extend(a, { a: 2 })
    expect(a).toEqual({a: 2, b: 2, c: 1})

    extend(a, { a: { aa: 1, bb: 2 } })
    expect(a).toEqual({a: { aa: 1, bb: 2 }, b: 2, c: 1})

    const b = clone(a)
    expect(b).toEqual({a: { aa: 1, bb: 2 }, b: 2, c: 1})
    b.b = 10
    expect(b.b).toBe(10)
    expect(a.b).toBe(2)
    // const Proto = function () {
    //   this.a = 'a'
    // }
    // Proto.prototype.b = 'b'
    // const f = new Proto()
    // extend({}, f)
    // expect(f.b).not.toBeDefined()
  })
})
