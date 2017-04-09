import VPatch from './vpatch';
import { type, forEach, getPrototype } from '~';
import domIndex from './dom-index';
import createElement from './create-element';

function patch (rootNode, patches) {
  let patchIndices = getPatchIndices(patches);
  if (patchIndices.length === 0) {
    return rootNode;
  }
  let oldTree = patches.old;
  if (!oldTree && !rootNode) {
    return patchInit(patchIndices, patches);
  }
  let nodes = domIndex(rootNode, oldTree, patchIndices);
  forEach(patchIndices, index => {
    rootNode = applyPatch(rootNode, nodes[index], patches[index]);
  });
  return rootNode;
}

function patchInit (patchIndices, patches) {
  const fragment = document.createDocumentFragment();
  forEach(patchIndices, index => {
    let patch = patches[index];
    if (type(patch) !== 'array') {
      patch = [patch];
    }
    forEach(patch, patchItem => {
      let newNode = patchSingle(null, patchItem);
      fragment.appendChild(newNode);
    });
  });
  return fragment;
}

function applyPatch (rootNode, domNode, patch) {
  if (!domNode) {
    return rootNode;
  }
  let newNode;
  if (type(patch) !== 'array') {
    patch = [patch];
  }
  forEach(patch, patchItem => {
    newNode = patchSingle(domNode, patchItem);
  });
  if (domNode === rootNode) {
    rootNode = newNode;
  }
  return rootNode;
}

function patchSingle (domNode, vpatch) {
  let type = vpatch.type;
  let oldVNode = vpatch.vnode;
  let patchObj = vpatch.patch;

  switch (type) {
    case VPatch.VTEXT:
      return patchVText(domNode, patchObj);
    case VPatch.VNODE:
      return patchVNode(domNode, patchObj);
    case VPatch.WIDGET:
      return replaceRoot(domNode, patch(domNode, patchObj), oldVNode);
    case VPatch.PROPS:
      return patchProperties(domNode, patchObj, oldVNode.properties);
    case VPatch.ORDER:
      return patchOrder(domNode, patchObj);
    case VPatch.REMOVE:
      return patchRemove(domNode, patchObj);
    default:
      return domNode;
  }
}

function patchVText (domNode, patch) {
  if (domNode === null) {
    return createElement(patch);
  }
  if (domNode.nodeType === 3) {
    if (domNode.textContent) {
      domNode.textContent = patch.text;
    } else {
      domNode.nodeValue = patch.text;
    }
    return domNode;
  }
  let parentNode = domNode.parentNode;
  let newNode = createElement(patch);
  if (parentNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  return newNode;
}

function patchVNode (domNode, patch) {
  if (domNode === null) {
    return createElement(patch);
  }
  let parentNode = domNode.parentNode;
  let newNode = createElement(patch);
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  return newNode;
}

function replaceRoot (oldRoot, newRoot) {
  if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild(newRoot, oldRoot);
  }

  return newRoot;
}

function patchProperties (domNode, patch, previousProps) {
  for (let propName in patch) {
    let propValue = patch[propName];
    let previousValue = previousProps[propName];
    if (propValue === undefined) {
      if (propName === 'attributes') {
        for (let attrName in previousValue) {
          domNode.removeAttribute(attrName);
        }
      } else if (propName === 'style') {
        for (let styleName in previousValue) {
          domNode.style[styleName] = '';
        }
      } else if (type(previousValue) === 'string') {
        domNode[propName] = '';
      } else {
        domNode[propName] = null;
      }
    } else {
      if (propName === 'attributes') {
        for (let attrName in propValue) {
          let attrValue = propValue[attrName];
          if (attrValue === undefined) {
            domNode.removeAttribute(attrName);
          } else {
            domNode.setAttribute(attrName, attrValue);
          }
        }
      } else if (propName === 'style') {
        for (let styleName in propValue) {
          let styleValue = propValue[styleName];
          if (styleValue) {
            domNode[propName][styleName] = styleValue;
          }
        }
      } else if (type(propValue) === 'object') {
        if(previousValue && type(previousValue) === 'object' &&
          getPrototype(previousValue) !== getPrototype(propValue)) {
          domNode[propName] = propValue;
        }
      } else {
        domNode[propName] = propValue;
      }
    }
  }
  return domNode;
}

function patchOrder (domNode, patch) {
  let moves = patch.moves;
  let childNodes = domNode.childNodes;
  let childNodesList = [].slice.call(childNodes, 0);
  let cache = {};
  forEach(childNodesList, child => {
    if (child.nodeType === 1) {
      let key = child.getAttribute('key');
      if (key) {
        cache[key] = child;
      }
    }
  });

  forEach(moves, move => {
    let index = move.index;
    if (move.type === 'remove') {
     if (childNodesList[index] === childNodes[index]) {
       domNode.removeChild(childNodesList[index]);
     }
     childNodesList.splice(index, 1);
    } else {
      let insertNode;
      let key = move.item.key;
      if (key && cache[key]) {
        insertNode = cache[key];
      } else {
        insertNode = createElement(move.item);
      }
      childNodesList.splice(index, 0, insertNode);
      domNode.insertBefore(insertNode, domNode.childNodes[index] || null);
    }
  });
  return domNode;
}

function patchRemove (domNode) {
  let parentNode = domNode.parentNode;
  if (parentNode) {
    parentNode.removeChild(domNode);
  }
  return null;
}

function getPatchIndices (patches) {
  let indices = [];
  if (patches) {
    for (let i in patches) {
      if (i !== 'old' && patches.hasOwnProperty(i)) {
        indices.push(Number(i));
      }
    }
  }
  return indices;
}

module.exports = patch;