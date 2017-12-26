// tslint:disable-next-line:no-var-requires
import { options } from 'nervjs'
import { isComposite, isWidget, isVText, isValidElement } from 'nerv-shared'
import { isArray } from 'nerv-utils'

/**
 * Return a ReactElement-compatible object for the current state of a Nerv
 * component.
 */
function createReactElement (vnode) {
  return {
    type: vnode.type,
    key: vnode.key,
    ref: null,
    props: vnode.props
  }
}

function normalizeChildren (children) {
  if (isArray(children)) {
    return children.filter(isValidElement).map(updateReactComponent)
  } else {
    return isValidElement(children) ? [updateReactComponent(children)] : []
  }
}

/**
 * Create a ReactDOMComponent-compatible object for a given DOM node rendered
 * by Nerv.
 *
 * This implements the subset of the ReactDOMComponent interface that
 * React DevTools requires in order to display DOM nodes in the inspector with
 * the correct type and properties.
 *
 * @param {Node} node
 */
function createReactDOMComponent (vnode) {
  const isText = isVText(vnode)

  return {
    // --- ReactDOMComponent interface
    _currentElement: isText
      ? vnode.text
      : {
          type: vnode.type,
          props: normalizeProps(vnode.props)
        },
    _renderedChildren: normalizeChildren(vnode.children),
    _stringText: isText ? vnode.text : null,

    // --- Additional properties used by Nerv devtools

    // A flag indicating whether the devtools have been notified about the
    // existence of this component instance yet.
    // This is used to send the appropriate notifications when DOM components
    // are added or updated between composite component updates.
    _inDevTools: false,
    node: !isText ? vnode.dom : null
  }
}

/**
 * Return the name of a component created by a `ReactElement`-like object.
 *
 * @param {ReactElement} element
 */
function typeName (element) {
  if (typeof element.type === 'function') {
    return element.type.displayName || element.type.name
  }
  return element.type
}

function normalizeProps (_props) {
  const props = { ..._props }
  delete props.owner
  return props
}

/**
 * Return a ReactCompositeComponent-compatible object for a given Nerv
 * component instance.
 *
 * This implements the subset of the ReactCompositeComponent interface that
 * the DevTools requires in order to walk the component tree and inspect the
 * component's properties.
 *
 * See https://github.com/facebook/react-devtools/blob/e31ec5825342eda570acfc9bcb43a44258fceb28/backend/getData.js
 */
function createReactCompositeComponent (vnode) {
  const isCompositeComponent = isComposite(vnode)
  const _currentElement = createReactElement(vnode)
  const component = isCompositeComponent ? vnode.component : vnode
  const node = component.dom

  const instance: any = {
    // --- ReactDOMComponent properties
    getName () {
      return typeName(_currentElement)
    },
    _currentElement: createReactElement(vnode),
    props: normalizeProps(component.props),
    state: component.state,
    forceUpdate: component.forceUpdate && component.forceUpdate.bind(component),
    setState: component.setState && component.setState.bind(component),

    // --- Additional properties used by Nerv devtools
    node
  }

  // React DevTools exposes the `_instance` field of the selected item in the
  // component tree as `$r` in the console.  `_instance` must refer to a
  // React Component (or compatible) class instance with `props` and `state`
  // fields and `setState()`, `forceUpdate()` methods.
  instance._instance = component

  // If the root node returned by this component instance's render function
  // was itself a composite component, there will be a `_component` property
  // containing the child component instance.
  // Otherwise, if the render() function returned an HTML/SVG element,
  // create a ReactDOMComponent-like object for the DOM node itself.
  instance._renderedComponent = updateReactComponent(component._rendered)
  return instance
}

/**
 * Map of Component|Node to ReactDOMComponent|ReactCompositeComponent-like
 * object.
 *
 * The same React*Component instance must be used when notifying devtools
 * about the initial mount of a component and subsequent updates.
 */
const instanceMap = new Map()

/**
 * Update (and create if necessary) the ReactDOMComponent|ReactCompositeComponent-like
 * instance for a given Nerv component instance or DOM Node.
 *
 * @param {Component|Node} componentOrNode
 */
function updateReactComponent (vnode) {
  const newInstance = !isWidget(vnode)
    ? createReactDOMComponent(vnode)
    : createReactCompositeComponent(vnode)
  if (instanceMap.has(vnode)) {
    const inst = instanceMap.get(vnode)
    Object.assign(inst, newInstance)
    return inst
  }
  instanceMap.set(getKeyForVNode(vnode), newInstance)
  return newInstance
}

function nextRootKey (roots) {
  return '.' + Object.keys(roots).length
}

function getKeyForVNode (vnode) {
  return vnode._instance || vnode.component || vnode
}

function getInstanceFromVNode (vnode) {
  const key = getKeyForVNode(vnode)
  return instanceMap.get(key)
}

/**
 * Find all root component instances rendered by Nerv in `node`'s children
 * and add them to the `roots` map.
 *
 * @param {DOMElement} node
 * @param {[key: string] => ReactDOMComponent|ReactCompositeComponent}
 */
function findRoots (node, roots) {
  Array.from(node.childNodes).forEach((child: any) => {
    if (child._component) {
      roots[nextRootKey(roots)] = updateReactComponent(child._component)
    } else {
      findRoots(child, roots)
    }
  })
}

/**
 * Create a bridge for exposing Nerv's component tree to React DevTools.
 *
 * It creates implementations of the interfaces that ReactDOM passes to
 * devtools to enable it to query the component tree and hook into component
 * updates.
 *
 * See https://github.com/facebook/react/blob/59ff7749eda0cd858d5ee568315bcba1be75a1ca/src/renderers/dom/ReactDOM.js
 * for how ReactDOM exports its internals for use by the devtools and
 * the `attachRenderer()` function in
 * https://github.com/facebook/react-devtools/blob/e31ec5825342eda570acfc9bcb43a44258fceb28/backend/attachRenderer.js
 * for how the devtools consumes the resulting objects.
 */
function createDevToolsBridge () {
  // The devtools has different paths for interacting with the renderers from
  // React Native, legacy React DOM and current React DOM.
  //
  // Here we emulate the interface for the current React DOM (v15+) lib.

  // ReactDOMComponentTree-like object
  const ComponentTree = {
    getNodeFromInstance (instance) {
      return instance.node
    },
    getClosestInstanceFromNode (node) {
      while (node && !node._component) {
        node = node.parentNode
      }
      return node ? updateReactComponent(node._component) : null
    }
  }

  // Map of root ID (the ID is unimportant) to component instance.
  const roots = {}
  findRoots(document.body, roots)

  // ReactMount-like object
  //
  // Used by devtools to discover the list of root component instances and get
  // notified when new root components are rendered.
  const Mount: any = {
    _instancesByReactRootID: roots,

    // Stub - React DevTools expects to find this method and replace it
    // with a wrapper in order to observe new root components being added
    // tslint:disable-next-line:no-empty
    _renderNewRootComponent (/* instance, ... */) {}
  }

  // ReactReconciler-like object
  const Reconciler: any = {
    // Stubs - React DevTools expects to find these methods and replace them
    // with wrappers in order to observe components being mounted, updated and
    // unmounted
    // tslint:disable-next-line:no-empty
    mountComponent (/* instance, ... */) {},
    // tslint:disable-next-line:no-empty
    performUpdateIfNecessary (/* instance, ... */) {},
    // tslint:disable-next-line:no-empty
    receiveComponent (/* instance, ... */) {},
    // tslint:disable-next-line:no-empty
    unmountComponent (/* instance, ... */) {}
  }

  /** Notify devtools that a new component instance has been mounted into the DOM. */
  const componentAdded = (vnode) => {
    const instance = updateReactComponent(vnode)
    // if is root component
    if (vnode.dom) {
      instance._rootID = nextRootKey(roots)
      roots[instance._rootID] = instance
      Mount._renderNewRootComponent(instance)
    }
    visitNonCompositeChildren(instance, (childInst) => {
      childInst._inDevTools = true
      Reconciler.mountComponent(childInst)
    })
    Reconciler.mountComponent(instance)
  }

  /** Notify devtools that a component has been updated with new props/state. */
  const componentUpdated = (component) => {
    const prevRenderedChildren: any[] = []
    visitNonCompositeChildren(getInstanceFromVNode(component), (childInst) => {
      prevRenderedChildren.push(childInst)
    })

    // Notify devtools about updates to this component and any non-composite
    // children
    const instance = updateReactComponent(component)
    Reconciler.receiveComponent(instance)
    console.log(instance)
    visitNonCompositeChildren(instance, (childInst) => {
      if (!childInst._inDevTools) {
        // New DOM child component
        childInst._inDevTools = true
        Reconciler.mountComponent(childInst)
      } else {
        // Updated DOM child component
        Reconciler.receiveComponent(childInst)
      }
    })

    // For any non-composite children that were removed by the latest render,
    // remove the corresponding ReactDOMComponent-like instances and notify
    // the devtools
    prevRenderedChildren.forEach((childInst) => {
      if (!document.body.contains(childInst.node)) {
        instanceMap.delete(childInst.node)
        Reconciler.unmountComponent(childInst)
      }
    })
  }

  /** Notify devtools that a component has been unmounted from the DOM. */
  const componentRemoved = (component) => {
    const instance = updateReactComponent(component)
    visitNonCompositeChildren((childInst) => {
      instanceMap.delete(childInst.node)
      Reconciler.unmountComponent(childInst)
    })
    Reconciler.unmountComponent(instance)
    instanceMap.delete(component)
    if (instance._rootID) {
      delete roots[instance._rootID]
    }
  }

  return {
    componentAdded,
    componentUpdated,
    componentRemoved,

    // Interfaces passed to devtools via __REACT_DEVTOOLS_GLOBAL_HOOK__.inject()
    ComponentTree,
    Mount,
    Reconciler
  }
}

/**
 * Visit all child instances of a ReactCompositeComponent-like object that are
 * not composite components (ie. they represent DOM elements or text)
 *
 * @param {Component} component
 * @param {(Component) => void} visitor
 */
function visitNonCompositeChildren (component, visitor?) {
  if (component._renderedComponent) {
    if (!component._renderedComponent._component) {
      visitor(component._renderedComponent)
      visitNonCompositeChildren(component._renderedComponent, visitor)
    }
  } else if (component._renderedChildren) {
    component._renderedChildren.forEach((child) => {
      visitor(child)
      if (!child._component) {
        visitNonCompositeChildren(child, visitor)
      }
    })
  }
}

/**
 * Create a bridge between the Nerv component tree and React's dev tools
 * and register it.
 *
 * After this function is called, the React Dev Tools should be able to detect
 * "React" on the page and show the component tree.
 *
 * This function hooks into Nerv VNode creation in order to expose functional
 * components correctly, so it should be called before the root component(s)
 * are rendered.
 *
 * Returns a cleanup function which unregisters the hooks.
 */
export function initDevTools () {
  if (typeof window['__REACT_DEVTOOLS_GLOBAL_HOOK__'] === 'undefined') {
    // React DevTools are not installed
    return
  }

  // Notify devtools when Nerv components are mounted, updated or unmounted
  const bridge = createDevToolsBridge()

  const nextAfterMount = options.afterMount
  options.afterMount = (component) => {
    bridge.componentAdded(component)
    if (nextAfterMount) {
      nextAfterMount(component)
    }
  }

  const nextAfterUpdate = options.afterUpdate
  options.afterUpdate = (component) => {
    bridge.componentUpdated(component)
    if (nextAfterUpdate) {
      nextAfterUpdate(component)
    }
  }

  const nextBeforeUnmount = options.beforeUnmount
  options.beforeUnmount = (component) => {
    bridge.componentRemoved(component)
    if (nextBeforeUnmount) {
      nextBeforeUnmount(component)
    }
  }

  // Notify devtools about this instance of "React"
  window['__REACT_DEVTOOLS_GLOBAL_HOOK__'].inject(bridge)
  return () => {
    options.afterMount = nextAfterMount
    options.afterUpdate = nextAfterUpdate
    options.beforeUnmount = nextBeforeUnmount
  }
}
