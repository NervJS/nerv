import { forEach, type } from '~';
import { isWidget, isVNode } from './types';

class VNode {
  constructor (tagName, properties, children, key) {
    this.tagName = tagName || 'DIV';
    this.properties = properties || {};
    this.children = children || [];
    this.key = key || null;
    this.count = this.children.length || 0;
    this.hasWidgets = false;
    if (this.count) {
      forEach(this.children, (child) => {
        if (isVNode(child)) {
          this.count += child.count;
          if (this.hasWidgets && child.hasWidgets) {
            this.hasWidgets = true;
          }
        } else if (this.hasWidgets && isWidget(child)) {
          if (type(child.destroy) === 'function') {
            this.hasWidgets = true;
          }
        }
      });
    }
  }
}

VNode.prototype.type = 'vnode';

module.exports = VNode;