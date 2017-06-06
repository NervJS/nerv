import { isVNode, isVText, isWidget, isHook } from './vnode/types'
import { isObject } from '~'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

function createElement (vnode, isSvg) {
  const doc = document
  if (isWidget(vnode)) {
    return vnode.init()
  }
  if (isVText(vnode)) {
    return doc.createTextNode(vnode.text)
  }
  if (isVNode(vnode)) {
    isSvg = vnode.tagName === 'svg' ? true : vnode.tagName === 'foreignObject' ? false : isSvg
    if (isSvg) {
      vnode.namespace = SVG_NAMESPACE
    }
    const domNode = (vnode.namespace === null) ? doc.createElement(vnode.tagName)
      : doc.createElementNS(vnode.namespace, vnode.tagName)
    setProps(domNode, vnode.properties)
    const children = vnode.children
    if (children.length) {
      children.forEach(child => domNode.appendChild(createElement(child, isSvg)))
    }
    return domNode
  }
  if (Array.isArray(vnode)) {
    const domNode = doc.createDocumentFragment()
    vnode.forEach(child => {
      if (child !== undefined && child !== null && child !== false) {
        return domNode.appendChild(createElement(child, isSvg))
      }
    })
    return domNode
  }
  return null
}

function setProps (domNode, props) {
  for (let p in props) {
    let propValue = props[p]
    if (isHook(propValue)) {
      if (propValue.hook) {
        propValue.hook(domNode, p)
      }
    } else if (isObject(propValue)) {
      if (p === 'attributes') {
        for (let k in propValue) {
          let attrValue = propValue[k]
          if (attrValue !== undefined) {
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
    } else {
      domNode[p] = propValue
    }
  }
}

export default createElement