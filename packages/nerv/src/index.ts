import Component from './component'
import PureComponent from './pure-component'
import { render } from './render'
import createElement from './create-element'
import cloneElement from './clone-element'
import { nextTick } from 'nerv-utils'
import options from './options'
import { unmountComponentAtNode, findDOMNode } from './dom'

export {
  Component,
  PureComponent,
  createElement,
  cloneElement,
  render,
  nextTick,
  options,
  unmountComponentAtNode
}

export default {
  Component,
  PureComponent,
  createElement,
  cloneElement,
  render,
  nextTick,
  options,
  findDOMNode
} as {
  Component,
  PureComponent,
  createElement,
  cloneElement,
  render,
  nextTick,
  options
}
