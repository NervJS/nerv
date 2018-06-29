import { noop } from 'nerv-shared'
const shim = noop as any
shim.isRequired = noop

function getShim () {
  return shim
}

const PropTypes = {
  array: shim,
  bool: shim,
  func: shim,
  number: shim,
  object: shim,
  string: shim,

  any: shim,
  arrayOf: getShim,
  element: shim,
  instanceOf: getShim,
  node: shim,
  objectOf: getShim,
  oneOf: getShim,
  oneOfType: getShim,
  shape: getShim,
  exact: getShim,
  PropTypes: {},
  checkPropTypes: noop
}

PropTypes.PropTypes = PropTypes

export { PropTypes }
