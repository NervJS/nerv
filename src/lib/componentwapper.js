import { extend } from './util';

class ComponentWrapper {
  constructor (ComponentClass, props, context) {
    this.component = new ComponentClass(props, context);
    this.name = this.component.constructor.name;
  }

  init () {
    this.component.__ref = this.component.props.ref;
    delete this.component.props.ref;
    this.component.mount();
    let domNode = this.component.dom;
    if (!domNode) {
      return null;
    }
    domNode._component = this.component;
    domNode._componentConstructor = this.component.constructor;
    return domNode;
  }

  update (previous, domNode) {
    let component = this.component;
    component._prevComponent = domNode._component || previous.component;
    component.vnode = component._prevComponent.vnode;
    component.update();
    if (component.dom) {
      component.dom._component = component;
      component.dom._componentConstructor = component.constructor;
    }
    return component.dom;
  }

  destroy (domNode) {
    this.component.unmount();
    delete domNode.component;
  }
}

ComponentWrapper.prototype.type = 'Widget';

module.exports = ComponentWrapper;