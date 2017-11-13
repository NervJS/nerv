/* tslint:disable: no-shadowed-variable*/
/* tslint:disable: no-empty*/
import {
  isFunction,
  isString,
  isObject,
  getPrototype
} from 'nerv-utils'
import createElement from './create-element'
import {
  Props,
  isWidget,
  isHook,
  isVNode,
  VText,
  isVText,
  isInvalid,
  isNullOrUndef
} from 'nerv-shared'
import { VHook } from '../hooks/vhook'

export function patch (lastVnode, nextVnode, lastDom, context, isSVG?: boolean) {
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
      patchNonKeyedChildren(
        parentDom,
        lastChildren,
        nextChildren,
        context,
        isSVG,
        lastLength,
        nextLength
      )
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
    patch(lastChildren[i], nextChildren[i], parentDom, context, isSVG)
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
  for (let i = 0, len = children.length; i < len; i++) {
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

// function patch (rootNode: Element, patches, parentContext?: any) {
//   const patchIndices = getPatchIndices(patches)
//   if (patchIndices.length === 0) {
//     return rootNode
//   }
//   const oldTree = patches.old
//   const nodes = domIndex(rootNode, oldTree, patchIndices)
//   patchIndices.forEach((index) => {
//     rootNode = applyPatch(rootNode, nodes[index], patches[index], parentContext)
//   })
//   return rootNode
// }
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

export default patch
