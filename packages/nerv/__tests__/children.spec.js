import { Children } from '../src/children'

describe('Children', () => {
  describe('map', () => {
    it('should return itself when is undefined', () => {
      expect(Children.map()).toBe(undefined)
    })
    it('should bind the ctx', () => {
      const children = ['1', '2', '3']
      function times2 (n) {
        return n * 2
      }
      expect(Children.map(children, times2, Number)).toEqual([2, 4, 6])
    })
    it('should handle array of arrays', () => {
      const children = ['1', '2', '3', ['4']]
      function times2 (n) {
        return n * 2
      }
      expect(Children.map(children, times2, Number)).toEqual([2, 4, 6, 8])
    })
    it('should exec map with every element', () => {
      const children = [1, 2, 3]
      function times2 (n) {
        return n * 2
      }
      expect(Children.map(children, times2)).toEqual([2, 4, 6])
    })
  })

  describe('forEach', () => {
    it('should return itself when is undefined', () => {
      expect(Children.forEach()).toBe(undefined)
    })

    it('should exec with every element', () => {
      const children = [1, 2, 3]
      function times2 (n, i) {
        children[i] = n * 2
      }
      Children.forEach(children, times2)
      expect(children).toEqual([2, 4, 6])
    })

    it('should bind the ctx', () => {
      const children = ['1', '2', '3']
      function times2 (n, i) {
        children[i] = n * 2
      }
      Children.forEach(children, times2, Number)
      expect(children).toEqual([2, 4, 6])
    })
  })

  it('should return the only one children in a array', () => {
    expect(Children.only(['wallace'])).toBe('wallace')
  })

  it('should throw error when input childrens', () => {
    expect(() => {
      Children.only([1, 2])
    }).toThrowError(`Children.only() expects only one child.`)
  })

  it('count should work', () => {
    expect(Children.count([])).toBe(0)
  })

  describe('toArray', () => {
    it('should return empty array when undefined', () => {
      expect(Children.toArray().length).toBe(0)
    })
  })
})
