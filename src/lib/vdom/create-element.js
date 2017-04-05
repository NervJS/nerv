import { isVNode, isVText } from './vnode/types';
import { type, forEach } from '~';

function createElement (node) {
  const doc = document;
  if (isVText(node)) {
    return doc.createTextNode(node.text);
  }
  if (isVNode(node)) {
    const domNode = doc.createElement(node.tagName);
    setProps(domNode, node.properties);
    const children = node.children;
    if (children.length) {
      forEach(children, child => domNode.appendChild(createElement(child)));
    }
    return domNode;
  }
  return null;
}

function setProps (domNode, props) {
  for (let p in props) {
    let propValue = props[p];
    if (type(propValue) === 'object') {
      if (p === 'attributes') {
        for (let k in propValue) {
          let attrValue = propValue[k];
          if (attrValue) {
            domNode.setAttribute(attrValue);
          }
        }
      } else if (p === 'style') {
        for (var s in propValue) {
          let styleValue = propValue[s];
          if (styleValue) {
            domNode[p][s] = styleValue;
          }
        }
      }
    } else {
      domNode[p] = propValue;
    }
  }
}

module.exports = createElement;