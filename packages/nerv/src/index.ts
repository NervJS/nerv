import Component from './component'
import PureComponent from './pure-component'
import { render } from './render'
import createElement from './create-element'
import cloneElement from './clone-element'
import { nextTick } from 'nerv-utils'
import { Children } from './children'
import { hydrate } from './hydrate'
import options from './options'
import { createPortal } from './vdom/create-portal'
import { createFragment } from './vdom/create-fragment'
import { createRef, forwardRef } from './vdom/create-ref'
import { memo } from './vdom/memo'
import { lazy } from './vdom/lazy'
import { Fragment } from './vdom/fragment'
import { version } from './version'
import { SuspenseComponent as Suspense } from './vdom/suspense'
import {
  unmountComponentAtNode,
  findDOMNode,
  unstable_renderSubtreeIntoContainer,
  createFactory,
  unstable_batchedUpdates,
  isValidElement
} from './dom'
import { PropTypes } from './prop-types' // for React 15- compat

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
  createFactory,
  unstable_batchedUpdates,
  version,
  PropTypes,

  createFragment,
  Fragment,
  createRef,
  forwardRef,
  memo,
  lazy,
  Suspense
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
  createFactory,
  unstable_batchedUpdates,
  version,
  PropTypes,

  createFragment,
  Fragment,
  createRef,
  forwardRef,
  memo,
  lazy,
  Suspense
} as any
