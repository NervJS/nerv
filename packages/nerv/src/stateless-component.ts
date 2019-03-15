import { VType } from 'nerv-shared'
import { isFunction } from 'nerv-utils'
import {
  mountStatelessComponent,
  unmountStatelessComponent,
  reRenderStatelessComponent
} from './lifecycle'
import { CurrentHook } from './hooks'

class StateLessComponent {
  vtype = VType.Stateless
  type: Function
  name: string
  _owner: any
  props: any
  _rendered: any
  key: any
  dom: Element | null
  parentContext: any
  isRendering = false
  hooks = {
    component: this,
    list: [] as any[],
    effects: [] as any[],
    layoutEffects: [] as any
  } as any

  constructor (type, props) {
    this.type = type
    this._owner = props.owner
    delete props.owner
    this.props = props
    this.key = props.key
  }

  init (parentContext) {
    // this.parentContext = parentContext
    CurrentHook.component = this
    CurrentHook.index = 0
    const dom = mountStatelessComponent(this, parentContext)
    return dom
  }

  update (previous: this, current: this, parentContext) {
    // this.parentContext = parentContext
    const { props } = current
    CurrentHook.component = this
    CurrentHook.index = 0
    const shouldComponentUpdate = props.onShouldComponentUpdate
    if (
      isFunction(shouldComponentUpdate) &&
      !shouldComponentUpdate(previous.props, props)
    ) {
      current._rendered = previous._rendered
      return previous.dom
    }
    const dom = reRenderStatelessComponent(previous, this, parentContext, previous.dom)
    return dom
  }

  forceUpdate () {
    this.update(this, this, this.parentContext)
  }

  destroy () {
    unmountStatelessComponent(this)
  }
}

export default StateLessComponent
