import { options } from 'nervjs'
import { Renderer } from './renderer'

/**
 * Wrap function with generic error logging
 *
 * @param {*} fn
 * @returns
 */
function catchErrors (fn) {
// tslint:disable-next-line: only-arrow-functions
  return function (arg?) {
    try {
      return fn(arg)
    } catch (e) {
      /* istanbul ignore next */
      console.error('The react devtools encountered an error')
      /* istanbul ignore next */
      console.error(e) // eslint-disable-line no-console
    }
  }
}

/* istanbul ignore next */
const noop = () => undefined

export function initDevTools () {
  const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
  if (hook == null) {
    return
  }

  let onCommitRoot: any = noop

  let onCommitUnmount: any = noop

  // Initialize our custom renderer
  const rid = Math.random()
    .toString(16)
    .slice(2)
  const nervRenderer = new Renderer(hook, rid)

  catchErrors(() => {
    let isDev = false
    try {
      isDev = process.env.NODE_ENV !== 'production'
    } catch (e) {
      //
    }

    // Tell devtools which bundle type we run in
    window.parent.postMessage(
      {
        source: 'react-devtools-detector',
        reactBuildType: /* istanbul ignore next */ isDev
          ? 'development'
          : 'production'
      },
      '*'
    )

    const renderer = {
      bundleType: /* istanbul ignore next */ isDev ? 1 : 0,
      version: '16.5.2',
      rendererPackageName: 'nerv',
      // We don't need this, but the devtools `attachRenderer` function relys
      // it being there.
      findHostInstanceByFiber (vnode) {
        return vnode.dom
      },
      // We don't need this, but the devtools `attachRenderer` function relys
      // it being there.
      findFiberByHostInstance (instance) {
        return nervRenderer.instMap.get(instance) || null
      }
    }

    hook._renderers[rid] = renderer

    // We can't bring our own `attachRenderer` function therefore we simply
    // prevent the devtools from overwriting our custom renderer by creating
    // a noop setter.
    Object.defineProperty(hook.helpers, rid, {
      get: () => nervRenderer,
      set: () => {
        if (!nervRenderer.connected) {
          helpers.markConnected()
        }
      }
    })

    const helpers = hook.helpers[rid]

    // Tell the devtools that we are ready to start
    hook.emit('renderer-attached', {
      id: rid,
      renderer,
      helpers
    })

    onCommitRoot = catchErrors((root) => {
      // Empty (root)
      // if (root.type === Fragment && root._children.length == 0) return

      const roots = hook.getFiberRoots(rid)
      root = helpers.handleCommitFiberRoot(root)
      if (!roots.has(root)) {
        roots.add(root)
      }
    })

    onCommitUnmount = catchErrors((vnode) => {
      hook.onCommitFiberUnmount(rid, vnode)
    })
  })()

  // Store (possible) previous hooks so that we don't overwrite them
  // const prevVNodeHook = options.vnode
  // const prevBeforeDiff = options.diff
  // const prevAfterDiff = options.diffed
  const prevAfterMount = options.afterMount
  const prevBeforeUnmount = options.beforeUnmount
  const prevAfterUpdate = options.afterUpdate
  const prevBeforeMount = options.beforeMount
  const prevBeforeUpdate = options.beforeUpdate
  const prevAfterCreate = options.afterCreate

  options.afterCreate = (vnode: any) => {
    // Tiny performance improvement by initializing fields as doubles
    // from the start. `performance.now()` will always return a double.
    // See https://github.com/facebook/react/issues/14365
    // and https://slidr.io/bmeurer/javascript-engine-fundamentals-the-good-the-bad-and-the-ugly
    vnode.startTime = NaN
    vnode.endTime = NaN

    vnode.startTime = 0
    vnode.endTime = -1
    prevAfterCreate(vnode)
  }

  options.beforeMount = (vnode: any) => {
    vnode.startTime = now()
    prevBeforeMount(vnode)
  }

  options.beforeUpdate = (vnode: any) => {
    vnode.startTime = now()
    prevBeforeUpdate(vnode)
  }

  options.afterMount = catchErrors((vnode) => {
    prevAfterMount(vnode)

    // These cases are already handled by `unmount`
    if (vnode == null) {
      return
    }
    onCommitRoot(vnode)
  })

  options.afterUpdate = catchErrors((vnode) => {
    prevAfterUpdate(vnode)

    // These cases are already handled by `unmount`
    if (vnode == null) {
      return
    }
    vnode.endTime = now()
    onCommitRoot(vnode)
  })

  options.beforeUnmount = catchErrors((vnode) => {
    // Call previously defined hook
    if (prevBeforeUnmount != null) {
      prevBeforeUnmount(vnode)
    }
    onCommitUnmount(vnode)
  })

  // Inject tracking into setState
  // const setState = Component.prototype.setState
  // Component.prototype.setState = function (update, callback) {
  //   // Duplicated in setState() but doesn't matter due to the guard.
  //   const s =
  //     (this._nextState !== this.state && this._nextState) ||
  //     (this._nextState = {...this.state})

  //   // Needed in order to check if state has changed after the tree has been committed:
  //   this._prevState = {...s}

  //   return setState.call(this, update, callback)
  // }
}

/**
 * Get current timestamp in ms. Used for profiling.
 * @returns {number}
 */
export let now = Date.now

try {
  /* istanbul ignore else */
  now = performance.now.bind(performance)
} catch (e) {
  //
}

initDevTools()
