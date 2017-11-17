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
  isInvalid,
  VNode,
  isNullOrUndef
} from 'nerv-shared'
import { unmount, unmountChildren } from './unmount'

export function patch (lastVnode, nextVnode, lastDom, context, isSVG?: boolean) {
  lastDom = (lastVnode && lastVnode.dom) || lastDom
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
    const parentNode = lastDom.parentNode
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
    if (isKeyed(lastChildren, nextChildren)) {
      patchKeyedChildren(
        lastChildren,
        nextChildren,
        parentDom,
        context,
        isSVG,
        lastLength,
        nextLength
      )
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

function patchKeyedChildren (
  a: VNode[],
  b: VNode[],
  dom,
  context,
  isSVG: boolean,
  aLength: number,
  bLength: number
) {
  let aEnd = aLength - 1
  let bEnd = bLength - 1
  let aStart = 0
  let bStart = 0
  let i
  let j
  let aNode
  let bNode
  let nextNode
  let nextPos
  let node
  let aStartNode = a[aStart]
  let bStartNode = b[bStart]
  let aEndNode = a[aEnd]
  let bEndNode = b[bEnd]

  // Step 1
  // tslint:disable-next-line
  outer: {
    // Sync nodes with the same key at the beginning.
    while (aStartNode.key === bStartNode.key) {
      patch(aStartNode, bStartNode, dom, context, isSVG)
      aStart++
      bStart++
      if (aStart > aEnd || bStart > bEnd) {
        break outer
      }
      aStartNode = a[aStart]
      bStartNode = b[bStart]
    }

    // Sync nodes with the same key at the end.
    while (aEndNode.key === bEndNode.key) {
      patch(aEndNode, bEndNode, dom, context, isSVG)
      aEnd--
      bEnd--
      if (aStart > aEnd || bStart > bEnd) {
        break outer
      }
      aEndNode = a[aEnd]
      bEndNode = b[bEnd]
    }
  }

  if (aStart > aEnd) {
    if (bStart <= bEnd) {
      nextPos = bEnd + 1
      nextNode = nextPos < bLength ? b[nextPos].dom : null
      while (bStart <= bEnd) {
        node = b[bStart]
        bStart++
        attachNewNode(dom, createElement(node), nextNode)
      }
    }
  } else if (bStart > bEnd) {
    while (aStart <= aEnd) {
      unmount(a[aStart++], dom)
    }
  } else {
    const aLeft = aEnd - aStart + 1
    const bLeft = bEnd - bStart + 1
    const sources = new Array(bLeft)

    // Mark all nodes as inserted.
    for (i = 0; i < bLeft; i++) {
      sources[i] = -1
    }
    let moved = false
    let pos = 0
    let patched = 0

    // When sizes are small, just loop them through
    if (bLeft <= 4 || aLeft * bLeft <= 16) {
      for (i = aStart; i <= aEnd; i++) {
        aNode = a[i]
        if (patched < bLeft) {
          for (j = bStart; j <= bEnd; j++) {
            bNode = b[j]
            if (aNode.key === bNode.key) {
              sources[j - bStart] = i

              if (pos > j) {
                moved = true
              } else {
                pos = j
              }
              patch(aNode, bNode, dom, context, isSVG)
              patched++
              a[i] = null as any
              break
            }
          }
        }
      }
    } else {
      const keyIndex = new Map()

      for (i = bStart; i <= bEnd; i++) {
        keyIndex.set(b[i].key, i)
      }

      for (i = aStart; i <= aEnd; i++) {
        aNode = a[i]

        if (patched < bLeft) {
          j = keyIndex.get(aNode.key)

          if (j !== undefined) {
            bNode = b[j]
            sources[j - bStart] = i
            if (pos > j) {
              moved = true
            } else {
              pos = j
            }
            patch(aNode, bNode, dom, context, isSVG)
            patched++
            a[i] = null as any
          }
        }
      }
    }
    if (aLeft === aLength && patched === 0) {
      unmountChildren(a, dom)
      while (bStart < bLeft) {
        node = b[bStart]
        bStart++
        attachNewNode(dom, createElement(node, isSVG), null)
      }
    } else {
      i = aLeft - patched
      while (i > 0) {
        aNode = a[aStart++]
        if (aNode !== null) {
          unmount(aNode, dom)
          i--
        }
      }
      if (moved) {
        const seq = lis(sources)
        j = seq.length - 1
        for (i = bLeft - 1; i >= 0; i--) {
          if (sources[i] === -1) {
            pos = i + bStart
            node = b[pos]
            nextPos = pos + 1
            attachNewNode(
              dom,
              createElement(node, isSVG),
              nextPos < bLength ? b[nextPos].dom : null
            )
          } else {
            if (j < 0 || i !== seq[j]) {
              pos = i + bStart
              node = b[pos]
              nextPos = pos + 1
              attachNewNode(
                dom,
                node.dom,
                nextPos < bLength ? b[nextPos].dom : null
              )
            } else {
              j--
            }
          }
        }
      } else if (patched !== bLeft) {
        for (i = bLeft - 1; i >= 0; i--) {
          if (sources[i] === -1) {
            pos = i + bStart
            node = b[pos]
            nextPos = pos + 1
            attachNewNode(
              dom,
              createElement(node, isSVG),
              nextPos < bLength ? b[nextPos].dom : null
            )
          }
        }
      }
    }
  }
}

function attachNewNode (parentDom, newNode, nextNode) {
  if (isNullOrUndef(nextNode)) {
    parentDom.appendChild(newNode)
  } else {
    parentDom.insertBefore(newNode, nextNode)
  }
}

/**
 * Slightly modified Longest Increased Subsequence algorithm, it ignores items that have -1 value, they're representing
 * new items.
 *
 * http://en.wikipedia.org/wiki/Longest_increasing_subsequence
 *
 * @param a Array of numbers.
 * @returns Longest increasing subsequence.
 */
function lis (a: number[]): number[] {
  const p = a.slice()
  const result: number[] = []
  result.push(0)
  let u: number
  let v: number

  for (let i = 0, il = a.length; i < il; ++i) {
    if (a[i] === -1) {
      continue
    }

    const j = result[result.length - 1]
    if (a[j] < a[i]) {
      p[i] = j
      result.push(i)
      continue
    }

    u = 0
    v = result.length - 1

    while (u < v) {
      const c = ((u + v) / 2) | 0
      if (a[result[c]] < a[i]) {
        u = c + 1
      } else {
        v = c
      }
    }

    if (a[i] < a[result[u]]) {
      if (u > 0) {
        p[i] = result[u - 1]
      }
      result[u] = i
    }
  }

  u = result.length
  v = result[u - 1]

  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }

  return result
}

function isKeyed (lastChildren: VNode[], nextChildren: VNode[]): boolean {
  return (
    nextChildren.length > 0 &&
    !isNullOrUndef(nextChildren[0]) &&
    !isNullOrUndef(nextChildren[0].key) &&
    lastChildren.length > 0 &&
    !isNullOrUndef(lastChildren[0]) &&
    !isNullOrUndef(lastChildren[0].key)
  )
}

function isSameVNode (a, b) {
  if (isInvalid(a) || isInvalid(b)) {
    return false
  }
  return a.type === b.type && getKey(a) === getKey(b)
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
