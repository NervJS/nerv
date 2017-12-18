import { extend, isFunction, isNumber, isString } from 'nerv-utils'
import CurrentOwner from './current-owner'
import createElement from './vdom/create-element'
import createVText from './vdom/create-vtext'
import { createVoid } from './vdom/create-void'
import patch from './vdom/patch'
import { isVNode, Component, isNullOrUndef, CompositeComponent, isComponent } from 'nerv-shared'
import FullComponent from './full-component'
import Stateless from './stateless-component'
import options from './options'
import { unmount } from './vdom/unmount'
import Ref from './vdom/ref'

const readyComponents: any[] = []

function errorCatcher (fn: Function, component: Component<any, any>) {
  try {
    return fn()
  } catch (error) {
    errorHandler(component, error)
  }
}

function errorHandler (component: Component<any, any>, error) {
  let boundary

  while (true) {
    if (isFunction(component.componentDidCatch)) {
      boundary = component
      break
    } else if (component._parentComponent) {
      component = component._parentComponent
    } else {
      break
    }
  }

  if (boundary) {
    const _disable = boundary._disable
    boundary._disable = false
    boundary.componentDidCatch(error)
    boundary._disable = _disable
  } else {
    throw error
  }
}

export function mountVNode (vnode, parentContext: any, parentComponent?) {
  return createElement(vnode, false, parentContext, parentComponent)
}

export function mountComponent (vnode: FullComponent, parentContext: object, parentComponent) {
  const ref = vnode.props.ref
  vnode.component = new vnode.type(vnode.props, parentContext)
  const component = vnode.component
  if (isComponent(parentComponent)) {
    component._parentComponent = parentComponent
  }
  if (isFunction(component.componentWillMount)) {
    errorCatcher(() => {
      (component as any).componentWillMount()
    }, component)
    component.state = component.getState()
  }
  component._dirty = false
  const rendered = renderComponent(component)
  component._rendered = rendered
  if (isFunction(component.componentDidMount)) {
    readyComponents.push(component)
  }
  if (!isNullOrUndef(ref)) {
    readyComponents.push(() => Ref.attach(vnode, ref, component.dom))
  }
  const dom = (component.dom = mountVNode(
    rendered,
    getChildContext(component, parentContext),
    component
  ) as Element)
  vnode.dom = dom
  component._disable = false
  options.afterMount(vnode)
  return dom
}

export function mountStatelessComponent (vnode: Stateless, parentContext) {
  const ref = vnode.props.ref
  delete vnode.props.ref
  vnode._rendered = vnode.type(vnode.props, parentContext)
  const rendered = vnode._rendered
  if (isVNode(rendered) && !isNullOrUndef(ref)) {
    rendered.ref = ref as any
  }
  return (vnode.dom = mountVNode(rendered, parentContext) as Element)
}

export function getChildContext (component, context) {
  if (component.getChildContext) {
    return extend(context, component.getChildContext())
  }
  return context
}

export function renderComponent (component: Component<any, any>) {
  CurrentOwner.current = component
  let rendered
  errorCatcher(() => {
    rendered = component.render()
  }, component)
  if (isNumber(rendered) || isString(rendered)) {
    rendered = createVText(rendered)
  } else if (rendered === undefined) {
    rendered = createVoid()
  }
  CurrentOwner.current = null
  return rendered
}

export function flushMount () {
  if (!readyComponents.length) {
    return
  }
  // @TODO: perf
  const queue = readyComponents.slice(0)
  readyComponents.length = 0
  queue.forEach((item) => {
    if (isFunction(item)) {
      item()
    } else if (item.componentDidMount) {
      errorCatcher(() => {
        item.componentDidMount()
      }, item)
    }
  })
}

export function reRenderComponent (prev: CompositeComponent, current: CompositeComponent) {
  const component = (current.component = prev.component)
  const nextProps = current.props
  const nextContext = component.context
  component._disable = true
  if (isFunction(component.componentWillReceiveProps)) {
    errorCatcher(() => {
      (component as any).componentWillReceiveProps(nextProps, nextContext)
    }, component)
  }
  component._disable = false
  component.prevProps = component.props
  component.prevState = component.state
  component.prevContext = component.context
  component.props = nextProps
  component.context = nextContext
  if (!isNullOrUndef(nextProps.ref)) {
    Ref.update(prev, current)
  }
  updateComponent(component)
  return component.dom
}

export function reRenderStatelessComponent (
  prev: Stateless,
  current: Stateless,
  parentContext: Object,
  domNode: Element
) {
  const lastRendered = prev._rendered
  const rendered = current.type(current.props, parentContext)
  current._rendered = rendered
  return (current.dom = patch(lastRendered, rendered, domNode, parentContext))
}

export function updateComponent (component, isForce = false) {
  const lastDom = component.dom
  const props = component.props
  const state = component.getState()
  const context = component.context
  const prevProps = component.prevProps || props
  const prevState = component.prevState || state
  const prevContext = component.prevContext || context
  component.props = prevProps
  component.context = prevContext
  let skip = false
  if (
    !isForce &&
    isFunction(component.shouldComponentUpdate) &&
    component.shouldComponentUpdate(props, state, context) === false
  ) {
    skip = true
  } else if (isFunction(component.componentWillUpdate)) {
    errorCatcher(() => {
      component.componentWillUpdate(props, state, context)
    }, component)
  }
  component.props = props
  component.state = state
  component.context = context
  component._dirty = false
  if (!skip) {
    const lastRendered = component._rendered
    const rendered = renderComponent(component)
    const childContext = getChildContext(component, context)
    component.dom = patch(lastRendered, rendered, lastDom, childContext)
    component._rendered = rendered
    if (isFunction(component.componentDidUpdate)) {
      errorCatcher(() => {
        component.componentDidUpdate(prevProps, prevState, context)
      }, component)
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
  options.afterUpdate(component)
  flushMount()
}

export function unmountComponent (vnode: FullComponent) {
  const component = vnode.component
  options.beforeUnmount(component)
  if (isFunction(component.componentWillUnmount)) {
    errorCatcher(() => {
      (component as any).componentWillUnmount()
    }, component)
  }
  component._disable = true
  unmount(component._rendered)
  component.dom = component._rendered = null
  if (!isNullOrUndef(vnode.props.ref)) {
    Ref.detach(vnode, vnode.props.ref, vnode.dom as any)
  }
}

export function unmountStatelessComponent (vnode: Stateless) {
  unmount(vnode._rendered)
  vnode.dom = vnode._rendered = null
  if (!isNullOrUndef(vnode.props.ref)) {
    Ref.detach(vnode, vnode.props.ref, vnode.dom as any)
  }
}
