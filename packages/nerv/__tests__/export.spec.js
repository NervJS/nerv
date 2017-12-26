import Nerv from '../index'
import assert from 'assert'

describe('Should export correct module', () => {
  it('Should export `default` module', () => {
    assert(Nerv['default'])
  })

  it('should export correct module', () => {
    assert(Nerv.Children)
    assert(Nerv.Component)
    assert(Nerv.PureComponent)
    assert(Nerv.createElement)
    assert(Nerv.cloneElement)
    assert(Nerv.options)
    assert(Nerv.findDOMNode)
    assert(Nerv.isValidElement)
    assert(Nerv.unmountComponentAtNode)
  })
})
