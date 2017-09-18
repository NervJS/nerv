'use strict'

var Nerv = process.env.NODE_ENV === 'production'
  ? require('./dist/nerv.js')
  : require('./dist/nerv.min.js')

module.exports = Nerv
module.exports.default = module.exports
