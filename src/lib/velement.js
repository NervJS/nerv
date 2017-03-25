import { type, forEach } from 'util';

class VElement {
  constructor (tagName, props, children) {
    if (!(this instanceof VElement)) {
      return new VElement(tagName, props, children);
    }
    if (type(props) === 'array') {
      children = props;
      props = {};
    }
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : void 0;
    let count = 0;
    forEach (this.children, (child, i) => {
      if (child instanceof VElement) {
        count += child.count;
      } else {
        children[i] = '' + child;
      }
      count ++;
    });
    this.count = count;
  }

  render () {
    const el = document.createElement(this.tagName);
    const props = this.props;
    for (let prop in props) {
      let value = props[prop];
      switch (prop) {
        case 'style':
          el.style.cssText = value;
          break;
        case 'value':
          let tagName = this.tagName.toLowerCase();
          if (tagName === 'input' || tagName === 'textarea') {
            el.value = value;
          } else {
            el.setAttibute(prop, value);
          }
          break;
        default:
          el.setAttibute(prop, value);
          break;
      }
    }
    forEach(this.children, child => {
      const childEl = (child instanceof VElement) ? child.render() : document.createTextNode(child);
      el.appendChild(childEl);
    });
    return el;
  }
}