import Events from './events';
import { forEach, type, extend, clone } from './util';
import { renderWidget } from '#/handle-widget';

class Widget extends Events {
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
    this._$el = null;
    this.template = '';
    this._eventNames = [];
    this._actions = [];
    this._dirty = true;
    if (!this.state) {
      this.state = {};
    }
    this.props = props || {};
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
    renderWidget(this);
  }

  dispatch (action, payload) {
    if (type(this.dispatch) === 'function') {
      this.update.call(this, action, payload);
    }
  }

  render () {} // 获取virtual dom
  
  _init (callback) {
    return new Promise((resolve, reject) => {
      if (type(this.fetch) === 'function') {
        this.fetch.call(this, state => {
          this._compile(state);
          resolve();
        }, () => reject());
      } else {
        this._compile();
        resolve();
      }
    });
  }

  _compile (state) {
    if (state) {
      this.state = mergeObject(this.state, state);
    }
    // 编译模板
    const compile = template.compile(this.template);
    this.html = compile(this.state);
  }

  _link () {
    if (type(this.beforeMount) === 'function') {
      this.beforeMount.call(this);
    }
    this._$el.append(this.html);
    this._delegateEvents();
    if (type(this.afterMount) === 'function') {
      this.afterMount.call(this);
    }
  }

  _delegateEvents () {
    if (!this.events) {
      return;
    }
    this._undelegateEvents();
    const events = this.events;
    for (let key in events) {
      let method = events[key];
      if (type(method) !== 'function') {
        method = this[method]
      }
      if (!method) {
        throw new Error(`Method ${method} not exist!`);
      }
      method = $.proxy(method, this);
      const match = key.match(Widget.delegateEventSplitter);
      if (!match) {
        throw new Error(`Event format error!`);
      }
      const eventName = match[1];
      const selector = match[2];
      this._eventNames.push(eventName);
      if (selector === '') {
        this._$el.bind(eventName, method);
      } else {
        this._$el.on(eventName, selector, method);
      }
    }
  }

  _undelegateEvents () {
    forEach(this._eventNames, event => {
      this._$el.off(event);
    });
  }
}

Widget.delegateEventSplitter = /^(\S+)\s*(.*)$/;
Widget.fnTest = /xyz/.test(function() {let xyz;}) ? /\bsuper\b/ : /.*/;
Widget.prototype.type = 'Widget';

module.exports = Widget;