import { extend, isFunction, isNumber, isString } from './util'
import CurrentOwner from './current-owner'
import createElement from '#/create-element'
import createVText from '#/create-vtext'
import diff from '#/diff'
import patch from '#/patch'

const readyComponents = []

export function mountVNode (vnode, parentContext) {
  if (vnode) {
    vnode.parentContext = parentContext
  }
  return createElement(vnode)
}

export function mountComponent (vnode) {
  const parentContext = vnode.parentContext
  const componentPrototype = vnode.ComponentType.prototype
  if (componentPrototype && isFunction(componentPrototype.render)) {
    vnode.component = new vnode.ComponentType(vnode.props, vnode.context)
  }
  const component = vnode.component
  component.context = vnode.context || parentContext
  if (isFunction(component.componentWillMount)) {
    component.componentWillMount()
    component.state = component.getState()
  }
  component._dirty = false
  const rendered = renderComponent(component)
  component._rendered = rendered
  if (isFunction(component.componentDidMount)) {
    readyComponents.push(component)
  }
  if (isFunction(vnode.props.ref)) {
    readyComponents.push(() => vnode.props.ref(component))
  }
  const dom = mountVNode(rendered, getChildContext(component, parentContext))
  component.dom = dom
  component._disable = false
  return dom
}

export function mountStatelessComponent (vnode) {
  vnode._renderd = vnode.tagName(vnode.props, vnode.parentContext)
  return mountVNode(vnode._renderd, vnode.parentContext)
}

export function getChildContext (component, context) {
  if (component.getChildContext) {
    return extend(context, component.getChildContext())
  }
  return context
}

export function renderComponent (component) {
  CurrentOwner.current = component
  let rendered = component.render()
  if (isNumber(rendered) || isString(rendered)) {
    rendered = createVText(rendered)
  }
  CurrentOwner.current = null
  return rendered
}

export function flushMount () {
  if (!readyComponents.length) {
    return
  }
  const queue = readyComponents.slice(0)
  readyComponents.length = 0
  queue.forEach(item => {
    if (isFunction(item)) {
      item()
    } else if (item.componentDidMount) {
      item.componentDidMount()
    }
  })
}

export function reRenderComponent (prev, current) {
  const component = current.component = prev.component
  const nextProps = current.props
  const nextContext = component.context
  component._disable = true
  if (isFunction(component.componentWillReceiveProps)) {
    component.componentWillReceiveProps(nextProps, nextContext)
  }
  component._disable = false
  component.prevProps = component.props
  component.prevState = component.state
  component.prevContext = component.context
  component.props = nextProps
  component.context = nextContext
  updateComponent(component)
  return component.dom
}

export function updateComponent (component, isForce) {
  const lastDom = component.dom
  let props = component.props
  let state = component.getState()
  let context = component.context
  let prevProps = component.prevProps || props
  let prevContext = component.prevContext || context
  component.props = prevProps
  component.context = prevContext
  let skip = false
  if (!isForce && isFunction(component.shouldComponentUpdate) &&
    component.shouldComponentUpdate(props, state, context) === false) {
    skip = true
  } else if (isFunction(component.componentWillUpdate)) {
    component.componentWillUpdate(props, state, context)
  }
  component.props = props
  component.state = state
  component.context = context
  component._dirty = false
  if (!skip) {
    const lastRendered = component._rendered
    const rendered = renderComponent(component)
    const childContext = getChildContext(component, context)
    component._rendered = rendered
    component.dom = updateVNode(rendered, lastRendered, lastDom, childContext)
    if (component.componentDidUpdate) {
      component.componentDidUpdate(props, state, context)
    }
  }
  component.prevProps = component.props
  component.prevState = component.state
  component.prevContext = component.context
  if (component._pendingCallbacks) {
    while (component._pendingCallbacks.length) {
      component._pendingCallbacks.pop().call(component)
    }
  }
  flushMount()
}

function updateVNode (vnode, lastVNode, lastDom, childContext) {
  if (vnode) {
    vnode.context = childContext
  }
  let domNode
  if (!lastDom) {
    domNode = createElement(vnode)
  } else {
    let patches = diff(lastVNode, vnode)
    domNode = patch(lastDom, patches)
  }
  return domNode
}

export function unmoutComponent (component) {
  if (isFunction(component.componentWillUnmount)) {
    component.componentWillUnmount()
  }
  component.dom = component.lastRendered = component.rendered = null
  if (isFunction(component.props.ref)) {
    component.props.ref(null)
  }
}
