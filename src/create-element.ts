import h from './vdom/h'
import SVGPropertyConfig from './vdom/svg-property-config'
import { isFunction, isString, isNumber, isBoolean, isObject } from './util'
import FullComponent from './full-component'
import StatelessComponent from './stateless-component'
import CurrentOwner from './current-owner'
import RefHook from './hooks/ref-hook'
import HtmlHook from './hooks/html-hook'
import EventHook from './hooks/event-hook'
import AttributeHook from './hooks/attribute-hook'
import { IProps, VirtualChildren } from './types'
import Component from './component'
import VNode from './vdom/vnode/vnode'

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i

const EMPTY_CHILDREN = []

function transformPropsForRealTag (tagName: string, props: IProps) {
  const newProps: any = {}
  const DOMAttributeNamespaces = SVGPropertyConfig.DOMAttributeNamespaces
  for (let propName in props) {
    const propValue = props[propName]
    const originalPropName = propName
    const domAttributeName = SVGPropertyConfig.DOMAttributeNames[propName]
    propName = domAttributeName || propName
    if (DOMAttributeNamespaces.hasOwnProperty(originalPropName) &&
      (isString(propValue) || isNumber(propValue) || isBoolean(propValue))) {
      const namespace = DOMAttributeNamespaces[originalPropName]
      newProps[propName] = !((propValue as any) instanceof AttributeHook)
        ? new AttributeHook(namespace, propValue)
        : propValue
      continue
    }
    if ((propName === 'id' || propName === 'className' || propName === 'namespace') &&
      propValue !== undefined) {
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
    if (propName === 'style') {
      if (isString(propValue)) {
        newProps[propName] = propValue
      } else if (isObject(propValue)) {
        for (const styleName in propValue) {
          let styleValue = propValue[styleName]
          if (styleValue !== undefined && (isString(styleValue) || !isNaN(styleValue))) {
            styleValue = isNumber(styleValue) && IS_NON_DIMENSIONAL.test(styleName) === false
              ? (styleValue + 'px')
              : styleValue
            newProps[propName] = newProps[propName] || {}
            newProps[propName][styleName] = styleValue
          }
        }
      }
      continue
    }
    newProps[propName] = propValue
  }
  return newProps
}

function transformPropsForComponent (props: IProps) {
  const newProps: any = {}
  for (const propName in props) {
    const propValue = props[propName]
    newProps[propName] = propValue
  }
  return newProps
}

function createElement<T> (
  tagName: string | Function | Component<any, any>,
  properties?: T & IProps | null,
  ..._children: Array<VirtualChildren | null>
) {
  let children: any[] = EMPTY_CHILDREN
  for (let i = 2, len = arguments.length; i < len; i++) {
    const argumentsItem = arguments[i]
    if (Array.isArray(argumentsItem)) {
      argumentsItem.forEach((item) => {
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
    props = transformPropsForRealTag(tagName, properties as IProps)
    props.owner = CurrentOwner.current
    return h(tagName, props, children as any) as VNode
  } else if (isFunction(tagName)) {
    props = transformPropsForComponent(properties as any)
    if (props.children) {
      if (!Array.isArray(props.children)) {
        props.children = [props.children]
      }
    } else {
      props.children = children
    }
    props.owner = CurrentOwner.current
    return (tagName.prototype && tagName.prototype.render)
      ? new FullComponent(tagName, props)
      : new StatelessComponent(tagName, props)
  }
  return tagName
}

export default createElement
