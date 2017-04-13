class ComponentWrapper {
  constructor (ComponentClass, props, context) {
    this.component = new ComponentClass(props, context);
    this.name = this.component.constructor.name;
  }

  init () {
    this.component.mount();
    let domNode = this.component.dom;
    if (!domNode) {
      return null;
    }
    domNode.component = this.component;
    domNode.componentConstructor = this.component.constructor;
    return domNode;
  }

  update (previous, domNode) {
    let component = this.component;
    component.prevComponent = domNode.component || previous.component;
    component.vnode = component.prevComponent.vnode;
    component.update();
    if (component.dom) {
      component.dom.component = component;
      domNode.componentConstructor = component.constructor;
    }
    return component.dom;
  }

  destroy (domNode) {
    this.component.unmount();
  }
}

ComponentWrapper.prototype.type = 'Widget';

module.exports = ComponentWrapper;