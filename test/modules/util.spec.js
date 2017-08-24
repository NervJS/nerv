import * as Util from '../../src/lib/util'
import shallowEqual from '../../src/lib/util/shallow-equal'

describe('Util', () => {
  it('types', () => {
    const a = 1
    const b = 'b'
    const c = () => {}
    const d = {}
    const e = new Date()
    const f = [1, 2, 3]
    const g = /\s/
    const h = false
    const i = new Error('error')

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
    expect(shallowEqual(a, c)).to.be.true
    expect(shallowEqual(d, e)).not.to.be.true
    expect(shallowEqual(f, g)).to.be.true
  })
})
