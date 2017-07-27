import { isVNode, isVText, isWidget, isStateLess, isHook } from './vnode/types'
import { isObject, isString, isNumber, isFunction } from '~'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const doc = document
function createElement (vnode, isSvg) {
  if (isWidget(vnode) || isStateLess(vnode)) {
    return vnode.init()
  }
  if (isString(vnode) || isNumber(vnode)) {
    return doc.createTextNode(vnode)
  }
  if (isVText(vnode)) {
    return doc.createTextNode(vnode.text)
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
      children.forEach(child => {
        if (child !== undefined && child !== null && child !== false && domNode.appendChild) {
          if (isWidget(child)) {
            child.parentContext = vnode.parentContext || {}
          }
          domNode.appendChild(createElement(child, isSvg))
        }
      })
    }
    return domNode
  }
  if (Array.isArray(vnode)) {
    const domNode = doc.createDocumentFragment()
    vnode.forEach(child => {
      if (child !== undefined && child !== null && child !== false && domNode.appendChild) {
        return domNode.appendChild(createElement(child, isSvg))
      }
    })
    return domNode
  }
  return null
}

function setProps (domNode, props, isSvg) {
  for (let p in props) {
    if (p === 'children') {
      continue
    }
    let propValue = props[p]
    if (isHook(propValue)) {
      if (propValue.hook) {
        propValue.hook(domNode, p)
      }
      continue
    } else if (p === 'style') {
      if (isString(propValue)) {
        domNode.setAttribute(p, propValue)
      } else if (isObject(propValue)) {
        for (let s in propValue) {
          let styleValue = propValue[s]
          if (styleValue !== undefined) {
            try {
              domNode[p][s] = styleValue
            } catch (err) {}
          }
        }
      }
      continue
    } else if (isObject(propValue)) {
      if (p in domNode) {
        try {
          domNode[p] = propValue
        } catch (err) {}
      } else {
        domNode.setAttribute(p, propValue)
      }
      continue
    } else if (p !== 'list' && p !== 'type' && !isSvg && p in domNode) {
      try {
        domNode[p] = propValue == null ? '' : propValue
      } catch (err) {}
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
