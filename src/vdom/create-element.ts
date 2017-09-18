import { isVNode, isVText, isWidget, isStateLess, isHook } from './vnode/types'
import { isObject, isString, isNumber, isFunction } from '../util'
import { VirtualNode, IProps } from '../types'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const doc = document
function createElement (vnode: VirtualNode, isSvg?: boolean): Element | Text | Comment | DocumentFragment | null {
  if (isWidget(vnode) || isStateLess(vnode)) {
    return vnode.init()
  }
  if (isString(vnode) || isNumber(vnode)) {
    return doc.createTextNode(vnode as string)
  }
  if (isVText(vnode)) {
    return doc.createTextNode(vnode.text as string)
  }
  if (vnode === null || (vnode as any) === false) {
    return doc.createComment('Empty dom node')
  }
  if (isVNode(vnode)) {
    if (vnode.isSvg) {
      isSvg = true
    } else if (vnode.tagName === 'svg') {
      isSvg = true
    } else if (vnode.tagName === 'foreignObject') {
      isSvg = false
    }
    if (isSvg) {
      vnode.namespace = SVG_NAMESPACE
    }
    const domNode = (vnode.namespace === null) ? doc.createElement(vnode.tagName)
      : doc.createElementNS ? doc.createElementNS(vnode.namespace, vnode.tagName) : doc.createElement(vnode.tagName)
    setProps(domNode, vnode.props, isSvg)
    if (isSvg) {
      vnode.isSvg = isSvg
    }
    const children = vnode.children
    if (children.length) {
      children.forEach((child) => {
        if (child !== undefined && child !== null && (child as any) !== false && domNode.appendChild) {
          if (isWidget(child)) {
            child.parentContext = vnode.parentContext || {}
          }
          const childNode = createElement(child, isSvg)
          if (childNode) {
            domNode.appendChild(childNode)
          }
        }
      })
    }
    return domNode
  }
  if (Array.isArray(vnode)) {
    const domNode = doc.createDocumentFragment()
    vnode.forEach((child) => {
      if (child !== undefined && child !== null && (child as any) !== false && domNode.appendChild) {
        const childNode = createElement(child, isSvg)
        if (childNode) {
          domNode.appendChild(childNode)
        }
        return domNode.appendChild(childNode as Element)
      }
    })
    return domNode
  }
  return null
}

function setProps (domNode: Element, props: IProps, isSvg?: boolean) {
  for (const p in props) {
    if (p === 'children') {
      continue
    }
    const propValue = props[p]
    if (isHook(propValue)) {
      if (propValue.hook) {
        propValue.hook(domNode, p)
      }
      continue
    } else if (p === 'style') {
      if (isString(propValue)) {
        domNode.setAttribute(p, propValue)
      } else if (isObject(propValue)) {
        // tslint:disable-next-line:forin
        for (const s in propValue) {
          const styleValue = propValue[s]
          if (styleValue !== undefined) {
            try {
              domNode[p][s] = styleValue
            } catch (err) {
              console.warn(`Can't set empty style`)
            }
          }
        }
      }
      continue
    } else if (isObject(propValue)) {
      if (p in domNode) {
        try {
          domNode[p] = propValue
        } catch (err) {
          console.warn('set prop failed, prop value:', propValue)
        }
      } else {
        domNode.setAttribute(p, propValue)
      }
      continue
    } else if (p !== 'list' && p !== 'type' && !isSvg && p in domNode) {
      try {
        domNode[p] = propValue == null ? '' : propValue
      } catch (err) {
        console.warn('set prop failed, prop value:', propValue)
      }
      if (propValue == null || propValue === false) {
        domNode.removeAttribute(p)
      }
      continue
    } else {
      if (propValue == null || propValue === false) {
        domNode.removeAttribute(p)
      } else {
        if (!isFunction(propValue)) {
          domNode.setAttribute(p, propValue)
        }
      }
    }
  }
}

export default createElement
