import { isFunction, extend, clone } from 'nerv-utils'
import { enqueueRender } from './render-queue'
import { updateComponent } from './lifecycle'
import { Props, ComponentLifecycle } from 'nerv-shared'

interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S > {
  _rendered: any,
  dom: any
}

class Component<P, S> implements ComponentLifecycle<P, S> {
  public static defaultProps: {}
  state: Readonly<S>
  props: Readonly<P> & Readonly<Props>
  context: any
  _dirty = true
  _disable = true
  _pendingStates: any[] = []
  _pendingCallbacks: Function[]
  constructor (props?: P, context?: any) {
    if (!this.state) {
      this.state = {} as S
    }
    this.props = props || {} as P
    this.context = context || {}
  }

  setState<K extends keyof S> (state: Pick<S, K>, callback?: Function) {
    if (state) {
      (this._pendingStates = (this._pendingStates || [])).push(state)
    }
    if (isFunction(callback)) {
      (this._pendingCallbacks = (this._pendingCallbacks || [])).push(callback)
    }
    if (!this._disable) {
      enqueueRender(this)
    }
  }

  getState () {
    // tslint:disable-next-line:no-this-assignment
    const { _pendingStates, state, props } = this
    if (!_pendingStates.length) {
      return state
    }
    const stateClone = clone(state)
    const queue = _pendingStates.concat()
    this._pendingStates.length = 0
    queue.forEach((nextState) => {
      if (isFunction(nextState)) {
        nextState = nextState.call(this, state, props)
      }
      extend(stateClone, nextState)
    })
    return stateClone
  }

  forceUpdate (callback?: Function) {
    if (isFunction(callback)) {
      (this._pendingCallbacks = (this._pendingCallbacks || [])).push(callback)
    }
    updateComponent(this, true)
  }

  // tslint:disable-next-line
  public render (nextProps?: P, nextState?, nextContext?): any { }
}

export default Component
