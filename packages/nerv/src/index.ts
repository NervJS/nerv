import Component from './component'
import PureComponent from './pure-component'
import { render } from './render'
import createElement from './create-element'
import cloneElement from './clone-element'
import { nextTick } from 'nerv-utils'
import { isValidElement } from 'nerv-shared'
import { Children } from './children'
import { hydrate } from './hydrate'
import options from './options'
import {
  unmountComponentAtNode,
  findDOMNode,
  createPortal,
  unstable_renderSubtreeIntoContainer,
  createFactory
} from './dom'

export {
  Children,
  Component,
  PureComponent,
  createElement,
  cloneElement,
  render,
  nextTick,
  options,
  findDOMNode,
  isValidElement,
  unmountComponentAtNode,
  createPortal,
  unstable_renderSubtreeIntoContainer,
  hydrate,
  createFactory
}

export default {
  Children,
  Component,
  PureComponent,
  createElement,
  cloneElement,
  render,
  nextTick,
  options,
  findDOMNode,
  isValidElement,
  unmountComponentAtNode,
  createPortal,
  unstable_renderSubtreeIntoContainer,
  hydrate,
  createFactory
} as any
