import Events from './events'
import { isFunction, extend, clone } from './util'
import { enqueueRender } from './render-queue'

class Component extends Events {
  constructor (props, context) {
    super()
    this._dirty = true
    if (!this.state) {
      this.state = {}
    }
    this.props = props || {}
    this.props = extend(clone(this.constructor.defaultProps || {}), this.props)
    this.context = context || {}
  }

  setState (state, callback) {
    if (!this.prevState) {
      this.prevState = clone(this.state)
    }
    if (isFunction(state)) {
      state = state(this.state, this.props)
    }
    extend(this.state, state)
    if (callback) {
      (this._renderCallbacks = (this._renderCallbacks || [])).push(callback)
    }
    enqueueRender(this)
  }
}

export default Component
