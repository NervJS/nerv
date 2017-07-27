import VPatch from './vpatch'
import { isFunction, isString, isObject, getPrototype } from '~'
import shallowEqual from '~/shallow-equal'
import domIndex from './dom-index'
import { isWidget, isHook } from './vnode/types'
import createElement from './create-element'

function patch (rootNode, patches) {
  let patchIndices = getPatchIndices(patches)
  if (patchIndices.length === 0) {
    return rootNode
  }
  let oldTree = patches.old
  let nodes = domIndex(rootNode, oldTree, patchIndices)
  patchIndices.forEach(index => {
    rootNode = applyPatch(rootNode, nodes[index], patches[index])
  })
  return rootNode
}

function applyPatch (rootNode, domNode, patch) {
  if (!domNode) {
    return rootNode
  }
  let newNode
  if (!Array.isArray(patch)) {
    patch = [patch]
  }
  patch.forEach(patchItem => {
    newNode = patchSingle(domNode, patchItem)
    if (domNode === rootNode) {
      rootNode = newNode
    }
  })
  return rootNode
}

function patchSingle (domNode, vpatch) {
  let type = vpatch.type
  let oldVNode = vpatch.vnode
  let patchObj = vpatch.patch

  switch (type) {
    case VPatch.VTEXT:
      return patchVText(domNode, patchObj)
    case VPatch.VNODE:
      return patchVNode(domNode, patchObj)
    case VPatch.INSERT:
      return patchInsert(domNode, patchObj)
    case VPatch.WIDGET:
      return patchWidget(domNode, oldVNode, patchObj)
    case VPatch.STATELESS:
      return patchStateLess(domNode, oldVNode, patchObj)
    case VPatch.PROPS:
      return patchProps(domNode, patchObj, oldVNode.props, oldVNode.isSvg)
    case VPatch.ORDER:
      return patchOrder(domNode, patchObj)
    case VPatch.REMOVE:
      return patchRemove(domNode, oldVNode)
    default:
      return domNode
  }
}

function patchVText (domNode, patch) {
  if (domNode === null) {
    return createElement(patch)
  }
  if (domNode.nodeType === 3) {
    if (domNode.textContent) {
      domNode.textContent = patch.text
    } else {
      domNode.nodeValue = patch.text
    }
    return domNode
  }
  let parentNode = domNode.parentNode
  let newNode = createElement(patch)
  if (parentNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  return newNode
}

function patchVNode (domNode, patch) {
  if (domNode === null) {
    return createElement(patch)
  }
  let parentNode = domNode.parentNode
  let newNode = createElement(patch)
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  return newNode
}

function patchInsert (parentNode, vnode) {
  let newNode = createElement(vnode)
  if (parentNode && newNode) {
    parentNode.appendChild(newNode)
  }
  return parentNode
}

function patchWidget (domNode, vnode, patch) {
  const isUpdate = isUpdateWidget(vnode, patch)
  let newNode
  if (isUpdate) {
    newNode = patch.update(vnode, domNode) || domNode
  } else {
    newNode = createElement(patch)
  }
  const parentNode = domNode.parentNode
  if (parentNode && domNode !== newNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  if (!isUpdate && vnode) {
    destroyWidget(domNode, vnode)
  }
  return newNode
}

function patchStateLess (domNode, vnode, patch) {
  const oldProps = vnode.props
  const newProps = patch.props
  if (shallowEqual(oldProps, newProps)) {
    return domNode
  }
  const newNode = createElement(patch)
  const parentNode = domNode.parentNode
  if (parentNode && domNode !== newNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  return newNode
}

function destroyWidget (domNode, widget) {
  if (isFunction(widget.destroy) && isWidget(widget)) {
    widget.destroy(domNode)
  }
}

function patchProps (domNode, patch, previousProps, isSvg) {
  for (let propName in patch) {
    if (propName === 'children') {
      continue
    }
    let propValue = patch[propName]
    let previousValue = previousProps[propName]
    if (propValue == null || propValue === false) {
      if (isHook(previousValue) && previousValue.unhook) {
        previousValue.unhook(domNode, propName, propValue)
        continue
      } else if (propName === 'style') {
        if (isString(previousValue)) {
          for (let styleName in previousValue) {
            domNode.style[styleName] = ''
          }
        } else {
          domNode.removeAttribute(propName)
        }
        continue
      } else if (propName in domNode) {
        if (isString(previousValue)) {
          domNode[propName] = ''
        } else {
          domNode[propName] = null
        }
        domNode.removeAttribute(propName)
      } else {
        domNode.removeAttribute(propName)
      }
    } else {
      if (isHook(propValue)) {
        if (isHook(previousValue) && previousValue.unhook) {
          previousValue.unhook(domNode, propName, propValue)
        }
        if (propValue && propValue.hook) {
          propValue.hook(domNode, propName, previousValue)
        }
        continue
      } else if (propName === 'style') {
        if (isString(propValue)) {
          domNode.setAttribute(propName, propValue)
        } else {
          for (let styleName in propValue) {
            let styleValue = propValue[styleName]
            if (styleValue != null && styleValue !== false) {
              try {
                domNode[propName][styleName] = styleValue
              } catch (err) {}
            }
          }
        }
        continue
      } else if (isObject(propValue)) {
        if (previousValue && isObject(previousValue) &&
          getPrototype(previousValue) !== getPrototype(propValue)) {
          if (propName in domNode) {
            try {
              domNode[propName] = propValue
            } catch (err) {}
          } else {
            domNode.setAttribute(propName, propValue)
          }
        }
        continue
      } else if (propName !== 'list' && propName !== 'type' && !isSvg && propName in domNode) {
        try {
          domNode[propName] = propValue
        } catch (err) {}
        continue
      } else if (!isFunction(propValue)) {
        domNode.setAttribute(propName, propValue)
      }
    }
  }
  return domNode
}

function patchOrder (domNode, patch) {
  let removes = patch.removes
  let inserts = patch.inserts
  let childNodes = domNode.childNodes
  let keyMap = {}
  let node
  let remove
  let insert
  for (let i = 0; i < removes.length; i++) {
    remove = removes[i]
    node = childNodes[remove.from]
    if (remove.key) {
      keyMap[remove.key] = node
    }
    domNode.removeChild(node)
  }

  let length = childNodes.length
  for (let j = 0; j < inserts.length; j++) {
    insert = inserts[j]
    node = keyMap[insert.key]
    domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
  }
  return domNode
}

function patchRemove (domNode, vnode) {
  let parentNode = domNode.parentNode
  if (parentNode) {
    parentNode.removeChild(domNode)
  }
  if (isWidget(vnode)) {
    destroyWidget(domNode, vnode)
  }
  return null
}

function isUpdateWidget (a, b) {
  if (isWidget(a) && isWidget(b)) {
    const keyA = a.props.key
    const keyB = b.props.key
    if ('name' in a && 'name' in b) {
      return a.name === b.name && keyA === keyB
    }
    return a.init === b.init && keyA === keyB
  }
  return false
}

function getPatchIndices (patches) {
  let indices = []
  if (patches) {
    for (let i in patches) {
      if (i !== 'old' && patches.hasOwnProperty(i)) {
        indices.push(Number(i))
      }
    }
  }
  return indices
}

export default patch
