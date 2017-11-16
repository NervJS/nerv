/* tslint:disable: no-shadowed-variable*/

import VPatch from './vpatch'
import { isVNode, isVText, isWidget, isHook } from './vnode/types'
import { isFunction, isObject, getPrototype } from '../util'
import { VirtualNode, IVNode, IProps, Patch, VirtualChildren } from '../types'
import Widget from '../full-component'
import Stateless from '../stateless-component'

type Patches = Patch[] & {
  old: VirtualNode
}

function diff (a: VirtualNode, b: VirtualNode) {
  const patches = {old: a}
  walk(a, b, patches as Patches, 0)
  return patches
}

function walk (a: VirtualNode, b: VirtualNode, patches: Patches, index: number) {
  if (a === b) {
    return
  }
  let apply = patches[index]
  let applyClear = false
  if (b == null) {
    if (!isWidget(a)) {
      clearState(a, patches as VirtualNode, index)
      apply = patches[index]
    }
    apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, null))
  } else if (isVText(b)) {
    if (!isVText(a)) {
      applyClear = true
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
    } else if (a.text !== b.text) {
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a as any, b))
    }
  } else if (isVNode(b)) {
    if (!isVNode(a)) {
      apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
      applyClear = true
    } else if (a.tagName === b.tagName && a.key === b.key) {
      const propsPatch = diffProps(a.props, b.props)
      if (propsPatch) {
        apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch))
      }
      apply = diffChildren(a, b, apply, patches, index)
    } else {
      apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
      applyClear = true
    }
  } else if (isWidget(b)) {
    if (!isWidget(a)) {
      applyClear = true
    }
    apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
  } else if (Array.isArray(b)) {
    applyClear = true
    b.forEach((item) => {
      walk(null, item, patches, index)
      index++
    })
  }
  if (apply) {
    patches[index] = apply
  }
  if (applyClear) {
    clearState(a, patches as VirtualNode, index)
  }
}

function diffProps (propsA: IProps, propsB: IProps) {
  let diff: any = null
  for (const key in propsA) {
    if (key === 'children') {
      continue
    }
    if (!propsB.hasOwnProperty(key)) {
      diff = diff || {}
      diff[key] = undefined
    }
    const aValue = propsA[key]
    const bValue = propsB[key]
    if (aValue === bValue) {
      continue
    } else if (isObject(aValue) && isObject(bValue)) {
      if (getPrototype(aValue) !== getPrototype(bValue)) {
        diff = diff || {}
        diff[key] = bValue
      } else if (isHook(bValue)) {
        diff = diff || {}
        diff[key] = bValue
      } else {
        const objDiff = diffProps(aValue, bValue)
        if (objDiff) {
          diff = diff || {}
          diff[key] = objDiff
        }
      }
    } else {
      diff = diff || {}
      diff[key] = bValue
    }
  }
  for (const key in propsB) {
    if (!propsA.hasOwnProperty(key)) {
      diff = diff || {}
      diff[key] = propsB[key]
    }
  }
  return diff
}

function diffChildren (a: IVNode, b: IVNode, apply, patches: Patches, index: number) {
  const aChildren = a.children
  const diffSet = diffList(aChildren, b.children, 'key')
  const bChildren = diffSet.list
  const len = Math.max(aChildren.length, bChildren.length)
  for (let i = 0; i < len; i++) {
    const leftNode = aChildren[i]
    const rightNode = bChildren[i]
    index += 1
    if (!leftNode) {
      if (rightNode) {
        apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode))
      }
    } else {
      walk(leftNode, rightNode, patches, index)
    }
    if (isVNode(leftNode) && leftNode.count) {
      index += leftNode.count
    }
  }
  if (diffSet.moves) {
    apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, diffSet.moves))
  }
  return apply
}

interface IRemove {
  from: number,
  key: any
}

interface IInsert {
  key: any,
  to: number
}

function diffList (oldList: VirtualChildren, newList: VirtualChildren, key: string) {
  const newListKeyIndex = mapListKeyIndex(newList, key)
  const newListkeyMap = newListKeyIndex.keyMap
  const newListFree = newListKeyIndex.free
  if (newListFree.length === newList.length) {
    return {
      list: newList,
      moves: null
    }
  }
  const oldListKeyIndex = mapListKeyIndex(oldList, key)
  const oldListkeyMap = oldListKeyIndex.keyMap
  const oldListFree = oldListKeyIndex.free
  if (oldListFree.length === oldList.length) {
    return {
      list: newList,
      moves: null
    }
  }
  let freeIndex = 0
  let newListFreeCount = newListFree.length
  let deletedItems = 0
  const listChange = oldList.map((item) => {
    const itemKey = item[key]
    if (itemKey) {
      if (newListkeyMap.hasOwnProperty(itemKey)) {
        return newList[newListkeyMap[itemKey]]
      }
      deletedItems++
      return null
    }
    if (freeIndex < newListFreeCount) {
      return newList[newListFree[freeIndex++]]
    }
    deletedItems++
    return null
  })
  const lastFreeIndex = freeIndex >= newListFree.length ? newList.length : newListFree[freeIndex]
  newList.forEach((newItem, index) => {
    const itemKey = newItem[key]
    if (itemKey) {
      if (!oldListkeyMap.hasOwnProperty(itemKey)) {
        listChange.push(newItem)
      }
    } else if (index >= lastFreeIndex) {
      listChange.push(newItem)
    }
  })

  const simulate = listChange.slice()
  let simulateIndex = 0
  const removes: IRemove[] = []
  const inserts: IInsert[] = []
  let simulateItem
  for (let k = 0; k < newList.length;) {
    const newItem = newList[k]
    simulateItem = simulate[simulateIndex]
    while (simulateItem === null && simulate.length) {
      removes.push(remove(simulate, simulateIndex, null))
      simulateItem = simulate[simulateIndex]
    }
    const newItemKey = newItem[key]
    if (!simulateItem || simulateItem[key] !== newItemKey) {
      if (newItemKey) {
        if (simulateItem && simulateItem[key]) {
          if (newListkeyMap[simulateItem[key]] !== k + 1) {
            removes.push(remove(simulate, simulateIndex, simulateItem[key]))
            simulateItem = simulate[simulateIndex]
            if (!simulateItem || simulateItem[key] !== newItemKey) {
              inserts.push({ key: newItemKey, to: k})
            } else {
              simulateIndex++
            }
          } else {
            inserts.push({ key: newItemKey, to: k})
          }
        } else {
          inserts.push({ key: newItemKey, to: k})
        }
        k++
      } else if (simulateItem && simulateItem[key]) {
        removes.push(remove(simulate, simulateIndex, simulateItem[key]))
      }
    } else {
      simulateIndex++
      k++
    }
  }
  while (simulateIndex < simulate.length) {
    simulateItem = simulate[simulateIndex]
    removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
  }
  if (removes.length === deletedItems && !inserts.length) {
    return {
      list: listChange,
      moves: null
    }
  }

  return {
    list: listChange,
    moves: {
      removes,
      inserts
    }
  }
}

function remove (arr: any[], index: number, key: any) {
  arr.splice(index, 1)
  return {
    from: index,
    key
  }
}

function clearState (vnode: VirtualNode, patch: VirtualNode, index: number) {
  unhookAll(vnode, patch, index)
  destroyWidgets(vnode, patch, index)
}

function unhookAll (vnode: VirtualNode, patch: VirtualNode, index: number) {
  if (isVNode(vnode)) {
    if (vnode.hooks) {
      (patch as IVNode)[index] = appendPatch(
        (patch as IVNode)[index],
        new VPatch(
          VPatch.PROPS,
          vnode,
          undefinedKeys(vnode.hooks) as VirtualNode
        )
      )
    }

    if (vnode.descendantHooks) {
      const children = vnode.children
      const len = children.length
      for (let i = 0; i < len; i++) {
        const child = children[i]
        index += 1
        unhookAll(child, patch, index)
        if (isVNode(child) && child.count) {
          index += child.count
        }
      }
    }
  }
}

function destroyWidgets (vnode: VirtualNode, patch: VirtualNode, index: number) {
  if (isWidget(vnode)) {
    if (isFunction(vnode.destroy)) {
      (patch as Widget | Stateless)[index] =
        appendPatch((patch as Widget | Stateless)[index], new VPatch(VPatch.REMOVE, vnode, null))
    }
  } else if (isVNode(vnode) && vnode.hasWidgets) {
    vnode.children.forEach((child) => {
      index += 1
      destroyWidgets(child, patch, index)
      if (isVNode(child) && child.count) {
        index += child.count
      }
    })
  }
}

function mapListKeyIndex (list: any[], key: string) {
  const keyMap = {}
  const free: number[] = []
  list.forEach((item, i) => {
    if (item[key]) {
      keyMap[item[key]] = i
    } else {
      free.push(i)
    }
  })
  return {
    keyMap,
    free
  }
}

function undefinedKeys (obj: Object) {
  const result = {}

  for (const key in obj) {
    result[key] = undefined
  }

  return result
}

function appendPatch (apply, patch: VPatch) {
  if (apply) {
    if (Array.isArray(apply)) {
      apply.push(patch)
    } else {
      apply = [apply, patch]
    }
    return apply
  }
  return [patch]
}

export default diff
