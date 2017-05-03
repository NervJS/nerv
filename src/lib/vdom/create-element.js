import { isVNode, isVText, isWidget, isHook } from './vnode/types'
import handleThunk from './vnode/handle-thunk'
import { isObject } from '~'

function createElement (vnode) {
  const doc = document
  vnode = handleThunk(vnode).a
  if (isWidget(vnode)) {
    return vnode.init()
  }
  if (isVText(vnode)) {
    return doc.createTextNode(vnode.text)
  }
  if (isVNode(vnode)) {
    const domNode = doc.createElement(vnode.tagName)
    setProps(domNode, vnode.properties)
    const children = vnode.children
    if (children.length) {
      children.forEach(child => domNode.appendChild(createElement(child)))
    }
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
            domNode[p][s] = styleValue
          }
        }
      }
    } else {
      domNode[p] = propValue
    }
  }
}

export default createElement