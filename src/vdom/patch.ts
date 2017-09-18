/* tslint:disable: no-shadowed-variable*/
/* tslint:disable: no-empty*/

import VPatch from './vpatch'
import { isFunction, isString, isObject, getPrototype } from '../util'
import shallowEqual from '../util/shallow-equal'
import domIndex from './dom-index'
import { isWidget, isHook } from './vnode/types'
import createElement from './create-element'
import VText from './vnode/vtext'
import { IProps, VirtualNode, IVNode, PatchOrder } from '../types'
import Widget from '../full-component'
import Stateless from '../stateless-component'

function patch (rootNode: Element, patches) {
  const patchIndices = getPatchIndices(patches)
  if (patchIndices.length === 0) {
    return rootNode
  }
  const oldTree = patches.old
  const nodes = domIndex(rootNode, oldTree, patchIndices)
  patchIndices.forEach((index) => {
    rootNode = applyPatch(rootNode, nodes[index], patches[index])
  })
  return rootNode
}

function applyPatch (rootNode: Element, domNode: Element, patch: VirtualNode | VirtualNode[]) {
  if (!domNode) {
    return rootNode
  }
  let newNode
  if (!Array.isArray(patch)) {
    patch = [patch]
  }
  (patch as VirtualNode[]).forEach((patchItem) => {
    newNode = patchSingle(domNode, patchItem as any)
    if (domNode === rootNode) {
      rootNode = newNode
    }
  })
  return rootNode
}

function patchSingle (domNode: Element, vpatch: VPatch) {
  const type = vpatch.type
  const oldVNode = vpatch.vnode
  const patchObj = vpatch.patch

  switch (type) {
    case VPatch.VTEXT:
      return patchVText(domNode as any, patchObj as VText)
    case VPatch.VNODE:
      return patchVNode(domNode, patchObj as IVNode)
    case VPatch.INSERT:
      return patchInsert(domNode, patchObj as VirtualNode)
    case VPatch.WIDGET:
      return patchWidget(domNode, oldVNode as Widget, patchObj as Widget)
    case VPatch.STATELESS:
      return patchStateLess(domNode, oldVNode as Stateless, patchObj as Stateless)
    case VPatch.PROPS:
      return patchProps(domNode, patchObj as IProps, (oldVNode as IVNode).props, (oldVNode as IVNode).isSvg)
    case VPatch.ORDER:
      return patchOrder(domNode, patchObj as PatchOrder)
    case VPatch.REMOVE:
      return patchRemove(domNode, oldVNode)
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

function patchVNode (domNode: Element, patch: VirtualNode) {
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

function patchInsert (parentNode: Element, vnode: VirtualNode) {
  const newNode = createElement(vnode)
  if (parentNode && newNode) {
    parentNode.appendChild(newNode)
  }
  return parentNode
}

function patchWidget (domNode: Element, vnode: Widget, patch: Widget) {
  const isUpdate = isUpdateWidget(vnode, patch)
  const newNode = isUpdate
    ? (patch as Widget).update(vnode, domNode) || domNode
    : createElement(patch)
  const parentNode = domNode.parentNode
  if (parentNode && domNode !== newNode) {
    parentNode.replaceChild(newNode, domNode)
  }
  if (!isUpdate && vnode) {
    destroyWidget(domNode, vnode)
  }
  return newNode
}

function patchStateLess (domNode: Element, vnode: Stateless, patch: Stateless) {
  const oldProps = vnode.props
  const newProps = patch.props
  if (vnode.tagName === patch.tagName && shallowEqual(oldProps, newProps)) {
    return domNode
  }
  const newNode = createElement(patch)
  const parentNode = domNode.parentNode
  if (parentNode && domNode !== newNode) {
    parentNode.replaceChild(newNode as Element, domNode)
  }
  return newNode
}

function destroyWidget (domNode: Element, widget) {
  if (isFunction(widget.destroy) && isWidget(widget)) {
    widget.destroy(domNode)
  }
}

function patchProps (domNode: Element, patch: IProps, previousProps: IProps, isSvg?: boolean) {
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
