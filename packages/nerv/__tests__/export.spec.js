import Nerv from '../index'

describe('Should export correct module', () => {
  it('Should export `default` module', () => {
    expect(Nerv['default']).not.toBe(undefined)
  })

  it('should export correct module', () => {
    expect(Nerv.Children).not.toBe(undefined)
    expect(Nerv.Component).not.toBe(undefined)
    expect(Nerv.PureComponent).not.toBe(undefined)
    expect(Nerv.createElement).not.toBe(undefined)
    expect(Nerv.cloneElement).not.toBe(undefined)
    expect(Nerv.options).not.toBe(undefined)
    expect(Nerv.findDOMNode).not.toBe(undefined)
    expect(Nerv.isValidElement).not.toBe(undefined)
    expect(Nerv.unmountComponentAtNode).not.toBe(undefined)
  })
})
