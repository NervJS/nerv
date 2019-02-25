import { NervContext, VType, NervProvider, NervConsumer, Ref } from 'nerv-shared'
import {
  Component,
} from '..'
export function createContext (contextValue: any): NervContext<any> {
    const context = {
      NervProvider: null as any,
      NervConsumer: null as any,
      contextValue,
      vtype: VType.NervContext,
      name: 'NervContext'
    }
    context.NervProvider = new NervProviderConsumerElement(VType.NervProvider, context)
    const Consumer = new NervProviderConsumerElement(VType.NervConsumer, context)
    context.NervConsumer = Consumer;
    return context
}
export class NervProviderConsumerElement {
  vtype: VType
  _context: any
  constructor(vtype: VType, _context: any) {
    this.vtype = vtype
    this._context = _context
  }
}
export class NervProviderWrapper implements NervProvider<any> {
  vtype = VType.NervProvider
  type: any
  name: string
  _owner: any
  props: any
  component: Component<any, any>
  context: any // 旧版
  _context: any
  key: any
  dom: Element | null
  _rendered: any
  ref: Ref

  constructor (type, props) {
    this.type = type
    this.name = type.name || type.toString().match(/^function\s*([^\s(]+)/)[1]
    type.displayName = this.name
    this._owner = props.owner
    delete props.owner
    if ((this.ref = props.ref)) {
      delete props.ref
    }
    this.props = props
    this.key = props.key || null
    this.dom = null
  }

  init (parentContext, parentComponent) {
    console.log('test test')
    return null
  }

  update (previous, current, parentContext, domNode?) {
    return null
  }

  destroy () {
    // unmountComponent(this)
  }
}

export class NervConsumerWrapper implements NervConsumer<any> {
  vtype = VType.NervConsumer
  type: any
  name: string
  _owner: any
  props: any
  component: Component<any, any>
  context: any
  _context: any
  key: any
  dom: Element | null
  _rendered: any
  ref: Ref

  constructor (type, props) {
    this.type = type
    this.name = type.name || type.toString().match(/^function\s*([^\s(]+)/)[1]
    type.displayName = this.name
    this._owner = props.owner
    delete props.owner
    if ((this.ref = props.ref)) {
      delete props.ref
    }
    console.log('props', props)
    this.props = props
    this.key = props.key || null
    this.dom = null
  }

  init (parentContext, parentComponent) {
    // return mountExoticComponentoticComponent(this, parentContext, parentComponent)
    return null
  }

  update (previous, current, parentContext, domNode?) {
    return null
  }

  destroy () {
    // unmountComponent(this)
  }
}


