const options: {
  afterMount: null | Function
  afterRender: null | Function
  afterUpdate: null | Function
  beforeRender: null | Function
  beforeUnmount: null | Function
  findDOMNodeEnabled: boolean
  roots: Object
} = {
    afterMount: null,
    afterRender: null,
    afterUpdate: null,
    beforeRender: null,
    beforeUnmount: null,
    findDOMNodeEnabled: false,
    roots: {}
  }

const instanceMap = new Map()

function findVNodeFromDOM (vnode, dom) {
  if (!vnode) {
    const { roots } = options
    for (const i in roots) {
      const root = roots[i]
      const result = findVNodeFromDOM(root, dom)
      if (result) {
        return result
      }
    }
  } else {
    if (vnode.node === dom) {
      return vnode
    }

    const children = vnode._renderedChildren

    if (children) {
      for (const child of children) {
        if (child) {
          const result = findVNodeFromDOM(child, dom)

          if (result) {
            return result
          }
        }
      }
    }
  }
}

function getKeyForVNode (vnode) {
  return vnode.component || vnode.dom
}

function getInstanceFromVNode (vnode) {
  const key = getKeyForVNode(vnode)
  return instanceMap.get(key)
}
/**
 * Return a ReactCompositeComponent-compatible object for a given Inferno
 * component instance.
 *
 * This implements the subset of the ReactCompositeComponent interface that
 * the DevTools requires in order to walk the component tree and inspect the
 * component's properties.
 *
 * See https://github.com/facebook/react-devtools/blob/e31ec5825342eda570acfc9bcb43a44258fceb28/backend/getData.js
 */
function createReactCompositeComponent (vnode) {
  const type = vnode.type
  const typeName = type.displayName || type.name
  const instance = vnode.component
  const dom = vnode.dom
  return {
    getName () {
      return typeName
    },

    type,
    _instance: instance,
    state: instance.state,
    node: dom,
    props: instance.props,
    _currentElement: {
      type,
      key: normalizeKey(vnode.key),
      props: vnode.props,
      ref: null
    },
    _renderedComponent: updateReactComponent(instance._rendered, dom),
    forceUpdate: instance.forceUpdate.bind(instance),
    setState: instance.setState.bind(instance)
  }
}

function normalizeKey (key) {
  if (key && key[0] === '.') {
    return null
  }
}

function createReactDOMComponent (vnode, parentDom) {
  const { type, props, dom } = vnode

  const isText = type === 'VirtualText'
  return {
    _currentElement: isText ? vnode.text + '' : {
      type,
      props
    },
    _inDevTools: false,
    _renderedChildren: !isText && normalizeChildren(props.children, dom),
    _stringText: isText ? vnode.text + '' : null,
    node: dom || parentDom
  }
}

const normalizeChildren = (children, dom) =>
  children.map((child) =>
    updateReactComponent(child, dom)
)

/**
 * Update (and create if necessary) the ReactDOMComponent|ReactCompositeComponent-like
 * instance for a given Inferno component instance or DOM Node.
 */
function updateReactComponent (vnode, parentDom) {
  if (!vnode) {
    return null
  }
  const newInstance = vnode._instance
    ? createReactCompositeComponent(vnode)
    : createReactDOMComponent(vnode, parentDom)

  const oldInstance = getInstanceFromVNode(vnode)

  if (oldInstance) {
    Object.assign(oldInstance, newInstance)
    return oldInstance
  }
  instanceMap.set(getKeyForVNode(vnode), newInstance)
  return newInstance
}

/**
 * Create a bridge for exposing Inferno's component tree to React DevTools.
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
  const ComponentTree = {
    getNodeFromInstance (instance) {
      return instance.node
    },
    getClosestInstanceFromNode (dom) {
      const vNode = findVNodeFromDOM(null, dom)

      return vNode ? updateReactComponent(vNode, null) : null
    }
  }

  // Map of root ID (the ID is unimportant) to component instance.
  // tslint:disable-next-line:no-shadowed-variable
  const roots = {}

  findRoots(document.body, roots)

  const Mount = {
    _instancesByReactRootID: roots,
    // tslint:disable-next-line:no-empty
    _renderNewRootComponent (instance) { }
  }

  const Reconciler = {
    // tslint:disable-next-line:no-empty
    mountComponent (instance) { },
    // tslint:disable-next-line:no-empty
    performUpdateIfNecessary (instance) { },
    // tslint:disable-next-line:no-empty
    receiveComponent (instance) { },
    // tslint:disable-next-line:no-empty
    unmountComponent (instance) { }
  }

  const queuedMountComponents = new Map()
  const queuedReceiveComponents = new Map()
  const queuedUnmountComponents = new Map()

  const queueUpdate = (updater, map, component) => {
    if (!map.has(component)) {
      map.set(component, true)
      requestAnimationFrame(() => {
        updater(component)
        map.delete(component)
      })
    }
  }

  const queueMountComponent = (component) =>
    queueUpdate(Reconciler.mountComponent, queuedMountComponents, component)
  const queueReceiveComponent = (component) =>
    queueUpdate(
      Reconciler.receiveComponent,
      queuedReceiveComponents,
      component
    )
  const queueUnmountComponent = (component) =>
    queueUpdate(
      Reconciler.unmountComponent,
      queuedUnmountComponents,
      component
    )

  /** Notify devtools that a new component instance has been mounted into the DOM. */
  const componentAdded = (vNode) => {
    const instance = updateReactComponent(vNode, null)
    if (isRootVNode(vNode)) {
      instance._rootID = nextRootKey(roots)
      roots[instance._rootID] = instance
      Mount._renderNewRootComponent(instance)
    }
    visitNonCompositeChildren(instance, (childInst) => {
      if (childInst) {
        childInst._inDevTools = true
        queueMountComponent(childInst)
      }
    })
    queueMountComponent(instance)
  }

  /** Notify devtools that a component has been updated with new props/state. */
  const componentUpdated = (vNode) => {
    const prevRenderedChildren: any[] = []

    visitNonCompositeChildren(getInstanceFromVNode(vNode), (childInst) => {
      prevRenderedChildren.push(childInst)
    })

    // Notify devtools about updates to this component and any non-composite
    // children
    const instance = updateReactComponent(vNode, null)
    queueReceiveComponent(instance)
    visitNonCompositeChildren(instance, (childInst) => {
      if (!childInst._inDevTools) {
        // New DOM child component
        childInst._inDevTools = true
        queueMountComponent(childInst)
      } else {
        // Updated DOM child component
        queueReceiveComponent(childInst)
      }
    })

    // For any non-composite children that were removed by the latest render,
    // remove the corresponding ReactDOMComponent-like instances and notify
    // the devtools
    prevRenderedChildren.forEach((childInst) => {
      if (!document.body.contains(childInst.node)) {
        deleteInstanceForVNode(childInst.vNode)
        queueUnmountComponent(childInst)
      }
    })
  }

  /** Notify devtools that a component has been unmounted from the DOM. */
  const componentRemoved = (vNode) => {
    const instance = updateReactComponent(vNode, null)

    visitNonCompositeChildren((childInst) => {
      deleteInstanceForVNode(childInst.vNode)
      queueUnmountComponent(childInst)
    })
    queueUnmountComponent(instance)
    deleteInstanceForVNode(vNode)
    if (instance._rootID) {
      delete roots[instance._rootID]
    }
  }

  return {
    ComponentTree,
    Mount,
    Reconciler,

    componentAdded,
    componentRemoved,
    componentUpdated
  }
}

function deleteInstanceForVNode (vNode) {
  const key = getKeyForVNode(vNode)
  instanceMap.delete(key)
}

function isRootVNode (vnode) {
  const { roots } = options
  for (const i in roots) {
    if (roots[i] === vnode) {
      return true
    }
  }
  return false
}

function nextRootKey (roots) {
  return '.' + Object.keys(roots).length
}

/**
 * Find all root component instances rendered by Inferno in `node`'s children
 * and add them to the `roots` map.
 */
function findRoots (node, roots) {
  [...node.childNodes].forEach((child) => {
    if (child.component) {
      roots[nextRootKey(roots)] = updateReactComponent(child.component, null)
    } else {
      findRoots(child, roots)
    }
  })
}

/**
 * Visit all child instances of a ReactCompositeComponent-like object that are
 * not composite components (ie. they represent DOM elements or text)
 */
function visitNonCompositeChildren (component, visitor?) {
  if (component._renderedComponent) {
    if (!component._renderedComponent._component) {
      visitor(component._renderedComponent)
      visitNonCompositeChildren(component._renderedComponent, visitor)
    }
  } else if (component._renderedChildren) {
    component._renderedChildren.forEach((child) => {
      if (child) {
        visitor(child)
        if (!child._component) {
          visitNonCompositeChildren(child, visitor)
        }
      }
    })
  }
}

function initDevTools () {
  /* tslint:disable */
  if (typeof window["__REACT_DEVTOOLS_GLOBAL_HOOK__"] === "undefined") {
    /* tslint:enable */
    // React DevTools are not installed
    return
  }
  // Notify devtools when preact components are mounted, updated or unmounted
  const bridge = createDevToolsBridge()
  const nextAfterMount = options.afterMount

  options.afterMount = (vnode) => {
    bridge.componentAdded(vnode)
    if (nextAfterMount) {
      nextAfterMount(vnode)
    }
  }
  const nextAfterUpdate = options.afterUpdate

  options.afterUpdate = (vnode) => {
    bridge.componentUpdated(vnode)
    if (nextAfterUpdate) {
      nextAfterUpdate(vnode)
    }
  }
  const nextBeforeUnmount = options.beforeUnmount

  options.beforeUnmount = (vnode) => {
    bridge.componentRemoved(vnode)
    if (nextBeforeUnmount) {
      nextBeforeUnmount(vnode)
    }
  }
  // Notify devtools about this instance of "React"
  /* tslint:disable */
  window["__REACT_DEVTOOLS_GLOBAL_HOOK__"].inject(bridge)
  /* tslint:enable */
  return () => {
    options.afterMount = nextAfterMount
    options.afterUpdate = nextAfterUpdate
    options.beforeUnmount = nextBeforeUnmount
  }
}

initDevTools()
