import h from './h'
import SVGAttributeNamespace from './svg-attribute-namespace'
import attributeHook from '../hooks/attribute-hook'
import { isString, isBoolean, isNumber } from '~'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

export default function svg (tagName, properties, children) {
  if (!children && isChildren(properties)) {
    children = properties
    properties = {}
  }
  properties = properties || {}
  properties.namespace = SVG_NAMESPACE
  const attributes = properties.attributes || (properties.attributes = {})
  for (let key in properties) {
    if (!properties.hasOwnProperty(key)) {
      continue
    }
    let namespace = SVGAttributeNamespace(key)
    if (namespace === undefined) {
      continue
    }
    let value = properties[key]
    if (!isString(value) && !isNumber(value) && !isBoolean(value) ) {
      continue
    }
    if (namespace !== null) {
      properties[key] = attributeHook(namespace, value)
      continue
    }
    attributes[key] = value
    properties[key] = undefined
  }
  return h(tagName, properties, children)
}

function isChildren (node) {
  return isString(node) || Array.isArray(node)
}