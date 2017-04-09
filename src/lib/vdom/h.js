import VNode from './vnode/vnode';
import VText from './vnode/VText';
import { isVNode, isVText, isWidget } from './vnode/types';
import { type, forEach } from '~';

function h (tagName, properties) {
  let key, childNodes = [];
  properties = properties || {};
  if (properties.hasOwnProperty('key') && properties.key) {
    key = properties.key;
    delete properties.key;
  }
  for (let i = arguments.length; i-- > 2; ) {
    addChildren(childNodes, arguments[i], tagName);
	}
  return new VNode(tagName, properties, childNodes, key);
}

function addChildren (childNodes, children, tagName) {
  if (type(children) === 'string' || type(children) === 'number') {
    children = String(children);
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

module.exports = h;