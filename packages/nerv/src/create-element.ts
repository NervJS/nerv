import h from './vdom/h'
import { isFunction, isString, isNumber, isBoolean, supportSVG } from 'nerv-utils'
import SVGPropertyConfig from './vdom/svg-property-config'
import FullComponent from './full-component'
import StatelessComponent from './stateless-component'
import CurrentOwner from './current-owner'
import {
  Props,
  Component,
  VNode,
  VirtualChildren,
  EMPTY_CHILDREN
} from 'nerv-shared'

const isSupportSVG = supportSVG()
const DOMAttributeNamespaces = SVGPropertyConfig.DOMAttributeNamespaces

function transformPropsForRealTag (type: string, props: Props) {
  const newProps: Props = {}
  for (let propName in props) {
    const propValue = props[propName]
    if (propName === 'defaultValue') {
      newProps.value = props.value || props.defaultValue
      continue
    }
    if (DOMAttributeNamespaces.hasOwnProperty(propName)
      && (isString(propValue) || isNumber(propValue) || isBoolean(propValue))) {
      const originalPropName = propName
      const domAttributeName = SVGPropertyConfig.DOMAttributeNames[propName]
      propName = domAttributeName || propName
      const namespace = DOMAttributeNamespaces[originalPropName]
      newProps[propName] = isSupportSVG ? {
        namespace,
        value: propValue
      } : propValue
      continue
    }
    newProps[propName] = propValue
  }
  return newProps
}

/**
 *
 * @param props
 * @param defaultProps
 * defaultProps should respect null but ignore undefined
 * @see: https://facebook.github.io/react/docs/react-component.html#defaultprops
 */
function transformPropsForComponent (props: Props, defaultProps?: Props) {
  const newProps: any = {}
  for (const propName in props) {
    const propValue = props[propName]
    newProps[propName] = propValue
  }
  if (defaultProps) {
    for (const propName in defaultProps) {
      if (newProps[propName] === undefined) {
        newProps[propName] = defaultProps[propName]
      }
    }
  }
  return newProps
}

function createElement<T> (
  type: string | Function | Component<any, any>,
  properties?: T & Props | null,
  ..._children: Array<VirtualChildren | null>
) {
  let children: any = _children
  if (_children) {
    if (_children.length === 1) {
      children = _children[0]
    } else if (_children.length === 0) {
      children = undefined
    }
  }
  let props
  if (isString(type)) {
    props = transformPropsForRealTag(type, properties as Props)
    props.owner = CurrentOwner.current
    return h(type, props, children as any) as VNode
  } else if (isFunction(type)) {
    props = transformPropsForComponent(
      properties as any,
      (type as any).defaultProps
    )
    if (!props.children) {
      props.children = children || EMPTY_CHILDREN
    }
    props.owner = CurrentOwner.current
    return type.prototype && type.prototype.render
      ? new FullComponent(type, props)
      : new StatelessComponent(type, props)
  }
  return type
}

export default createElement
