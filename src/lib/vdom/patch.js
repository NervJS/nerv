import VPatch from './vpatch'
import { isArray, isFunction, isString, isObject, getPrototype } from '~'
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
  if (!isArray(patch)) {
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
    case VPatch.THUNK:
      return replaceRoot(domNode, patch(domNode, patchObj))
    case VPatch.WIDGET:
      return patchWidget(domNode, oldVNode, patchObj)
    case VPatch.PROPS:
      return patchProperties(domNode, patchObj, oldVNode.properties)
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

function replaceRoot (oldRoot, newRoot) {
  if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild(newRoot, oldRoot)
  }

  return newRoot
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
  let parentNode = domNode.parentNode
  if (parentNode && domNode !== newNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  if (!isUpdate && vnode) {
    destroyWidget(domNode, vnode)
  }
  return newNode
}

function destroyWidget (domNode, widget) {
  if (isFunction(widget.destroy) && isWidget(widget)) {
    widget.destroy(domNode)
  }
}

function patchProperties (domNode, patch, previousProps) {
  for (let propName in patch) {
    let propValue = patch[propName]
    let previousValue = previousProps[propName]
    if (propValue === undefined || isHook(propValue)) {
      if (isHook(previousValue) && previousValue.unhook) {
        previousValue.unhook(domNode, propName)
      } else if (propName === 'attributes') {
        for (let attrName in previousValue) {
          domNode.removeAttribute(attrName)
        }
      } else if (propName === 'style') {
        for (let styleName in previousValue) {
          domNode.style[styleName] = ''
        }
      } else if (isString(previousValue)) {
        domNode[propName] = ''
      } else {
        domNode[propName] = null
      }
      if (propValue && propValue.hook) {
        propValue.hook(domNode, propName, previousValue)
      }
    } else if (propName === 'attributes') {
      for (let attrName in propValue) {
        let attrValue = propValue[attrName]
        if (attrValue === undefined) {
          domNode.removeAttribute(attrName)
        } else {
          domNode.setAttribute(attrName, attrValue)
        }
      }
    } else if (propName === 'style') {
      for (let styleName in propValue) {
        let styleValue = propValue[styleName]
        if (styleValue !== undefined) {
          try {
            domNode[propName][styleName] = styleValue
          } catch (err) {}
        }
      }
    } else if (isObject(propValue)) {
      if (previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        domNode[propName] = propValue
      }
    } else {
      domNode[propName] = propValue
    }
  }
  return domNode
}

function patchOrder (domNode, patch) {
  let moves = patch.moves
  let childNodes = domNode.childNodes
  let childNodesList = [].slice.call(childNodes, 0)
  let cache = {}
  childNodesList.forEach(child => {
    if (child.nodeType === 1) {
      let key = child.getAttribute('key')
      if (key) {
        cache[key] = child
      }
    }
  })

  moves.forEach(move => {
    let index = move.index
    if (move.type === 'remove') {
      if (childNodesList[index] === childNodes[index]) {
        domNode.removeChild(childNodesList[index])
      }
      childNodesList.splice(index, 1)
    } else {
      let insertNode
      let key = move.item.key
      if (key && cache[key]) {
        insertNode = cache[key]
      } else {
        insertNode = createElement(move.item)
      }
      childNodesList.splice(index, 0, insertNode)
      domNode.insertBefore(insertNode, domNode.childNodes[index] || null)
    }
  })
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
    if ('name' in a && 'name' in b) {
      return a.name === b.name
    }
    return a.init === b.init
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