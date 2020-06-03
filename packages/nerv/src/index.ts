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
// tslint:disable-next-line: max-line-length
import { getHooks, useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useImperativeHandle, useContext, useDebugValue } from './hooks'
import { createRef, forwardRef } from './create-ref'
import { memo } from './memo'
import { createContext } from './create-context'
import { renderComponent } from './lifecycle'
import Current from './current-owner'
import { Fragment } from './fragment'

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
  createContext,
  renderComponent,
  getHooks,
  Current,
  Fragment,
  useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useImperativeHandle, useContext,
  useDebugValue
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
  createContext,
  renderComponent,
  getHooks,
  Current,
  useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useImperativeHandle, useContext,
  useDebugValue,
  Fragment
}
