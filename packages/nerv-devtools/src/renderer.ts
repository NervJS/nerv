import {
  getData,
  getChildren,
  getInstance,
  hasDataChanged,
  isRoot
} from './utils'

export class Renderer {
  rid: any
  pending: any[]
  connected: boolean
  instMap: WeakMap<any, any>
  hook: any

  constructor (hook, rid) {
    this.rid = rid
    this.hook = hook

    this.pending = []

    this.instMap = new WeakMap()
    this.connected = false
  }

  markConnected () {
    this.connected = true
    this.flushPendingEvents()
  }

  flushPendingEvents () {
    if (!this.connected) {
      return
    }

    const events = this.pending
    this.pending = []
    for (let i = 0; i < events.length; i++) {
      const event = events[i]
      this.hook.emit(event.type, event)
    }
  }

  mount (vnode) {
    this.instMap.set(getInstance(vnode), vnode)
    const data = getData(vnode)

    const work = [
      {
        internalInstance: vnode,
        data,
        renderer: this.rid,
        type: 'mount'
      }
    ]

    // Children must be mounted first
    if (Array.isArray(data.children)) {
      const stack = data.children.slice()
      let item
      while ((item = stack.pop()) != null) {
        const children = getChildren(item)
        stack.push(...children)

        this.instMap.set(getInstance(item), item)

        const itemData = getData(item)

        work.push({
          internalInstance: item,
          data: itemData,
          renderer: this.rid,
          type: 'mount'
        })
      }
    }

    for (let i = work.length; --i >= 0;) {
      this.pending.push(work[i])
    }

    // Special event if we have a root
    if (isRoot(vnode)) {
      this.pending.push({
        internalInstance: vnode,
        data,
        renderer: this.rid,
        type: 'root'
      })
    }
  }

  update (vnode) {
    const data = getData(vnode)

    // Children must be updated first
    if (Array.isArray(data.children)) {
      for (let i = 0; i < data.children.length; i++) {
        const child = data.children[i]
        const inst = getInstance(child)

        const prevChild = this.instMap.get(inst)
        if (prevChild == null) {
          this.mount(child)
        } else {
          this.update(child)
        }

        // Mutate child to keep referential equality intact
        data.children[i] = this.instMap.get(inst)
      }
    }

    const prev = this.instMap.get(data.publicInstance)

    // The `updateProfileTimes` event is a faster version of `updated` and
    // is processed much quicker inside the devtools extension.
    if (!hasDataChanged(prev, vnode)) {
      // Always assume profiling data has changed. When we skip an event here
      // the devtools element picker will somehow break.
      this.pending.push({
        internalInstance: prev,
        data,
        renderer: this.rid,
        type: 'updateProfileTimes'
      })
      return
    }

    this.pending.push({
      internalInstance: prev,
      data,
      renderer: this.rid,
      type: 'update'
    })
  }

  handleCommitFiberRoot (vnode) {
    const inst = getInstance(vnode)

    if (this.instMap.has(inst)) {
      this.update(vnode)
    } else {
      this.mount(vnode)
    }

    let root: any = null
    if (isRoot(vnode)) {
      vnode.treeBaseDuration = 0
      root = vnode
    } else {
      // "rootCommitted" always needs the actual root node for the profiler
      // to be able to collect timings. The `_ancestorComponent` property will
      // point to a vnode for a root node.
      root = vnode.component
      while (root._parentComponent != null) {
        root = root._parentComponent
      }
    }

    this.pending.push({
      internalInstance: root,
      renderer: this.rid,
      data: getData(root),
      type: 'rootCommitted'
    })

    this.flushPendingEvents()
    return vnode
  }

  handleCommitFiberUnmount (vnode) {
    const inst = getInstance(vnode)
    this.instMap.delete(inst)

    // Special case when unmounting a root (most prominently caused by webpack's
    // `hot-module-reloading`). If this happens we need to unmount the virtual
    // `Fragment` we're wrapping around each root just for the devtools.

    this.pending.push({
      internalInstance: vnode,
      renderer: this.rid,
      type: 'unmount'
    })
  }

  getNativeFromReactElement (vnode) {
    return vnode.dom
  }

  getReactElementFromNative (dom) {
    return this.instMap.get(dom) || null
  }

  // Unused, but devtools expects it to be there
  /* istanbul ignore next */
  // tslint:disable-next-line: no-empty
  walkTree () {}

  // Unused, but devtools expects it to be there
  /* istanbul ignore next */
  // tslint:disable-next-line: no-empty
  cleanup () {}
}
