import Component from './component'
import PureComponent from './pure-component'
import { render } from './render'
import createElement from './create-element'
import cloneElement from './clone-element'
import nextTick from './util/next-tick'
import options from './options'

module.exports = {
  Component,
  PureComponent,
  createElement,
  cloneElement,
  render,
  nextTick,
  options
}
module.exports.default = module.exports
