import { isString, isNumber, supportSVG, isArray } from 'nerv-utils'
import {
  isVNode,
  isVText,
  isWidget,
  isNullOrUndef,
  VirtualNode,
  isInvalid,
  VType,
  VirtualChildren,
  VNode
} from 'nerv-shared'
import { patchProp } from './patch'
import Ref from './ref'
import { Component } from 'nervjs'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const doc = document
const isSupportSVG = supportSVG()
function createElement (
  vnode: VirtualNode,
  isSvg?: boolean,
  parentComponent?
): Element | Text | Comment | DocumentFragment | null {
  let domNode
  if (isWidget(vnode)) {
    domNode = vnode.init(parentComponent)
  } else if (isString(vnode) || isNumber(vnode)) {
    domNode = doc.createTextNode(vnode as string)
  } else if (isVText(vnode)) {
    domNode = doc.createTextNode(vnode.text as string)
    vnode.dom = domNode
  } else if (isNullOrUndef(vnode) || (vnode as any) === false) {
    domNode = doc.createTextNode('')
  } else if (isVNode(vnode)) {
    if (vnode.isSvg) {
      isSvg = true
    } else if (vnode.type === 'svg') {
      isSvg = true
    } else if (vnode.type === 'foreignObject') {
      isSvg = false
    }
    if (isSupportSVG) {
      isSvg = false
    }
    if (isSvg) {
      vnode.namespace = SVG_NAMESPACE
      vnode.isSvg = isSvg
    }
    domNode =
      vnode.namespace === null
        ? doc.createElement(vnode.type)
        : isSupportSVG
          ? doc.createElementNS(vnode.namespace, vnode.type)
          : doc.createElement(vnode.type)
    setProps(domNode, vnode, isSvg)
    const children = vnode.children
    if (isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        mountChild(
          children[i] as VirtualNode,
          domNode,
          vnode.parentContext,
          parentComponent,
          isSvg
        )
      }
    } else {
      mountChild(children, domNode, vnode.parentContext, parentComponent, isSvg)
    }
    vnode.dom = domNode
    if (vnode.ref !== null) {
      Ref.attach(vnode, vnode.ref, domNode)
    }
  } else if (isArray(vnode)) {
    domNode = doc.createDocumentFragment()
    vnode.forEach((child) => {
      if (!isInvalid(child)) {
        const childNode = createElement(child, isSvg, parentComponent)
        if (childNode) {
          domNode.appendChild(childNode)
        }
      }
    })
  } else if (!isInvalid(vnode) && vnode.vtype === VType.Void) {
    domNode = vnode.dom
  } else {
    throw new Error('Unsupported VNode.')
  }
  return domNode
}

function mountChild (
  child: VirtualChildren,
  domNode: Element,
  parentContext: Object,
  parentComponent: Component<any, any>,
  isSvg?: boolean
) {
  if (isWidget(child) || isVNode(child)) {
    child.parentContext = parentContext || {}
  }
  const childNode = createElement(child as VNode, isSvg, parentComponent)
  if (childNode) {
    domNode.appendChild(childNode)
  }
}

function setProps (domNode: Element, vnode: VNode, isSvg) {
  const props = vnode.props
  for (const p in props) {
    patchProp(domNode, p, {}, props[p], isSvg)
  }
}

export default createElement
