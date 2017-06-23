import h from '#/h'
import SVGPropertyConfig from '#/svg-property-config'
import { isFunction, isString, isNumber, isBoolean, isObject } from '~'
import FullComponent from './full-component'
import StatelessComponent from './stateless-component'
import CurrentOwner from './current-owner'
import RefHook from './hooks/ref-hook'
import HtmlHook from './hooks/html-hook'
import EventHook from './hooks/event-hook'
import AttributeHook from './hooks/attribute-hook'

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i

const EMPTY_CHILDREN = []

function transformPropsForRealTag (tagName, props) {
  let newProps = {}
  const DOMAttributeNamespaces = SVGPropertyConfig.DOMAttributeNamespaces
  for (let propName in props) {
    const propValue = props[propName]
    const originalPropName = propName
    const domAttributeName = SVGPropertyConfig.DOMAttributeNames[propName]
    propName = domAttributeName ? domAttributeName : propName
    if (DOMAttributeNamespaces.hasOwnProperty(originalPropName)
      && (isString(propValue) || isNumber(propValue) || isBoolean(propValue))) {
      const namespace = DOMAttributeNamespaces[originalPropName]
      newProps[propName] = !(propValue instanceof AttributeHook) ? new AttributeHook(namespace, propValue) : propValue
      continue
    }
    if ((propName === 'id' || propName === 'className' || propName === 'namespace')
      && propValue !== undefined) {
      newProps[propName] = propValue
      continue
    }
    if (propName === 'ref') {
      newProps[propName] = !(propValue instanceof RefHook) ? new RefHook(propValue) : propValue
      continue
    }
    if (propName === 'dangerouslySetInnerHTML') {
      newProps[propName] = !(propValue instanceof HtmlHook) ? new HtmlHook(propValue) : propValue
      continue
    }
    // 收集事件
    if (propName.charAt(0) === 'o' && propName.charAt(1) === 'n') {
      newProps[propName] = !(propValue instanceof EventHook) ? new EventHook(propName, propValue) : propValue
      continue
    }
    if (propName === 'defaultValue') {
      newProps.value = props.value || props.defaultValue
      continue
    }
    if (isBoolean(propValue)) {
      if (propValue) {
        newProps.attributes = newProps.attributes || {}
        newProps.attributes[propName] = propValue
      }
      newProps[propName] = propValue
      continue
    }
    if (propName === 'style') {
      if (isString(propValue)) {
        newProps.attributes = newProps.attributes || {}
        newProps.attributes[propName] = propValue
      } else if (isObject(propValue)) {
        for (let styleName in propValue) {
          let styleValue = propValue[styleName]
          if (styleValue !== undefined && (isString(styleValue) || !isNaN(styleValue))) {
            styleValue = isNumber(styleValue) && IS_NON_DIMENSIONAL.test(styleName) === false ? (styleValue + 'px') : styleValue
            newProps[propName] = newProps[propName] || {}
            newProps[propName][styleName] = styleValue
          }
        }
      }
      continue
    }
    if (/input|textarea/.test(tagName) && propName === 'value') {
      newProps[propName] = propValue
    }
    newProps.attributes = newProps.attributes || {}
    newProps.attributes[propName] = propValue
  }
  return newProps
}

function transformPropsForComponent (props) {
  let newProps = {}
  for (let propName in props) {
    let propValue = props[propName]
    newProps[propName] = propValue
  }
  return newProps
}

function createElement (tagName, properties) {
  let children = EMPTY_CHILDREN
  for (let i = 2, len = arguments.length; i < len; i++) {
    const argumentsItem = arguments[i]
    if (Array.isArray(argumentsItem)) {
      argumentsItem.forEach(item => {
        if (children === EMPTY_CHILDREN) {
          children = [item]
        } else {
          children.push(item)
        }
      })
    } else if (children === EMPTY_CHILDREN) {
      children = [argumentsItem]
    } else {
      children.push(argumentsItem)
    }
  }
  let props
  if (isString(tagName)) {
    props = transformPropsForRealTag(tagName, properties)
    props.owner = CurrentOwner.current
    return h(tagName, props, children)
  } else if (isFunction(tagName)) {
    props = transformPropsForComponent(properties)
    props.children = children
    props.owner = CurrentOwner.current
    return (tagName.prototype && tagName.prototype.render) ?
      new FullComponent(tagName, props) :
      new StatelessComponent(tagName, props)
  }
  return tagName
}

export default createElement
