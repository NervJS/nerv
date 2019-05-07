import { Component, options } from 'nervjs'
import { isFunction, isString, isArray } from 'nerv-utils'

export function getNodeType (vnode) {
  if (isFunction(vnode.type)) {
    return 'Composite'
  } else if (isString(vnode.type)) {
    return 'Native'
  }
  return 'Text'
}

export function getDisplayName (vnode): string {
  if (isFunction(vnode.type)) {
    return vnode.type.displayName || vnode.type.name
  } else if (isString(vnode.type)) {
    return vnode.type
  }
  return '#text'
}

export function setIn (obj, path, value) {
  const last = path.pop()
  const parent = path.reduce((acc, attr) => (acc ? acc[attr] : null), obj)
  if (parent) {
    parent[last] = value
  }
}

function isEqual (a) {
  return (b) => a === b
}

export function isRoot (vnode) {
  return options.roots.some(isEqual(vnode))
}

export function getInstance (vnode) {
  if (vnode.component) {
    return vnode.component
  }
  return vnode.dom
}

export function shallowEqual (a, b, isProps?) {
  if (a == null || b == null) {
    return false
  }

  for (const key in a) {
    if (isProps && key === 'children' && b[key] != null) {
      continue
    }
    if (a[key] !== b[key]) {
      return false
    }
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }
  return true
}

export function hasDataChanged (prev, next) {
  return (
    (prev.props !== next.props &&
      !shallowEqual(prev.props, next.props, true)) ||
    (prev.component != null &&
      !shallowEqual(next.component.prevState, next.component.state)) ||
    // prev.vnode.dom !== next.vnode.dom || @FIXME
    prev.ref !== next.ref
  )
}

export function getChildren (vnode) {
  const c = vnode.component

  if (c == null) {
    if (vnode.children) {
      if (isArray(vnode.children)) {
        return vnode.children.slice()
      }
      return [vnode.children]
    }
    return []
  }

  return !Array.isArray(c._rendered) && c._rendered != null
    ? [c._rendered]
    : null
}

export function getData (_vnode) {
  const vnode = _vnode instanceof Component ? _vnode.vnode : _vnode
  const component = vnode.component
  let updater: any = null

  if (component && component instanceof Component) {
    updater = {
      setState: component.setState.bind(component),
      forceUpdate: component.forceUpdate.bind(component),
      setInState (path, value) {
        component.setState((prev) => {
          setIn(prev, path, value)
          return prev
        })
      },
      setInProps (path, value) {
        setIn(vnode.props, path, value)
        component.setState({})
      },
      setInContext (path, value) {
        setIn(component.context, path, value)
        component.setState({})
      }
    }
  }

  const duration = vnode.endTime - vnode.startTime
  const children = getChildren(vnode)

  return {
    nodeType: getNodeType(vnode),
    type: vnode.type,
    name: getDisplayName(vnode),
    ref: vnode.ref || null,
    key: vnode.key || null,
    updater,
    text: vnode.text,
    state:
      component != null && component instanceof Component
        ? component.state
        : null,
    props: vnode.props,
    // The devtools inline text children if they are the only child
    children:
      vnode.text == null
        ? children != null && children.length === 1 && children[0].text != null
          ? children[0].text
          : children
        : null,
    publicInstance: getInstance(vnode),
    memoizedInteractions: [],

    // Profiler data
    actualDuration: duration,
    actualStartTime: vnode.startTime,
    treeBaseDuration: duration
  }
}
