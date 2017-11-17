import createVNode from './create-vnode'
import createVText from './create-vtext'
import {
  isVNode,
  isVText,
  isWidget,
  Props,
  VirtualChildren,
  VirtualNode
} from 'nerv-shared'
import { isString, isArray, isNumber } from 'nerv-utils'

function h (type: string, props: Props, children?: VirtualChildren) {
  let key
  let namespace
  let owner
  const childNodes = []
  if (!children && isChildren(props)) {
    children = props
    props = {}
  }
  props = props || {}
  if (props.hasOwnProperty('key') && props.key) {
    key = props.key
    delete props.key
  }
  if (props.hasOwnProperty('namespace') && props.namespace) {
    namespace = props.namespace
    delete props.namespace
  }
  if (props.hasOwnProperty('owner')) {
    owner = props.owner
    delete props.owner
  }
  if (props.hasOwnProperty('children') && props.children) {
    if (!children || !children.length) {
      children = props.children
    }
    delete props.children
  }
  if (children) {
    addChildren(childNodes, children, type)
  }
  return createVNode(type, props, childNodes, key, namespace, owner)
}

function addChildren (
  childNodes: VirtualNode[],
  children: VirtualNode,
  type: string
) {
  if (isString(children) || isNumber(children)) {
    children = String(children)
    childNodes.push(createVText(children) as any)
  } else if (isChild(children)) {
    childNodes.push(children)
  } else if (isArray(children)) {
    (children as any[]).forEach((child) =>
      addChildren(childNodes, child, type)
    )
  }
}

function isChild (node): node is VirtualNode {
  return isVNode(node) || isVText(node) || isWidget(node)
}

function isChildren (x): x is VirtualChildren {
  return isString(x) || isArray(x) || isChild(x)
}

export default h
