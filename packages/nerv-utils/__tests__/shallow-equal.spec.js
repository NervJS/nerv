import { shallowEqual } from '../src'
describe('shallowEqual', () => {
  it('shallowEqual', () => {
    const a = { a: 1 }
    const b = { a: 2 }
    const c = { a: 1 }
    const d = { a: 1, v: [] }
    const e = { a: 1, v: [] }
    const arr1 = []
    const f = { a: 1, v: arr1 }
    const g = { a: 1, v: arr1 }
    expect(shallowEqual(a, b)).not.toBeTruthy()
    expect(shallowEqual(null, 110)).toBeFalsy()
    expect(shallowEqual(+0, -0)).toBeTruthy()
    expect(shallowEqual([], [1])).toBeFalsy()
    expect(shallowEqual(a, c)).toBeTruthy()
    expect(shallowEqual(d, e)).not.toBeTruthy()
    expect(shallowEqual(f, g)).toBeTruthy()
  })
})
