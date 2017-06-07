import VNode from './vnode/vnode'
import VText from './vnode/VText'
import { isVNode, isVText, isWidget, isStateLess } from './vnode/types'
import { isString, isArray, isNumber } from '~'

function h (tagName, properties, children) {
  let key, namespace, childNodes = []
  if (!children && isChildren(properties)) {
    children = properties
    properties = {}
  }
  properties = properties || {}
  if (properties.hasOwnProperty('key') && properties.key) {
    key = properties.key
    delete properties.key
  }
  if (properties.hasOwnProperty('namespace') && properties.namespace) {
    namespace = properties.namespace
    delete properties.namespace
  }
  if (children) {
    addChildren(childNodes, children, tagName)
  }
  return new VNode(tagName, properties, childNodes, key, namespace)
}

function addChildren (childNodes, children, tagName) {
  if (isString(children) || isNumber(children)) {
    children = String(children)
    childNodes.push(new VText(children))
  } else if (isChild(children)) {
    childNodes.push(children)
  } else if (isArray(children)) {
    children.forEach(child => addChildren(childNodes, child, tagName))
  } else if (children === null || children === undefined) {
    return
  }
}

function isChild (node) {
  return isVNode(node) || isVText(node) || isWidget(node) || isStateLess(node)
}

function isChildren (x) {
  return isString(x) || isArray(x) || isChild(x)
}

export default h
