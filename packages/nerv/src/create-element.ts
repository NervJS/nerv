import h from './vdom/h'
import {
  isFunction,
  isString,
  isArray,
  isAttrAnEvent
} from 'nerv-utils'
import FullComponent from './full-component'
import StatelessComponent from './stateless-component'
import CurrentOwner from './current-owner'
import EventHook from './hooks/event-hook'
import { Props, Component, VNode, VirtualChildren } from 'nerv-shared'

const EMPTY_CHILDREN = []

function transformPropsForRealTag (type: string, props: Props) {
  const newProps: any = {}
  for (let propName in props) {
    const propValue = props[propName]
    propName = propName
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

function createElement<T> (
  type: string | Function | Component<any, any>,
  properties?: T & Props | null,
  ..._children: Array<VirtualChildren | null>
)
function createElement<T> (
  type: string | Function | Component<any, any>,
  properties?: T & Props | null
) {
  let children: any[] = EMPTY_CHILDREN
  for (let i = 2, len = arguments.length; i < len; i++) {
    const argumentsItem = arguments[i]
    if (isArray(argumentsItem)) {
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
  if (isString(type)) {
    props = transformPropsForRealTag(type, properties as Props)
    props.owner = CurrentOwner.current
    return h(type, props, children as any) as VNode
  } else if (isFunction(type)) {
    props = transformPropsForComponent(
      properties as any,
      (type as any).defaultProps
    )
    if (props.children) {
      if (!isArray(props.children)) {
        props.children = [props.children]
      }
    } else {
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
