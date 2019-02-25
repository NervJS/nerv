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
  isPortal,
  isFragment,
  MemoComponent,
  Suspense,
  LazyComponent,
  NervConsumer,
  NervProvider,
  Fragment
} from 'nerv-shared'
import { patchProp } from './patch'
import Ref from './ref'
import options from '../options'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

export function createElement (
  vnode: VirtualNode | VirtualNode[] | Function,
  isSvg?: boolean,
  parentContext?,
  parentComponent?
): Element | Text | Comment | DocumentFragment | null {
  let domNode
  console.log('vnode123', vnode, VType.Fragment)
  if (isValidElement(vnode)) {
    const vtype = vnode.vtype
   if (vtype & (VType.Composite | VType.Stateless)) {
      domNode = (vnode as CompositeComponent).init(parentContext, parentComponent)
      options.afterMount(vnode as CompositeComponent)
    } else if(vtype & VType.Suspense) {
      domNode = (vnode as Suspense).initSuspenseComponent(parentContext, parentComponent, isSvg);
      console.log('suspensessss')
      // (vnode as any).dom = domNode
      // console.log('domNode', domNode)
    } else if(vtype & VType.LazyComponent) {
      domNode = (vnode as LazyComponent).initLazyComponent(parentContext, parentComponent, isSvg);
      (vnode as any).dom = domNode
    } else if(vtype & VType.NervProvider) { 
      domNode = doc.createDocumentFragment()
      let children = (vnode as NervProvider<any>).props.children
      if(!isArray(children)) { children = [children]}
      children.map && children.map((child) => {
        if (!isInvalid(child)) {
          const childNode = createElement(child, isSvg, parentContext, parentComponent)
          if (childNode) {
            domNode.appendChild(childNode)
          }
        }
      });
      (vnode as any).dom = domNode
    } else if (vtype & VType.NervConsumer) {
      domNode = doc.createDocumentFragment();
      let child = (vnode as NervConsumer<any>).props.children
      const childNode = createElement(child, isSvg, parentContext, parentComponent)
      domNode.appendChild(childNode);
      (vnode as any).dom = domNode
    } else if (vtype & VType.MemoComponent) {
      domNode = (vnode as MemoComponent).init(parentContext, parentComponent)
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
    } else if (isFragment(vtype, vnode)) {
      domNode = doc.createDocumentFragment()
      let children = (vnode as Fragment).props.children
      if(!isArray(children)) { children = [children]}
      children.map && children.map((child) => {
        if (!isInvalid(child)) {
          const childNode = createElement(child, isSvg, parentContext, parentComponent)
          if (childNode) {
            domNode.appendChild(childNode)
          }
        }
      });
      (vnode as any).dom = domNode
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
    throw new Error('Unsupported VNode.',)
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
