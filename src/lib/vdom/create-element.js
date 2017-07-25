import { isVNode, isVText, isWidget, isStateLess, isHook } from './vnode/types'
import { isObject, isString, isNumber } from '~'

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
    setProps(domNode, vnode.props)
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

function setProps (domNode, props) {
  for (let p in props) {
    if (p === 'children') {
      continue
    }
    let propValue = props[p]
    if (isHook(propValue)) {
      if (propValue.hook) {
        propValue.hook(domNode, p)
      }
    } else if (isObject(propValue)) {
      if (p === 'attributes') {
        for (let k in propValue) {
          let attrValue = propValue[k]
          if (attrValue !== undefined && attrValue !== null && domNode.setAttribute) {
            domNode.setAttribute(k, attrValue)
          }
        }
      } else if (p === 'style') {
        for (let s in propValue) {
          let styleValue = propValue[s]
          if (styleValue !== undefined) {
            try {
              domNode[p][s] = styleValue
            } catch (err) {}
          }
        }
      }
    } else if (p in domNode) {
      domNode[p] = propValue
    }
  }
}

export default createElement
