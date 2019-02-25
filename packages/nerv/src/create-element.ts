import h from './vdom/h'
import { isFunction, isString, isUndefined, doc } from 'nerv-utils'
import FullComponent from './full-component'
import {NervProviderWrapper as NervProvider, NervConsumerWrapper as NervConsumer, NervProviderConsumerElement} from './vdom/create-context'
import { SuspenseComponent } from './vdom/suspense'
import { MemoComponentWrapper as MemoComponent } from './vdom/memo'
import StatelessComponent from './stateless-component'
import { LazyComponentWrapper as LazyComponent } from './vdom/lazy'
import CurrentOwner from './current-owner'
import {
  Props,
  Component,
  VNode,
  VirtualChildren,
  EMPTY_CHILDREN,
  ForwardRefComponent,
  Suspense
} from 'nerv-shared'
import SVGPropertyConfig from './vdom/svg-property-config'
import { isObject } from 'util';
import { VType } from '../../nerv-shared/src'
function transformPropsForRealTag (type: string, props: Props) {
  const newProps: Props = {}
  for (const propName in props) {
    const propValue = props[propName]
    if (propName === 'defaultValue') {
      newProps.value = props.value || props.defaultValue
      continue
    }
    const svgPropName = SVGPropertyConfig.DOMAttributeNames[propName]
    if (svgPropName && svgPropName !== propName) {
      newProps[svgPropName] = propValue
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
      if (isUndefined(newProps[propName])) {
        newProps[propName] = defaultProps[propName]
      }
    }
  }
  return newProps
}

function createElement<T> (
  type: string | Function | Component<any, any> | NervProviderConsumerElement | Suspense,  
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
  console.log('zheli', type)
  if (isString(type)) {
    props = transformPropsForRealTag(type, properties as Props)
    props.owner = CurrentOwner.current
    return h(type, props, children as any) as VNode
  } else if (isFunction(type)) {

    props = transformPropsForComponent(
      properties as any,
      (type as any).defaultProps
    )
    if (!props.children || props.children === EMPTY_CHILDREN) {
      props.children = children || children === 0 ? children : EMPTY_CHILDREN
    }
   
    props.owner = CurrentOwner.current
    return type.prototype && type.prototype.render
      ? new FullComponent(type, props)
      : new StatelessComponent(type, props)
  } else if(isObject(type)) {
    console.log('type here', type, VType.LazyComponent)
    props = transformPropsForComponent(
      properties as any,
      (type as any).defaultProps
    )
    switch(type.vtype) {
      case VType.NervProvider:  
        (type as NervProvider).name = 'NervProvider'
        if (!props.children || props.children === EMPTY_CHILDREN) {
          props.children = children || children === 0 ? children : EMPTY_CHILDREN
        }
        type['_context']['contextValue'] = props['value']
        return new NervProvider(type, props)
      case VType.NervConsumer:  
        (type as NervConsumer).name = 'NervConsumer'
        if (!props.children || props.children === EMPTY_CHILDREN) {
          if(children && isFunction(children)) {
            let contextValue = type['_context']['contextValue']
            let consumerStateless = children(contextValue)
            children = consumerStateless
          }
          props.children = children || children === 0 ? children : EMPTY_CHILDREN
        }
        return new NervConsumer(type, props)
      case VType.ForwardRefComponent:
        if (!props.children || props.children === EMPTY_CHILDREN) {
          props.children = children || children === 0 ? children : EMPTY_CHILDREN
        }
        let render = (type as ForwardRefComponent).render;
        let ref = props.ref // todo: should address different type of ref , string or function type of ref may cause exception
        let element = render && render(props, ref)
        return element;
      case VType.MemoComponent:
        if (!props.children || props.children === EMPTY_CHILDREN) {
          props.children = children || children === 0 ? children : EMPTY_CHILDREN
        }
        return new MemoComponent(type, props);
      case VType.LazyComponent:
        if (!props.children || props.children === EMPTY_CHILDREN) {
          props.children = children || children === 0 ? children : EMPTY_CHILDREN
        }
        let lazyComponent =  new LazyComponent(type, props)
        lazyComponent.readLazyComponent(type)
        return doc.createDocumentFragment() // todo: return lazyComponent
        // console.log('component lazyyy', component)
        // break;
      case VType.Suspense:
          (type as Suspense).name = 'SuspenseComponent'
          let suspenseComponent =  new SuspenseComponent(type, props);
          (type as Suspense).lazyComponent.SuspenseComponent = suspenseComponent
          return suspenseComponent
    }
    props.owner = CurrentOwner.current
  }
  return type
}

export default createElement
