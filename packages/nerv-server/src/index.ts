// tslint:disable-next-line:max-line-length
import {
  isVNode,
  isVText,
  isNullOrUndef,
  isInvalid,
  isComposite
} from 'nerv-shared'
import { isString, isNumber, isFunction, isArray, clone, extend } from 'nerv-utils'
import { Component, renderComponent } from 'nervjs'
import {
  encodeEntities,
  isVoidElements,
  getCssPropertyName,
  isUnitlessNumber
} from './utils'

const skipAttributes = {
  ref: true,
  key: true,
  children: true,
  owner: true
}

function hashToClassName (obj) {
  const arr: string[] = []
  for (const i in obj) {
    if (obj[i]) {
      arr.push(i)
    }
  }
  return arr.join(' ')
}

function renderStylesToString (styles: string | object): string {
  if (isString(styles)) {
    return styles
  } else {
    let renderedString = ''
    for (const styleName in styles) {
      const value = styles[styleName]

      if (isString(value)) {
        renderedString += `${getCssPropertyName(styleName)}${value};`
      } else if (isNumber(value)) {
        renderedString += `${getCssPropertyName(
          styleName
        )}${value}${isUnitlessNumber[styleName] ? '' : 'px'};`
      }
    }
    return renderedString
  }
}

function renderVNodeToString (vnode, parent, context, isSvg?: boolean) {
  if (isInvalid(vnode)) {
    return ''
  }
  const { type, props, children } = vnode
  if (isVText(vnode)) {
    return encodeEntities(vnode.text)
  } else if (isVNode(vnode)) {
    let renderedString = `<${type}`
    let html
    if (!isNullOrUndef(props)) {
      for (let prop in props) {
        const value = props[prop]
        if (skipAttributes[prop]) {
          continue
        }
        if (prop === 'dangerouslySetInnerHTML') {
          html = value.__html
        } else if (prop === 'style') {
          const styleStr = renderStylesToString(value)
          renderedString += styleStr ? ` style="${renderStylesToString(value)}"` : ''
        } else if (prop === 'class' || prop === 'className') {
          renderedString += ` class="${isString(value)
            ? value
            : hashToClassName(value)}"`
        } else if (prop === 'defaultValue') {
          if (!props.value) {
            renderedString += ` value="${encodeEntities(value)}"`
          }
        } else if (prop === 'defaultChecked') {
          if (!props.checked) {
            renderedString += ` checked="${value}"`
          }
        } else if (isSvg && prop.match(/^xlink\:?(.+)/)) {
          prop = prop.toLowerCase().replace(/^xlink\:?(.+)/, 'xlink:$1')
          renderedString += ` ${prop}="${encodeEntities(value)}"`
        } else {
          if (isString(value)) {
            renderedString += ` ${prop}="${encodeEntities(value)}"`
          } else if (isNumber(value)) {
            renderedString += ` ${prop}="${value}"`
          } else if (value === true) {
            renderedString += ` ${prop}`
          }
        }
      }
    }
    if (isVoidElements[type]) {
      renderedString += `/>`
    } else {
      renderedString += `>`
      if (html) {
        renderedString += html
      } else if (!isInvalid(children)) {
        if (isString(children)) {
          renderedString += children === '' ? ' ' : encodeEntities(children)
        } else if (isNumber(children)) {
          renderedString += children + ''
        } else if (isArray(children)) {
          for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i]
            if (isString(child)) {
              renderedString += child === '' ? ' ' : encodeEntities(child)
            } else if (isNumber(child)) {
              renderedString += child
            } else if (!isInvalid(child)) {
              isSvg = type === 'svg' ? true : type === 'foreignObject' ? false : isSvg
              renderedString += renderVNodeToString(
                child,
                vnode,
                context,
                isSvg
              )
            }
          }
        } else {
          isSvg = type === 'svg' ? true : type === 'foreignObject' ? false : isSvg
          renderedString += renderVNodeToString(children, vnode, context, isSvg)
        }
      }
      if (!isVoidElements[type]) {
        renderedString += `</${type}>`
      }
    }
    return renderedString
  } else if (isComposite(vnode)) {
    let instance
    if (vnode.type.prototype && vnode.type.prototype.render) {
      instance = new type(props, context)
    } else {
      instance = new Component(props, context)
      instance.render = () => type.call(instance, instance.props, instance.context)
    }
    instance._disable = true
    instance.props = props
    instance.context = context
    if (isFunction(instance.componentWillMount)) {
      instance.componentWillMount()
      instance.state = instance.getState()
    }
    const rendered = renderComponent(instance)
    if (isFunction(instance.getChildContext)) {
      context = extend(clone(context), instance.getChildContext())
    }
    return renderVNodeToString(rendered, vnode, context, isSvg)
  }
}

export function renderToString (input: any): string {
  return renderVNodeToString(input, {}, {}) as string
}

export function renderToStaticMarkup (input: any): string {
  return renderVNodeToString(input, {}, {}) as string
}
