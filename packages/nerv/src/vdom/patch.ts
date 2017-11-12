/* tslint:disable: no-shadowed-variable*/
/* tslint:disable: no-empty*/
import domIndex from './dom-index'
import VPatch from './vpatch'
import {
  isFunction,
  isString,
  isObject,
  getPrototype,
  isArray
} from 'nerv-utils'
import createElement from './create-element'
import {
  Props,
  VirtualNode,
  VNode,
  PatchOrder,
  isWidget,
  isHook,
  isVNode,
  CompositeComponent,
  VText,
  isVText,
  isInvalid,
  isNullOrUndef
} from 'nerv-shared'
import { VHook } from '../hooks/vhook'

export function patch2 (lastVnode, nextVnode, lastDom, context, isSVG: boolean) {
  if (lastVnode === nextVnode) {
    return lastDom
  }

  if (isSameVNode(lastVnode, nextVnode)) {
    let newDom
    if (isVText(nextVnode)) {
      newDom = patchVText(lastVnode, nextVnode)
    } else if (isVNode(nextVnode)) {
      patchProps(lastDom, nextVnode.props, lastVnode.props, isSVG)
    } else if (isWidget(nextVnode)) {
      newDom = nextVnode.update(lastVnode, nextVnode, lastDom)
    }
    (nextVnode as any).dom = newDom
  } else {
    const parentNode = lastDom.parentNode
    const nextSibling = lastDom.nextSibling
    unmount(lastVnode, parentNode)
    const newDom = createElement(nextVnode)
    if (parentNode !== null) {
      parentNode.insertBefore(newDom as Node, nextSibling)
    }
    nextVnode.dom = newDom
    return newDom
  }
}

export function patchChildren (
  parentDom,
  lastChildren,
  nextChildren,
  context,
  isSVG
) {
  const lastLength = lastChildren.length
  const nextLength = nextChildren.length
  if (lastLength === 0) {
    if (nextLength > 0) {
      const dom = createElement(nextChildren, isSVG)
      parentDom.appendChild(dom)
    }
  } else if (nextLength === 0) {
    unmountChildren(lastChildren, parentDom)
  } else {
    if (isKeyed(lastChildren, nextChildren)) {
    } else {
      patchNonKeyedChildren(parentDom, lastChildren, nextChildren, context, isSVG, lastLength, nextLength)
    }
  }
}

function patchNonKeyedChildren (
  parentDom,
  lastChildren,
  nextChildren,
  context,
  isSVG: boolean,
  lastLength: number,
  nextLength: number
) {
  const minLength = Math.min(lastLength, nextLength)
  let i = 0
  while (i < minLength) {
    patch2(lastChildren[i], nextChildren[i], parentDom, context, isSVG)
    i++
  }
  if (lastLength < nextLength) {
    for (i = minLength; i < lastLength; i++) {
      if (parentDom !== null) {
        parentDom.appendChild(createElement(nextChildren[i], isSVG))
      }
    }
  } else if (lastLength > nextLength) {
    for (i = minLength; i < lastLength; i++) {
      unmount(lastChildren[i], parentDom)
    }
  }
}

function isKeyed (a, b) {
  return !isInvalid(a) && !isInvalid(b) && a.key !== null && b.key !== null
}

export function unmountChildren (children, parentDom?) {
  const len = children.length
  if (len === 0) {
    return
  }
  for (let i = 0; i < len; i++) {
    unmount(children[i])
  }
}

export function unmount (vnode, parentDom?) {
  const dom = vnode.dom

  if (isWidget(vnode)) {
    vnode.destroy(parentDom)
  } else if (isVNode(vnode)) {
    const { hooks, children } = vnode
    unmountChildren(children)
    for (const name in hooks) {
      const hook = hooks[name]
      if (hook.vhook === VHook.Event) {
        hook.unhook()
      }
    }
  }

  if (!isNullOrUndef(parentDom)) {
    parentDom.removeChild(dom)
  }
}

function isSameVNode (a, b) {
  if (isInvalid(a) || isInvalid(b)) {
    return false
  }
  return a.tagName === b.tagName && getKey(a) === getKey(b)
}

function getKey (vnode) {
  return vnode.key || vnode.props.key
}

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

function applyPatch (
  rootNode: Element,
  domNode: Element,
  patch: VirtualNode | VirtualNode[],
  parentContext?: any
) {
  if (!domNode) {
    return rootNode
  }
  let newNode
  if (!isArray(patch)) {
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
      return patchWidget(
        domNode,
        oldVNode as CompositeComponent,
        patchObj as CompositeComponent
      )
    case VPatch.PROPS:
      return patchProps(
        domNode,
        patchObj as Props,
        (oldVNode as VNode).props,
        (oldVNode as VNode).isSvg
      )
    case VPatch.ORDER:
      return patchOrder(domNode, patchObj as PatchOrder)
    case VPatch.REMOVE:
      return patchRemove(domNode, oldVNode as any)
    default:
      return domNode
  }
}

function patchVText (lastVNode: VText, nextVNode: VText) {
  const dom = lastVNode.dom
  if (dom === null) {
    return
  }
  const nextText = nextVNode.text
  nextVNode.dom = dom

  if (lastVNode.text !== nextText) {
    dom.nodeValue = nextText as string
  }
  return dom
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
  if (parentNode !== null && newNode !== domNode) {
    parentNode.replaceChild(newNode as Element, domNode)
  }
  return newNode
}

function patchInsert (
  parentNode: Element,
  vnode: VirtualNode,
  parentContext?: any
) {
  if (isWidget(vnode) || isVNode(vnode)) {
    vnode.parentContext = parentContext
  }
  const newNode = createElement(vnode)
  if (parentNode !== null && newNode !== null) {
    parentNode.appendChild(newNode)
  }
  return parentNode
}

function patchWidget (
  domNode: Element,
  vnode: CompositeComponent,
  patch: CompositeComponent
) {
  const isUpdate = isUpdateWidget(vnode, patch)
  if (vnode) {
    patch.parentContext = vnode.parentContext
  }
  const newNode = isUpdate
    ? (patch as CompositeComponent).update(vnode, patch, domNode) || domNode
    : createElement(patch)
  const parentNode = domNode.parentNode // @TODO: perf
  if (parentNode !== null && domNode !== newNode) {
    parentNode.replaceChild(newNode as Node, domNode)
  }
  if (!isUpdate && vnode) {
    destroyWidget(domNode, vnode)
  }
  return newNode
}

function destroyWidget (domNode: Element, widget) {
  if (isWidget(widget)) {
    widget.destroy(domNode)
  }
}

function patchProps (
  domNode: Element,
  patch: Props,
  previousProps: Props,
  isSvg?: boolean
) {
  for (const propName in patch) {
    if (propName === 'children') {
      continue
    }
    const propValue = patch[propName]
    const previousValue = previousProps[propName]
    if (propValue == null || propValue === false) {
      if (isHook(previousValue)) {
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
        if (isHook(previousValue)) {
          previousValue.unhook(domNode, propName, propValue)
        }
        propValue.hook(domNode, propName, previousValue)
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
        if (
          previousValue &&
          isObject(previousValue) &&
          getPrototype(previousValue) !== getPrototype(propValue)
        ) {
          if (propName in domNode) {
            try {
              domNode[propName] = propValue
            } catch (err) {}
          } else {
            domNode.setAttribute(propName, propValue)
          }
        }
        continue
      } else if (
        propName !== 'list' &&
        propName !== 'type' &&
        !isSvg &&
        propName in domNode
      ) {
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
    domNode.insertBefore(
      node,
      insert.to >= length++ ? null : childNodes[insert.to]
    )
  }
  return domNode
}

function patchRemove (domNode: Element, vnode: VirtualNode) {
  const parentNode = domNode.parentNode
  if (parentNode !== null) {
    parentNode.removeChild(domNode)
  }
  if (isWidget(vnode)) {
    vnode.destroy(domNode)
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
