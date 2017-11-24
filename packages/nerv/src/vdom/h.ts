import createVNode from './create-vnode'
import createVText from './create-vtext'
import {
  Props,
  VirtualChildren,
  VirtualNode,
  isValidElement
} from 'nerv-shared'
import { isString, isArray, isNumber } from 'nerv-utils'

function h (type: string, props: Props, children?: VirtualChildren) {
  const childNodes = []
  if (!children && isChildren(props)) {
    children = props
    props = {}
  }
  props = props || {}
  if (props.children) {
    if (!children || !children.length) {
      children = props.children
    }
    delete props.children
  }
  if (children) {
    addChildren(childNodes, children, type)
  }
  return createVNode(
    type,
    props,
    flattenChildren(children),
    props.key,
    props.namespace,
    props.owner,
    props.ref
  )
}

function flattenChildren (children) {
  if (isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      return flattenChildren(children)
    }
  } else if (isString(children) || isNumber(children)) {
    return createVText(String(children))
  }
  return children
}

function addChildren (
  childNodes: VirtualNode[],
  children: VirtualNode,
  type: string
) {
  if (isString(children) || isNumber(children)) {
    children = String(children)
    childNodes.push(createVText(children) as any)
  } else if (isValidElement(children)) {
    childNodes.push(children)
  } else if (isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      addChildren(childNodes, children[i], type)
    }
  }
}

function isChildren (x): x is VirtualChildren {
  return isString(x) || isArray(x) || isValidElement(x)
}

export default h
