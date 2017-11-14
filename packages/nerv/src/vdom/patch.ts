/* tslint:disable: no-shadowed-variable*/
/* tslint:disable: no-empty*/
import { isFunction, isString, isObject, getPrototype } from 'nerv-utils'
import createElement from './create-element'
import {
  Props,
  isWidget,
  isHook,
  isVNode,
  VText,
  isVText,
  isInvalid
} from 'nerv-shared'
import { unmount, unmountChildren } from './unmount'

export function patch (lastVnode, nextVnode, lastDom, context, isSVG?: boolean) {
  lastDom = lastVnode.dom || lastDom
  if (isInvalid(lastVnode)) {
    throw new Error('lastdom is invalid')
  }
  if (lastVnode === nextVnode) {
    return lastDom
  }
  if (isVText(nextVnode) && isVText(lastVnode)) {
    return patchVText(lastVnode, nextVnode)
  }
  let newDom
  if (isSameVNode(lastVnode, nextVnode)) {
    if (isVNode(nextVnode)) {
      patchProps(lastDom, nextVnode.props, lastVnode.props, isSVG)
      patchChildren(
        lastDom,
        lastVnode.children,
        nextVnode.children,
        context,
        isSVG
      )
      newDom = lastDom
    } else if (isWidget(nextVnode)) {
      newDom = nextVnode.update(lastVnode, nextVnode, lastDom)
    }
    (nextVnode as any).dom = newDom
  } else {
    let parentNode
    try {
      parentNode = lastDom.parentNode
    } catch (error) {
      console.log('lastDom is', lastVnode)
      console.log('nextVnode is', nextVnode)
    }
    // const parentNode = lastDom.parentNode
    const nextSibling = lastDom.nextSibling
    unmount(lastVnode, parentNode)
    newDom = createElement(nextVnode)
    if (nextVnode !== null) {
      nextVnode.dom = newDom
    }
    if (parentNode !== null) {
      parentNode.insertBefore(newDom as Node, nextSibling)
    }
  }
  return newDom
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
    patchNonKeyedChildren(
      parentDom,
      lastChildren,
      nextChildren,
      context,
      isSVG,
      lastLength,
      nextLength
    )
    // if (isKeyed(lastChildren, nextChildren)) {
    // } else {
    //   patchNonKeyedChildren(
    //     parentDom,
    //     lastChildren,
    //     nextChildren,
    //     context,
    //     isSVG,
    //     lastLength,
    //     nextLength
    //   )
    // }
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

export function isKeyed (a, b) {
  return !isInvalid(a) && !isInvalid(b) && a.key !== null && b.key !== null
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
