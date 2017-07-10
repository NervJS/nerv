import Events from './events'
import { isFunction, extend, clone } from './util'
import { enqueueRender } from './render-queue'
import { updateComponent } from './lifecycle'

class Component extends Events {
  constructor (props, context) {
    super()
    if (!this.state) {
      this.state = {}
    }
    this.props = props || {}
    this.context = context || {}

    this._dirty = true
    this._disable = true
  }

  setState (state, callback) {
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
    const { _pendingStates = [], state, props } = this
    if (!_pendingStates.length) {
      return state
    }
    const stateClone = clone(state)
    const queue = _pendingStates.concat()
    this._pendingStates.length = 0
    queue.forEach(nextState => {
      if (isFunction(nextState)) {
        nextState = nextState.call(this, state, props)
      }
      extend(stateClone, nextState)
    })
    return stateClone
  }

  forceUpdate () {
    updateComponent(this, true)
  }
}

export default Component
