import createVNode from './create-vnode'
import createVText from './create-vtext'
import {
  Props,
  // VirtualChildren,
  VirtualNode,
  isValidElement,
  EMPTY_CHILDREN
} from 'nerv-shared'
import { isString, isArray, isNumber } from 'nerv-utils'

function h (type: string, props: Props, children?) {
  const childNodes = []
  if (props.children) {
    if (!children) {
      children = props.children
    }
    delete props.children
  }
  if (isArray(children)) {
    addChildren(childNodes, children, type)
  } else if (isString(children) || isNumber(children)) {
    children = createVText(String(children))
  } else if (!isValidElement(children)) {
    children = EMPTY_CHILDREN
  }
  return createVNode(
    type,
    props,
    childNodes.length ? childNodes : children,
    props.key,
    props.namespace,
    props.owner,
    props.ref
  )
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

export default h
