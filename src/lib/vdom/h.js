import VNode from './vnode/vnode';
import VText from './vnode/VText';
import { isVNode, isVText, isWidget } from './vnode/types';
import { type, forEach } from '~';

function h (tagName, properties, children) {
  let key, childNodes = [];
  properties = properties || {};
  if (properties.hasOwnProperty('key') && properties.key) {
    key = properties.key;
    delete properties.key;
  }
  tagName = parseTagName(tagName, properties);
  if (children) {
    addChildren(childNodes, children, tagName);
  }
  return new VNode(tagName, properties, childNodes, key);
}

function addChildren (childNodes, children, tagName) {
  if (type(children) === 'string') {
    childNodes.push(new VText(children));
  } else if (isChild(children)) {
    childNodes.push(children);
  } else if (type(children) === 'array') {
    forEach(children, child => addChildren(childNodes, child, tagName));
  } else {
    throw new Error('unexpected type');
  }
}

function isChild (node) {
  return isVNode(node) || isVText(node) || isWidget(node);
}

const classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
const classId = /^\.|#/;

function parseTagName (tagName, properties) {
  if (!tagName || type(tagName) !== 'string') {
    return 'DIV';
  }
  let tag = null;
  const tagSplits = tagName.split(classIdSplit);
  if (classId.test(tagSplits[1])) {
    tag = 'DIV';
  } else {
    tag = tagSplits[1].toUpperCase();
  }
  forEach(tagSplits, part => {
    if (!part) {
      return;
    }
    if (/^\./.test(part)) {
      if (type(properties.className) === 'string') {
        properties.className += ` ${part.substring(1, part.length)}` 
      } else {
        properties.className = part.substring(1, part.length);
      }
    } else if (/^#/.test(part)) {
      properties.id = part.substring(1, part.length);
    }
  });
  return tag;
}

module.exports = h;