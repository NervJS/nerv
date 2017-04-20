import { forEach } from '~'

function domIndex (rootNode, tree, patchIndices, nodes) {
  if (!patchIndices || patchIndices.length === 0) {
    return {}
  }
  patchIndices.sort((v1, v2) => v1 - v2)
  return recurse(rootNode, tree, patchIndices, nodes, 0)
}

function recurse (rootNode, tree, patchIndices, nodes, index) {
  nodes = nodes || {}
  if (rootNode) {
    if (indexInRange(patchIndices, index, index)) {
      nodes[index] = rootNode
    }
    let vChildren = tree.children
    if (vChildren) {
      let childNodes = rootNode.childNodes
      forEach(vChildren, (vChild, i) => {
        index++
        vChild = vChild || {}
        let nextIndex = index + (vChild.count || 0)
        if (indexInRange(patchIndices, index, nextIndex)) {
          recurse(childNodes[i], vChild, patchIndices, nodes, index)
        }
        index = nextIndex
      })
    }
  }
  return nodes
}

function indexInRange (indices, left, right) {
  if (indices.length === 0) {
    return false
  }
  let minIndex = 0
  let maxIndex = indices.length - 1
  let currentIndex
  let currentItem
  while (minIndex <= maxIndex) {
    currentIndex = ((maxIndex + minIndex) / 2) >> 0
    currentItem = indices[currentIndex]
    if (minIndex === maxIndex) {
      return currentItem >= left && currentItem <= right
    }
    if (currentItem < left) {
      minIndex = currentIndex + 1
    } else if (currentItem > right) {
      maxIndex = currentIndex - 1
    } else {
      return true
    }
  }
  return false
}

module.exports = domIndex