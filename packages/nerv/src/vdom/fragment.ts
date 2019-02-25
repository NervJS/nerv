import {
    Component,
  } from '..'
import { 
    Fragment,
    VType,
    Ref
} from 'nerv-shared'
export class FragmentComponent implements Fragment{
    vtype = VType.Fragment
    type: any
    children: any
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
    init (parentContext) {
      return null
    }
  }