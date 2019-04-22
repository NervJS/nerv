import { Component } from 'nervjs'
import { isNullOrUndef, ComponentLifecycle } from 'nerv-shared'
import { isFunction, isUndefined } from 'nerv-utils'

export interface Mixin<P, S> extends ComponentLifecycle<P, S> {
  statics?: {
    [key: string]: any
  }
  mixins?: any

  displayName?: string
  propTypes?: { [index: string]: Function }

  getDefaultProps? (): P
  getInitialState? (): S
}

export interface ComponentClass<P, S> extends Mixin<P, S> {
  propTypes?: {}
  contextTypes?: {}
  childContextTypes?: {}
  defaultProps?: P
  displayName?: string
  new (props?: P, context?: any): Component<P, S>
}

export interface ComponentSpec<P, S> extends Mixin<P, S> {
  [propertyName: string]: any
  render (props?, context?): any
}

export interface ClassicComponent<P, S> extends Component<P, S> {
  replaceState (nextState: S, callback?: () => any): void
  isMounted (): boolean
  getInitialState? (): S
}

export interface ClassicComponentClass<P, S> extends ComponentClass<P, S> {
  new (props?: P, context?: any): ClassicComponent<P, S>
  getDefaultProps? (): P
}

// don't autobind these methods since they already have guaranteed context.
const AUTOBIND_BLACKLIST = {
  constructor: 1,
  render: 1,
  shouldComponentUpdate: 1,
  // tslint:disable-next-line:object-literal-sort-keys
  componentWillUpdate: 1,
  componentWillReceiveProps: 1,
  componentDidUpdate: 1,
  componentWillMount: 1,
  componentDidMount: 1,
  componentWillUnmount: 1,
  componentDidUnmount: 1,
  getDerivedStateFromProps: 1
}

function extend (base, props) {
  for (const key in props) {
    if (!isNullOrUndef(props[key])) {
      base[key] = props[key]
    }
  }
  return base
}

function bindAll<P, S> (ctx: Component<P, S>) {
  for (const i in ctx) {
    const v = ctx[i]
    if (typeof v === 'function' && !v.__bound && AUTOBIND_BLACKLIST[i] !== 1) {
      (ctx[i] = v.bind(ctx)).__bound = true
    }
  }
}

function collateMixins (mixins: Function[] | any[], keyed = {}): any {
  for (let i = 0, len = mixins.length; i < len; i++) {
    const mixin = mixins[i]

    if (mixin.mixins) {
      // Recursively collate sub-mixins
      collateMixins(mixin.mixins, keyed)
    }

    for (const key in mixin as Function[]) {
      if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
        (keyed[key] || (keyed[key] = [])).push(mixin[key])
      }
    }
  }
  return keyed
}

function multihook (hooks: Function[], mergeFn?: Function): any {
  return function () {
    let ret

    for (let i = 0, len = hooks.length; i < len; i++) {
      const hook = hooks[i]
      const r = hook.apply(this, arguments)

      if (mergeFn) {
        ret = mergeFn(ret, r)
      } else if (!isUndefined(r)) {
        ret = r
      }
    }

    return ret
  }
}

function mergeNoDupes (previous: any, current: any) {
  if (!isUndefined(current)) {
    if (!previous) {
      previous = {}
    }

    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        if (previous.hasOwnProperty(key)) {
          throw new Error(
            `Mixins return duplicate key ${key} in their return values`
          )
        }

        previous[key] = current[key]
      }
    }
  }
  return previous
}

function applyMixin<P, S> (
  key: string,
  inst: Component<P, S>,
  mixin: Function[]
): void {
  const hooks = isUndefined(inst[key]) ? mixin : mixin.concat(inst[key])
  inst[key] =
    key === 'getDefaultProps' ||
    key === 'getInitialState' ||
    key === 'getChildContext'
      ? multihook(hooks, mergeNoDupes)
      : multihook(hooks)
}

function applyMixins (Cl: any, mixins: Function[] | any[]) {
  for (const key in mixins) {
    if (mixins.hasOwnProperty(key)) {
      const mixin = mixins[key]

      const inst = key === 'getDefaultProps' ? Cl : Cl.prototype

      if (isFunction(mixin[0])) {
        applyMixin(key, inst, mixin)
      } else {
        inst[key] = mixin
      }
    }
  }
}

export default function createClass<P, S> (
  obj: ComponentSpec<P, S>
): ClassicComponentClass<P, S> {
  class BoundClass extends Component<P, S> {
    static defaultProps
    static displayName = obj.displayName || 'Component'
    static propTypes = obj.propTypes
    static mixins = obj.mixins && collateMixins(obj.mixins)
    static getDefaultProps = obj.getDefaultProps

    constructor (props, context) {
      super(props, context)
      bindAll(this)
      if (this.getInitialState) {
        this.state = this.getInitialState()
      }
    }

    getInitialState? (): S

    replaceState (nextState: S, callback?: () => any) {
      this.setState(nextState, callback)
    }

    isMounted (): boolean {
      return !this.dom
    }
  }

  extend(BoundClass.prototype, obj)

  if (obj.statics) {
    extend(BoundClass, obj.statics)
  }

  if (obj.mixins) {
    applyMixins(BoundClass, collateMixins(obj.mixins))
  }

  BoundClass.defaultProps = isUndefined(BoundClass.getDefaultProps)
    ? undefined
    : BoundClass.getDefaultProps()

  return BoundClass
}
