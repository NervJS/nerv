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
import { version } from './version'
import {
  unmountComponentAtNode,
  findDOMNode,
  unstable_renderSubtreeIntoContainer,
  createFactory,
  unstable_batchedUpdates,
  isValidElement
} from './dom'
import { PropTypes } from './prop-types' // for React 15- compat
import { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo } from './hooks'
import { createRef, forwardRef } from './create-ref'
import { memo } from './memo'

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
  createRef,
  forwardRef,
  memo,
  useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo
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
  createRef,
  forwardRef,
  memo,
  useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo
}
