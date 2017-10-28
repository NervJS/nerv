/* tslint:disable: no-shadowed-variable*/
/* tslint:disable: no-empty*/

import VPatch from './vpatch'
import { isFunction, isString, isObject, getPrototype } from 'nerv-utils'
import domIndex from './dom-index'
import createElement from './create-element'
import VText from './vnode/vtext'
import { Props, VirtualNode, VNode, PatchOrder, isWidget, isHook, isVNode, CompositeComponent } from 'nerv-shared'
// import CompositeComponent from '../full-component'

function patch (rootNode: Element, patches, parentContext?: any) {
  const patchIndices = getPatchIndices(patches)
  if (patchIndices.length === 0) {
    return rootNode
  }
  const oldTree = patches.old
  const nodes = domIndex(rootNode, oldTree, patchIndices)
  patchIndices.forEach((index) => {
    rootNode = applyPatch(rootNode, nodes[index], patches[index], parentContext)
  })
  return rootNode
}

function applyPatch (rootNode: Element, domNode: Element, patch: VirtualNode | VirtualNode[], parentContext?: any) {
  if (!domNode) {
    return rootNode
  }
  let newNode
  if (!Array.isArray(patch)) {
    patch = [patch]
  }
  (patch as VirtualNode[]).forEach((patchItem) => {
    newNode = patchSingle(domNode, patchItem as any, parentContext)
    if (domNode === rootNode) {
      rootNode = newNode
    }
  })
  return rootNode
}

function patchSingle (domNode: Element, vpatch: VPatch, parentContext?: any) {
  const type = vpatch.type
  const oldVNode = vpatch.vnode
  const patchObj = vpatch.patch

  switch (type) {
    case VPatch.VTEXT:
      return patchVText(domNode as any, patchObj as any)
    case VPatch.VNODE:
      return patchVNode(domNode, patchObj as VNode, parentContext)
    case VPatch.INSERT:
      return patchInsert(domNode, patchObj as VirtualNode, parentContext)
    case VPatch.WIDGET:
      return patchWidget(domNode, oldVNode as CompositeComponent, patchObj as CompositeComponent)
    case VPatch.PROPS:
      return patchProps(domNode, patchObj as Props, (oldVNode as VNode).props, (oldVNode as VNode).isSvg)
    case VPatch.ORDER:
      return patchOrder(domNode, patchObj as PatchOrder)
    case VPatch.REMOVE:
      return patchRemove(domNode, oldVNode as any)
    default:
      return domNode
  }
}

function patchVText (domNode: Text, patch: VirtualNode) {
  if (domNode === null) {
    return createElement(patch)
  }
  if (domNode.splitText !== undefined) {
    domNode.nodeValue = (patch as VText).text as string
    return domNode
  }
  const parentNode = domNode.parentNode
  const newNode = createElement(patch)
  if (parentNode) {
    parentNode.replaceChild(newNode as Element, domNode)
  }
  return newNode
}

function patchVNode (domNode: Element, patch: VirtualNode, parentContext) {
  if (isWidget(patch) || isVNode(patch)) {
    patch.parentContext = parentContext
  }
  if (domNode === null) {
    return createElement(patch)
  }
  const parentNode = domNode.parentNode
  const newNode = createElement(patch)
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode as Element, domNode)
  }
  return newNode
}

function patchInsert (parentNode: Element, vnode: VirtualNode, parentContext?: any) {
  if (isWidget(vnode) || isVNode(vnode)) {
    vnode.parentContext = parentContext
  }
  const newNode = createElement(vnode)
  if (parentNode && newNode) {
    parentNode.appendChild(newNode)
  }
  return parentNode
}

function patchWidget (domNode: Element, vnode: CompositeComponent, patch: CompositeComponent) {
  const isUpdate = isUpdateWidget(vnode, patch)
  if (vnode) {
    patch.parentContext = vnode.parentContext
  }
  const newNode = isUpdate
    ? (patch as CompositeComponent).update(vnode, patch, domNode) || domNode
    : createElement(patch)
  const parentNode = domNode.parentNode // @TODO: perf
  if (parentNode && domNode !== newNode) {
    parentNode.replaceChild(newNode as Node, domNode)
  }
  if (!isUpdate && vnode) {
    destroyWidget(domNode, vnode)
  }
  return newNode
}

function destroyWidget (domNode: Element, widget) {
  if (isFunction(widget.destroy) && isWidget(widget)) {
    widget.destroy(domNode)
  }
}

function patchProps (domNode: Element, patch: Props, previousProps: Props, isSvg?: boolean) {
  for (const propName in patch) {
    if (propName === 'children') {
      continue
    }
    const propValue = patch[propName]
    const previousValue = previousProps[propName]
    if (propValue == null || propValue === false) {
      if (isHook(previousValue) && previousValue.unhook) {
        previousValue.unhook(domNode, propName, propValue)
        continue
      } else if (propName === 'style') {
        if (isString(previousValue)) {
          // tslint:disable-next-line:forin
          // FIX: previousValue is not iterable
          // for (const styleName in previousValue) {
          //   domNode.style[styleName] = ''
          // }
        } else {
          domNode.removeAttribute(propName)
        }
        continue
      } else if (propName in domNode) {
        domNode[propName] = isString(previousValue) ? '' : null
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
          // tslint:disable-next-line:forin
          for (const styleName in propValue) {
            const styleValue = propValue[styleName]
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

function patchOrder (domNode: Element, patch: PatchOrder) {
  const { removes, inserts } = patch
  const childNodes = domNode.childNodes
  const keyMap = {}
  let node, remove, insert
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

function patchRemove (domNode: Element, vnode: VirtualNode) {
  const parentNode = domNode.parentNode
  if (parentNode) {
    parentNode.removeChild(domNode)
  }
  if (isWidget(vnode)) {
    destroyWidget(domNode, vnode)
  }
  return null
}

function isUpdateWidget (a: VirtualNode, b: VirtualNode) {
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

// @todo: perf
function getPatchIndices (patches) {
  const indices: number[] = []
  if (patches) {
    for (const i in patches) {
      if (i !== 'old' && patches.hasOwnProperty(i)) {
        indices.push(Number(i))
      }
    }
  }
  return indices
}

export default patch
