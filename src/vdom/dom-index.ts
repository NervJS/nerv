function domIndex (rootNode: Element, tree, patchIndices: number[], nodes?) {
  if (!patchIndices || patchIndices.length === 0) {
    return {}
  }
  patchIndices.sort((v1, v2) => v1 - v2)
  return recurse(rootNode, tree, patchIndices, nodes)
}

function recurse (rootNode: Element, tree, patchIndices: number[], nodes = {}, index = 0) {
  if (rootNode) {
    if (indexInRange(patchIndices, index, index)) {
      nodes[index] = rootNode
    }
    const vChildren = tree.children
    if (vChildren) {
      const childNodes = rootNode.childNodes
      vChildren.forEach((vChild, i) => {
        index++
        vChild = vChild || {}
        const nextIndex = index + (vChild.count || 0)
        if (indexInRange(patchIndices, index, nextIndex)) {
          recurse(childNodes[i] as Element, vChild, patchIndices, nodes, index)
        }
        index = nextIndex
      })
    }
  }
  return nodes
}

function indexInRange (indices: number[], left: number, right: number) {
  if (indices.length === 0) {
    return false
  }
  let minIndex = 0
  let maxIndex = indices.length - 1
  let currentIndex: number
  let currentItem: number
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

export default domIndex
