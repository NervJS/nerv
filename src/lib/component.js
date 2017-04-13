import Events from './events';
import { forEach, type, extend, clone } from './util';
import createElement from '#/create-element';
import diff from '#/diff';
import patch from '#/patch';
import { isWidget } from '#/vnode/types';
import { enqueueRender } from './render-queue';

class Component extends Events {
  static extend (properties) {
    let initializing = false;
    const base = this;
    function beget (obj) {
      let F = function () {};
      F.prototype = obj;
      return new F();
    }
    const _super = this.prototype;
    initializing = true;
    const subPrototype = beget(this.prototype);
    initializing = false;
    let props = {};
    for (let prop in properties) {
      if (prop === 'statics') {
        const staticObj = properties[prop];
        for (let staticProp in staticObj) {
          this[staticProp] = staticObj[staticProp];
        }
      } else {
        if (type(_super[prop]) === 'function' &&
          type(properties[prop]) === 'function' &&
          this.fnTest.test(properties[prop])) {
          subPrototype[prop] = ((superObj, prop, fn) => {
            return function () {
              this._super = superObj[prop];
              return fn.apply(this, arguments);
            };
          })(_super, prop, properties[prop]);
        } else if (type(properties[prop]) !== 'function') {
          props[prop] = properties[prop];
        } else {
          subPrototype[prop] = properties[prop];
        }
      }
    }

    function T () {
      if (!initializing && type(this.construct) === 'function') {
        base.call(this);
        for (let p in props) {
          this[p] = props[p];
        }
        this.construct.apply(this, arguments);
      }
    }
    T.prototype = subPrototype;
    T.prototype.constructor = T;
    T.extend = Widget.extend;
    return T;
  }

  constructor (props, context) {
    super();
    this._dirty = true;
    if (!this.state) {
      this.state = {};
    }
    this.props = props || {};
    this.props = extend(this.props, this.constructor.defaultProps);
    this.context = context || {};
  }

  setState (state, callback) {
    if (!this.prevState) {
      this.prevState = clone(this.state);
    }
    if (type(state) === 'function') {
      state = state(this.state, this.props);
    }
    extend(this.state, state);
    if (callback) {
      (this._renderCallbacks = (this._renderCallbacks || [])).push(callback);
    }
    enqueueRender(this);
  }

  forceUpdate () {
    this.update(true);
  }

  update (isForce) {
    let dom = this.dom;
    let props = this.props;
		let state = this.state;
		let context = this.context;
		let prevProps = this.prevProps || props;
		let prevState = this.prevState || state;
		let prevContext = this.prevContext || context;
		let isUpdate = this.dom;
    let skip = false;
    if (isUpdate) {
      this.props = prevProps;
      this.state = prevState;
      this.context = prevContext;
      if (!isForce && type(this.shouldComponentUpdate) === 'funtion' 
        && this.shouldComponentUpdate(props, state, context)) {
        skip = true;
      } else if (type(this.componentWillUpdate) === 'funtion') {
        this.componentWillUpdate(props, state, context);
      }

      if (type(this.componentWillReceiveProps) === 'function') {
        this.componentWillReceiveProps(props, context);
      }
      this.props = props;
      this.state = state;
      this.context = context;
    }
    this.prevProps = this.prevState = this.prevContext = this.nextBase = null;
	  this._dirty = false;
    if (!skip) {
      if (type(this.getChildContext) === 'function') {
        context = extend(extend({}, context), this.getChildContext());
      }
      this.prevVNode = this.vnode;
      this.vnode = this.render();
      if (isWidget(this.vnode)) {
        this._component = this.vnode;
        this.vnode._parentComponent = this;
        if (context && context !== this.vnode.context) {
          if (!this.vnode.prevContext) {
            this.vnode.prevContext = this.vnode.context;
          }
          this.vnode.context = context;
        }
      }
      if (dom) {
        dom.component = null;
      }
      if (!this.isServer) {
        this.dom = renderToDom(this);
      }
      if (isUpdate && !isForce) {
        if (type(this.componentDidUpdate) === 'function') {
          this.componentDidUpdate();
        }
        this.trigger('updated', this);
      }
      this.prevComponent = null;
    }
  }

  mount (parentNode, server) {
    this.refs = {};
    if (this.constructor.inited && this.constructor.initialHtml) {
      this.update(true);
      if (parentNode) {
        parentNode.insertAdjacentHTML('beforeend', this.constructor.initialHtml);
        delete this.constructor.inited;
        delete this.constructor.initialHtml;
      }
    } else {
      if (type(this.componentWillMount) === 'function') {
        this.componentWillMount();
      }
      if (parentNode) {
        this.rootDom = parentNode;
      }
      this.update(true);
      if (parentNode && parentNode.appendChild && this.dom) {
        parentNode.appendChild(this.dom);
      }
    }
    if (this._renderCallbacks) {
      while (this._renderCallbacks.length) {
        this._renderCallbacks.pop().call(this);
      }
    }
    this.trigger('mounted', this);
    if (this.dom) {
      if (type(this.componentDidMount) === 'function') {
        this.componentDidMount();
      }
    }
  }

  unmout () {
    if (type(this.componentWillUnmount) === 'function') {
      this.componentWillUnmount();
    }
    let parentNode = this.dom && this.dom.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.dom);
    }    
    if (this.dom) {
      this.dom.component = null;
      this.dom = null;
    }
  }
}

function renderToDom (component) {
  let domNode = component.dom ||
    component.prevComponent && component.prevComponent.dom;
  let lastDomNode = domNode;

  if (!domNode) {
    domNode = createElement(component.vnode);
  } else {
    let patches = diff(component.prevVNode, component.vnode);
    domNode.component = component;
    domNode = patch(domNode, patches);
  }
  if (domNode) {
    domNode.component = component;
  }
  if (lastDomNode && lastDomNode !== domNode) {
    if (lastDomNode.component && lastDomNode.component.dom === lastDomNode) {
      lastDomNode.component.dom = null;
    }
    lastDomNode.component = null;
  }
  return domNode;
}

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

module.exports = Component;