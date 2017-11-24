import h from './vdom/h'
import {
  isFunction,
  isString,
  isArray,
  isAttrAnEvent,
  isNumber
} from 'nerv-utils'
import FullComponent from './full-component'
import StatelessComponent from './stateless-component'
import CurrentOwner from './current-owner'
import EventHook from './hooks/event-hook'
import createVText from './vdom/create-vtext'
import { Props, Component, VNode, VirtualChildren } from 'nerv-shared'

function transformPropsForRealTag (type: string, props: Props) {
  const newProps: Props = {}
  for (const propName in props) {
    const propValue = props[propName]
    if (isAttrAnEvent(propName)) {
      newProps[propName] = !(propValue instanceof EventHook)
        ? new EventHook(propName, propValue)
        : propValue
      continue
    }
    if (propName === 'defaultValue') {
      newProps.value = props.value || props.defaultValue
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

export function flattenChildren (children) {
  if (isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      return flattenChildren(children.filter(Boolean))
    }
  } else if (isString(children) || isNumber(children)) {
    return createVText(String(children))
  }
  return children
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
      props.children = children
    }
    props.owner = CurrentOwner.current
    return type.prototype && type.prototype.render
      ? new FullComponent(type, props)
      : new StatelessComponent(type, props)
  }
  return type
}

export default createElement
