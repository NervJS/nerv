import { isSupportSVG, isArray, isString, isNumber, doc, isBoolean } from 'nerv-utils'
import {
  isNullOrUndef,
  VirtualNode,
  isInvalid,
  VType,
  VNode,
  isValidElement,
  EMPTY_OBJ,
  CompositeComponent,
  isPortal
} from 'nerv-shared'
import { patchProp } from './patch'
import Ref from './ref'
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

function createElement (
  vnode: VirtualNode | VirtualNode[],
  isSvg?: boolean,
  parentContext?,
  parentComponent?
): Element | Text | Comment | DocumentFragment | null {
  let domNode
  if (isValidElement(vnode)) {
    const vtype = vnode.vtype
    if (vtype & (VType.Composite)) {
      domNode = (vnode as CompositeComponent).init(parentContext, parentComponent)
    } else if (vtype & VType.Text) {
      domNode = doc.createTextNode((vnode as any).text);
      (vnode as any).dom = domNode
    } else if (vtype & VType.Node) {
      domNode = mountVNode(vnode as any, isSvg, parentContext, parentComponent)
    } else if (vtype & VType.Void) {
      domNode = (vnode as any).dom = doc.createTextNode('')
    } else if (isPortal(vtype, vnode)) {
      vnode.type.appendChild(
        createElement(vnode.children, isSvg, parentContext, parentComponent) as Element
      )
      domNode = doc.createTextNode('')
    }
  } else if (isString(vnode) || isNumber(vnode)) {
    domNode = doc.createTextNode(vnode as string)
  } else if (isNullOrUndef(vnode) || isBoolean(vnode)) {
    domNode = doc.createTextNode('')
  } else if (isArray(vnode)) {
    domNode = doc.createDocumentFragment()
    vnode.forEach((child) => {
      if (!isInvalid(child)) {
        const childNode = createElement(child, isSvg, parentContext, parentComponent)
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

export function mountVNode (vnode: VNode, isSvg?: boolean, parentContext?, parentComponent?) {
  if (vnode.isSvg) {
    isSvg = true
  } else if (vnode.type === 'svg') {
    isSvg = true
  /* istanbul ignore next */
  } else if (!isSupportSVG) {
    isSvg = false
  }
  if (isSvg) {
    vnode.namespace = SVG_NAMESPACE
    vnode.isSvg = isSvg
  }
  const domNode = !isSvg
    ? doc.createElement(vnode.type)
    : doc.createElementNS(vnode.namespace, vnode.type)
  setProps(domNode, vnode, isSvg as boolean)
  if (vnode.type === 'foreignObject') {
    isSvg = false
  }
  const children = vnode.children
  if (isArray(children)) {
    for (let i = 0, len = children.length; i < len; i++) {
      mountChild(children[i] as VNode, domNode, parentContext, isSvg, parentComponent)
    }
  } else {
    mountChild(children as VNode, domNode, parentContext, isSvg, parentComponent)
  }
  vnode.dom = domNode
  if (vnode.ref !== null) {
    Ref.attach(vnode, vnode.ref, domNode)
  }
  return domNode
}

export function mountChild (
  child: VNode,
  domNode: Element,
  parentContext: Object,
  isSvg?: boolean,
  parentComponent?
) {
  child.parentContext = parentContext || EMPTY_OBJ
  const childNode = createElement(child as VNode, isSvg, parentContext, parentComponent)
  if (childNode !== null) {
    domNode.appendChild(childNode)
  }
}

function setProps (domNode: Element, vnode: VNode, isSvg: boolean) {
  const props = vnode.props
  for (const p in props) {
    patchProp(domNode, p, null, props[p], null, isSvg)
  }
}

export default createElement
