// import { extend, isFunction, isNumber, isString } from 'nerv-utils'
import { extend, isFunction, isNumber, isString, clone, isUndefined } from 'nerv-utils'
import CurrentOwner from './current-owner'
import createElement from './vdom/create-element'
import createVText from './vdom/create-vtext'
import { createVoid } from './vdom/create-void'
import patch from './vdom/patch'
import {
  isNullOrUndef,
  CompositeComponent,
  isComponent,
  isInvalid,
  VText,
  VVoid,
  VNode,
  VType,
  EMPTY_OBJ
} from 'nerv-shared'
import FullComponent from './full-component'
import { unmount } from './vdom/unmount'
import Ref from './vdom/ref'
import Component from './component'
import { invokeEffects } from './hooks'
import { Emiter } from './emiter'

const readyComponents: any[] = []

export function errorCatcher (fn: Function, component: Component<any, any>) {
  try {
    return fn()
  } catch (error) {
    errorHandler(component, error)
  }
}

function errorHandler (component: Component<any, any>, error) {
  // if(!component) { throw error ; return }
  let boundary
  while (true) {
    const { getDerivedStateFromError } = (component as any).constructor
    if (isFunction(getDerivedStateFromError) || isFunction(component.componentDidCatch)) {
      boundary = component
      break
    } else if (component._parentComponent) {
      component = component._parentComponent
    } else {
      break
    }
  }
  if (boundary) {
    const { getDerivedStateFromError } = (boundary as any).constructor
    const _disable = boundary._disable
    boundary._disable = false
    if (isFunction(getDerivedStateFromError)) {
      component.setState(getDerivedStateFromError(error))
    } else if (isFunction(component.componentDidCatch)) {
      boundary.componentDidCatch(error)
    }
    boundary._disable = _disable
  } else {
    throw error
  }
}

function ensureVirtualNode (rendered: any): VText | VVoid | VNode {
  if (isNumber(rendered) || isString(rendered)) {
    return createVText(rendered)
  } else if (isInvalid(rendered)) {
    return createVoid()
  }
  return rendered
}

export function mountVNode (vnode, parentContext: any, parentComponent?) {
  return createElement(vnode, false, parentContext, parentComponent)
}

export function mountComponent (
  vnode: FullComponent,
  parentContext: object,
  parentComponent
) {
  const ref = vnode.ref
  if (vnode.type.prototype && vnode.type.prototype.render) {
    const contextType = vnode.type.contextType
    const hasContextType = !isUndefined(contextType)
    const provider = hasContextType ? (parentContext[contextType._id] as Emiter<any>) : null
    const context = hasContextType
      ? (
        !isNullOrUndef(provider) ? provider.value : contextType._defaultValue
      )
      : parentContext
    vnode.component = new vnode.type(vnode.props, context)
  } else {
    const c = new Component(vnode.props, parentContext)
    c.render = () => vnode.type.call(c, c.props, c.context)
    vnode.component = c
  }
  const component = vnode.component
  component.vnode = vnode
  if (isComponent(parentComponent)) {
    component._parentComponent = parentComponent as any
  }
  const newState = callGetDerivedStateFromProps(vnode.props, component.state, component)
  if (!isUndefined(newState)) {
    component.state = newState
  }
  if (!hasNewLifecycle(component) && isFunction(component.componentWillMount)) {
    errorCatcher(() => {
      (component as any).componentWillMount()
    }, component)
    component.state = component.getState()
    component.clearCallBacks()
  }
  component._dirty = false
  const rendered = renderComponent(component)
  rendered.parentVNode = vnode
  component._rendered = rendered
  if (!isNullOrUndef(ref)) {
    Ref.attach(vnode, ref, vnode.dom as Element)
  }
  const dom = (vnode.dom = mountVNode(
    rendered,
    getChildContext(component, parentContext),
    component
  ) as Element)
  invokeEffects(component)
  if (isFunction(component.componentDidMount)) {
    readyComponents.push(component)
  }
  component._disable = false
  return dom
}

export function getChildContext (component, context = EMPTY_OBJ) {
  if (isFunction(component.getChildContext)) {
    return extend(clone(context), component.getChildContext())
  }
  return clone(context)
}

export function renderComponent (component: Component<any, any>) {
  CurrentOwner.current = component
  CurrentOwner.index = 0
  invokeEffects(component, true)
  let rendered
  errorCatcher(() => {
    rendered = component.render()
  }, component)
  rendered = ensureVirtualNode(rendered)
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

export function reRenderComponent (
  prev: CompositeComponent,
  current: CompositeComponent
) {
  const component = (current.component = prev.component) as any
  const nextProps = current.props
  const nextContext = current.context
  component._disable = true
  if (!hasNewLifecycle(component) && isFunction(component.componentWillReceiveProps)) {
    errorCatcher(() => {
      component.componentWillReceiveProps(nextProps, nextContext)
    }, component)
  }
  component._disable = false
  component.prevProps = component.props
  component.prevState = component.state
  component.prevContext = component.context
  component.props = nextProps
  component.context = nextContext
  if (!isNullOrUndef(current.ref)) {
    Ref.update(prev, current)
  }
  return updateComponent(component)
}

function callShouldComponentUpdate (props, state, context, component) {
  let shouldUpdate = true
  errorCatcher(() => {
    shouldUpdate = component.shouldComponentUpdate(props, state, context)
  }, component)
  return shouldUpdate
}

export function updateComponent (component, isForce = false) {
  let vnode = component.vnode
  let dom = vnode.dom
  const props = component.props
  let state = component.getState()
  const context = component.context
  const prevProps = component.prevProps || props
  const prevState = component.prevState || component.state
  const prevContext = component.prevContext || context

  const stateFromProps = callGetDerivedStateFromProps(props, state, component)

  if (!isUndefined(stateFromProps)) {
    state = stateFromProps
  }

  component.props = prevProps
  component.context = prevContext
  let skip = false
  if (
    !isForce &&
    isFunction(component.shouldComponentUpdate) &&
    callShouldComponentUpdate(props, state, context, component) === false
  ) {
    skip = true
  } else if (!hasNewLifecycle(component) && isFunction(component.componentWillUpdate)) {
    errorCatcher(() => {
      component.componentWillUpdate(props, state, context)
    }, component)
  }

  if (!isUndefined(stateFromProps)) {
    component.state = stateFromProps
  }

  component.props = props
  component.state = state
  component.context = context
  component._dirty = false
  if (!skip) {
    const lastRendered = component._rendered
    const rendered = renderComponent(component)
    rendered.parentVNode = vnode
    const childContext = getChildContext(component, context)
    const snapshot = callGetSnapshotBeforeUpdate(prevProps, prevState, component)
    const parentDom = lastRendered.dom && lastRendered.dom.parentNode
    dom = vnode.dom = patch(lastRendered, rendered, parentDom || null, childContext)
    component._rendered = rendered
    if (isFunction(component.componentDidUpdate)) {
      errorCatcher(() => {
        component.componentDidUpdate(prevProps, prevState, snapshot)
      }, component)
    }
    while (vnode = vnode.parentVNode) {
      if ((vnode.vtype & (VType.Composite)) > 0) {
        vnode.dom = dom
      }
    }
  }
  component.prevProps = component.props
  component.prevState = component.state
  component.prevContext = component.context
  component.clearCallBacks()
  flushMount()
  invokeEffects(component)
  return dom
}

export function unmountComponent (vnode: FullComponent) {
  const component = vnode.component
  component.hooks.forEach((hook) => {
    if (isFunction(hook.cleanup)) {
      hook.cleanup()
    }
  })
  if (isFunction(component.componentWillUnmount)) {
    errorCatcher(() => {
      (component as any).componentWillUnmount()
    }, component)
  }
  component._disable = true
  unmount(component._rendered)
  if (!isNullOrUndef(vnode.ref)) {
    Ref.detach(vnode, vnode.ref, vnode.dom as any)
  }
}

function callGetDerivedStateFromProps (props, state, inst) {
  const { getDerivedStateFromProps } = inst.constructor
  let newState
    // @TODO show warning
  errorCatcher(() => {
    if (isFunction(getDerivedStateFromProps)) {
      const partialState = getDerivedStateFromProps.call(
        null,
        props,
        state
      )
      if (!isUndefined(partialState)) {
        newState = extend(clone(state), partialState)
      }
    }
  }, inst)
  return newState
}

function callGetSnapshotBeforeUpdate (props, state, inst) {
  const { getSnapshotBeforeUpdate } = inst
  let snapshot
  errorCatcher(() => {
    if (isFunction(getSnapshotBeforeUpdate)) {
      snapshot = getSnapshotBeforeUpdate.call(inst, props, state)
    }
  }, inst)
  return snapshot
}

function hasNewLifecycle (component) {
  if (isFunction(component.constructor.getDerivedStateFromProps)) {
    return true
  }
  return false
}
