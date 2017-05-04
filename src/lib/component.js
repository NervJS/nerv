import Events from './events'
import { isFunction, extend, clone } from './util'
import nextTick from './util/next-tick'
import diff from '#/diff'
import patch from '#/patch'
import createElement from '#/create-element'
import { isWidget } from '#/vnode/types'
import { enqueueRender } from './render-queue'

class Component extends Events {
  static extend (properties) {
    let initializing = false
    const base = this
    function beget (obj) {
      let F = function () {}
      F.prototype = obj
      return new F()
    }
    const _super = this.prototype
    initializing = true
    const subPrototype = beget(this.prototype)
    initializing = false
    let props = {}
    for (let prop in properties) {
      if (prop === 'statics') {
        const staticObj = properties[prop]
        for (let staticProp in staticObj) {
          this[staticProp] = staticObj[staticProp]
        }
      } else if (isFunction(_super[prop]) &&
        isFunction(properties[prop]) &&
        this.fnTest.test(properties[prop])) {
        subPrototype[prop] = ((superObj, prop, fn) => {
          return function () {
            this._super = superObj[prop]
            return fn.apply(this, arguments)
          }
        })(_super, prop, properties[prop])
      } else if (!isFunction(properties[prop])) {
        props[prop] = properties[prop]
      } else {
        subPrototype[prop] = properties[prop]
      }
    }

    function T () {
      if (!initializing && isFunction(this.construct)) {
        base.call(this)
        for (let p in props) {
          this[p] = props[p]
        }
        this.construct.apply(this, arguments)
      }
    }
    T.prototype = subPrototype
    T.prototype.constructor = T
    T.extend = Component.extend
    return T
  }

  constructor (props, context) {
    super()
    this._dirty = true
    if (!this.state) {
      this.state = {}
    }
    this.props = props || {}
    this.props = extend(clone(this.constructor.defaultProps || {}), this.props)
    this.context = context || {}
    this.constructor.displayName = this.constructor.name
  }

  setState (state, callback) {
    if (!this.prevState) {
      this.prevState = clone(this.state)
    }
    if (isFunction(state)) {
      state = state(this.state, this.props)
    }
    extend(this.state, state)
    if (callback) {
      (this._renderCallbacks = (this._renderCallbacks || [])).push(callback)
    }
    enqueueRender(this)
  }

  forceUpdate () {
    this.update(true)
  }

  update (isForce) {
    let dom = this.dom
    let props = this.props
    let state = this.state
    let context = this.context
    let prevProps = this.prevProps || props
    let prevState = this.prevState || state
    let prevContext = this.prevContext || context
    let isUpdate = this.dom
    let skip = false
    if (isUpdate) {
      this.props = prevProps
      this.state = prevState
      this.context = prevContext
      if (!isForce && isFunction(this.shouldComponentUpdate)
        && this.shouldComponentUpdate(props, state, context)) {
        skip = true
      } else if (isFunction(this.componentWillUpdate)) {
        this.componentWillUpdate(props, state, context)
      }
      this.props = props
      this.state = state
      this.context = context
    }
    this.prevProps = this.prevState = this.prevContext = null
    this._dirty = false
    if (!skip) {
      if (isFunction(this.getChildContext)) {
        context = extend(extend({}, context), this.getChildContext())
      }
      if (isUpdate && isFunction(this.componentWillReceiveProps)) {
        this.componentWillReceiveProps(props, context)
      }
      this.prevVNode = this.vnode
      this.vnode = this.render()
      this.setupContext(this.vnode, context)
      if (dom) {
        dom._component = null
      }
      if (!this.isServer) {
        this.dom = renderToDom(this)
      }
      if (isUpdate && !isForce) {
        if (isFunction(this.componentDidUpdate)) {
          this.componentDidUpdate()
        }
        this.trigger('updated', this)
      }
      if (isFunction(this.__ref)) {
        this.__ref(this)
      }
      this._prevComponent = null
    }
    if (this._renderCallbacks) {
      while (this._renderCallbacks.length) {
        this._renderCallbacks.pop().call(this)
      }
    }
  }

  setupContext (vnode, context) {
    if (isWidget(vnode)) {
      vnode.component.context = context
    } else {
      let children = vnode.children || []
      children.forEach(child => this.setupContext(child, context))
    }
  }

  mount (parentNode) {
    if (this.constructor.inited && this.constructor.initialHtml) {
      this.update(true)
      if (this.rootNode) {
        this.rootNode.insertAdjacentHTML('beforeend', this.constructor.initialHtml)
        delete this.constructor.inited
        delete this.constructor.initialHtml
      }
    } else {
      if (isFunction(this.componentWillMount)) {
        this.componentWillMount()
      }
      this.update(true)
      if (parentNode && parentNode.appendChild && this.dom) {
        parentNode.appendChild(this.dom)
      }
    }
    let flushMount = () => {
      if (isFunction(this.componentDidMount)) {
        this.componentDidMount()
      }
    }
    if (parentNode) {
      flushMount()
    } else {
      nextTick(flushMount)
    }
  }

  unmount () {
    if (isFunction(this.componentWillUnmount)) {
      this.componentWillUnmount()
    }
    this.prevVNode = this.vnode
    this.vnode = null
    this.dom = renderToDom(this)
    this.prevVNode = null
    let parentNode = this.dom && this.dom.parentNode
    if (parentNode) {
      parentNode.removeChild(this.dom)
    }
    if (isFunction(this.__ref)) {
      this.__ref(null)
    }
    if (this.dom) {
      this.dom.component = null
      this.dom = null
    }
  }
}

function renderToDom (component) {
  let domNode = component.dom ||
    (component._prevComponent && component._prevComponent.dom)
  let lastDomNode = domNode

  if (!domNode) {
    domNode = createElement(component.vnode)
  } else {
    let patches = diff(component.prevVNode, component.vnode)
    domNode._component = component
    domNode = patch(domNode, patches)
  }
  if (domNode) {
    domNode._component = component
  }
  if (lastDomNode && lastDomNode !== domNode) {
    if (lastDomNode._component && lastDomNode._component.dom === lastDomNode) {
      lastDomNode._component.dom = null
    }
    lastDomNode._component = null
  }
  return domNode
}

export default Component