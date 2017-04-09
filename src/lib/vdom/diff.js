import VPatch from './vpatch';
import { isVNode, isVText, isWidget } from './vnode/types';
import { handleWidget } from './/handle-widget';
import { type, forEach, map, filter, getPrototype } from '~';

function diff (a, b) {
  let patches = {old: a};
  walk(a, b, patches, 0);
  return patches;
}

function walk (a, b, patches, index) {
  if (a === b) {
    return;
  }
  let apply = patches[index];
  let applyClear = false;
  if (isWidget(a) || isWidget(b)) {
    doWidgets(a, b, patches, index);
  } else if (!b) {
    clearState(a, patches, index);
    apply = patches[index];
    apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, null));
  } else if (isVText(b)) {
    if (!isVText(a)) {
      applyClear = true;
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
    } else if (a.text !== b.text) {
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
    }
  } else if (isVNode(b)) {
    if (!isVNode(a)) {
      b.children = map(b.children, child => {
        if (isWidget(child)) {
          return handleWidget(null, child).b;
        }
        return child;
      });
      apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
      applyClear = true;
    } else {
      if (a.tagName === b.tagName && a.key === b.key) {
        const propsPatch = diffProps(a.properties, b.properties);
        if (propsPatch) {
          apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch));
        }
        apply = diffChildren(a, b, apply, patches, index);
      } else {
        b.children = map(b.children, child => {
          if (isWidget(child)) {
            return handleWidget(null, child).b;
          }
          return child;
        });
        apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
        applyClear = true;
      }
    }
  }
  if (apply) {
    patches[index] = apply;
  }
  if (applyClear) {
    clearState(a, patches, index);
  }
}

function diffProps (propsA, propsB) {
  let diff = null;
  for (let key in propsA) {
    if (!propsB.hasOwnProperty(key)) {
      diff = diff || {};
      diff[key] = undefined;
    }
    let aValue = propsA[key];
    let bValue = propsB[key];
    if (aValue === bValue) {
      continue;
    } else if (type(aValue) === 'object' && type(bValue) === 'object') {
      if (getPrototype(aValue) !== getPrototype(bValue)) {
        diff = diff || {};
        diff[key] = bValue;
      } else {
        let objDiff = diffProps(aValue, bValue);
        if (objDiff) {
          diff = diff || {};
          diff[key] = objDiff;
        }
      }
    } else {
      diff = diff || {};
      diff[key] = bValue;
    }
  }
  for (let key in propsB) {
    if (!propsA.hasOwnProperty(key)) {
      diff = diff || {};
      diff[key] = propsB[key];
    }
  }
  return diff;
}

function doWidgets (a, b, patch, index) {
  const nodes = handleWidget(a, b);
  const widgetPatch = diff(nodes.a, nodes.b);
  if (hasPatches(widgetPatch)) {
    patch[index] = new VPatch(VPatch.WIDGET, a, widgetPatch);
  }
}

function hasPatches (patch) {
  for (let index in patch) {
    if (index !== 'old') {
      return true;
    }
  }
  return false;
}

function diffChildren (a, b, apply, patches, index) {
  const aChildren = a.children;
  const diffSet = diffList(aChildren, b.children, 'key');
  let bChildren = diffSet.list;
  if (diffSet.moves.length) {
    apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, diffSet.moves));
  }
  let leftNode = null;
  forEach(aChildren, (child, i) => {
    let newChild = bChildren[i];
    if (leftNode && isVNode(leftNode)) {
      index += leftNode.count;
    }
    index += 1;
    walk(child, newChild, patches, index);
    leftNode = child;
  });
  return apply;
}

function diffList (oldList, newList, key) {
  const newListKeyIndex = mapListKeyIndex(newList, key);
  const newListkeyMap = newListKeyIndex.keyMap;
  const newListFree = newListKeyIndex.free;
  let moves = [];
  if (newListFree.length === newList.length) {
    return {
      list: newList,
      moves
    };
  }
  const oldListKeyIndex = mapListKeyIndex(oldList, key);
  const oldListkeyMap = oldListKeyIndex.keyMap;
  const oldListFree = oldListKeyIndex.free;
  if (oldListFree.length === oldList.length) {
    return {
      list: newList,
      moves
    };
  }
  let listChange = [];
  let freeIndex = 0;
  let freeCount = newListFree.length;
  let deletedItems = 0;
  listChange = map(oldList, (item, i) => {
    const itemKey = item[key];
    if (itemKey) {
      if (newListkeyMap.hasOwnProperty(itemKey)) {
        return newList[newListkeyMap[itemKey]];
      }
      deletedItems++;
      return null;
    }
    let itemIndex = newListFree[freeIndex++];
    let freeItem = newList[itemIndex];
    if (!freeItem) {
      deletedItems++;
      return null;
    }
    return freeItem;
  });
  let simulate = listChange.slice(0);
  simulate = filter(simulate, (item, i) => {
    if (!item) {
      moves.push({ index: i, item, type: 'remove' });
    }
    return item;
  });
  let simulateIndex = 0;
  forEach(newList, (item, i) => {
    let itemkey = item[key];
    let simulateItem = simulate[simulateIndex];
    if (simulateItem) {
      let simulateItemKey = simulateItem[key];
      if (simulateItemKey === itemkey) {
        simulateIndex++;
      } else {
        if (!oldListkeyMap.hasOwnProperty(itemkey)) {
          moves.push({ index: i, item, type: 'insert' });
        } else {
          let nextSimulateItemKey = simulate[simulateIndex + 1][key];
          if (nextSimulateItemKey === itemkey) {
            moves.push({ index: i, item, type: 'remove' });
            simulate.splice(simulateIndex, 1);
            simulateIndex++;
          } else {
            moves.push({ index: i, item, type: 'insert' });
          }
        }
      }
    } else {
      moves.push({ index: i, item, type: 'insert' });
    }
  });

  return {
    list: listChange,
    moves
  };
}

function clearState (vNode, patch, index) {

}

function mapListKeyIndex (list, key) {
  let keyMap = {};
  let free = [];
  forEach(list, (item, i) => {
    if (item[key]) {
      keyMap[item[key]] = i;
    } else {
      free.push(i);
    }
  });
  return {
    keyMap,
    free
  };
}

function appendPatch (apply, patch) {
  if (apply) {
    if (type(apply) === 'array') {
      apply.push(patch);
    } else {
      apply = [apply, patch];
    }
    return apply;
  }
  return [patch];
}

module.exports = diff;