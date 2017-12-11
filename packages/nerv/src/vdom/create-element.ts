import { supportSVG, isArray, isString, isNumber } from 'nerv-utils'
import {
  isNullOrUndef,
  VirtualNode,
  isInvalid,
  VType,
  VNode,
  isValidElement,
  EMPTY_OBJ
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
  if (isValidElement(vnode)) {
    const vtype = vnode.vtype
    if (vtype & (VType.Composite | VType.Stateless)) {
      domNode = (vnode as any).init(parentComponent)
    } else if (vtype & VType.Text) {
      domNode = doc.createTextNode((vnode as any).text);
      (vnode as any).dom = domNode
    } else if (vtype & VType.Node) {
      domNode = mountVNode(vnode as any, isSvg, parentComponent)
    } else if (vtype & VType.Void) {
      domNode = (vnode as any).dom
    }
  } else if (isString(vnode) || isNumber(vnode)) {
    domNode = doc.createTextNode(vnode as string)
  } else if (isNullOrUndef(vnode) || (vnode as any) === false) {
    domNode = doc.createTextNode('')
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
  } else {
    throw new Error('Unsupported VNode.')
  }
  return domNode
}

export function mountVNode (vnode: VNode, isSvg?: boolean, parentComponent?) {
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
  const domNode =
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
        children[i] as VNode,
        domNode,
        vnode.parentContext,
        parentComponent,
        isSvg
      )
    }
  } else {
    mountChild(
      children as VNode,
      domNode,
      vnode.parentContext,
      parentComponent,
      isSvg
    )
  }
  vnode.dom = domNode
  if (vnode.ref !== null) {
    Ref.attach(vnode, vnode.ref, domNode)
  }
  return domNode
}

function mountChild (
  child: VNode,
  domNode: Element,
  parentContext: Object,
  parentComponent: Component<any, any>,
  isSvg?: boolean
) {
  child.parentContext = parentContext || EMPTY_OBJ
  const childNode = createElement(child as VNode, isSvg, parentComponent)
  if (childNode !== null) {
    domNode.appendChild(childNode)
  }
}

function setProps (domNode: Element, vnode: VNode, isSvg) {
  const props = vnode.props
  for (const p in props) {
    patchProp(domNode, p, null, props[p], isSvg)
  }
}

export default createElement
