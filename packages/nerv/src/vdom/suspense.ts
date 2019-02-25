import { VType, Suspense, Ref } from 'nerv-shared'
import { isArray, doc } from 'nerv-utils'
import { createElement } from './create-element'
import {
  isInvalid,
} from 'nerv-shared'
import {
  Component,
} from '..'
export class SuspenseElement {
  vtype: VType
  lazyComponent: any
  constructor(vtype: VType, lazyComponent: any) {
    this.vtype = vtype
    this.lazyComponent = lazyComponent
  }
}
export class SuspenseComponent implements Suspense {
    vtype = VType.Suspense
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
    lazyComponent: any
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
    init (parentContext, parentComponent) { return null }
    public suspenseCallback(lazyFunction) {
      let primaryChild = new lazyFunction()
      console.log('primaryChild', primaryChild)

      // todo: re-render SuspenseComponent
    }
    initSuspenseComponent (parentContext, parentComponent, isSvg) {
      console.log('test test', this.props)
      let domNode = doc.createDocumentFragment()
      let children = this.props.fallback
      if(!isArray(children)) { children = [children]}
      children.map && children.map((child) => {
        if (!isInvalid(child)) {
          const childNode = createElement(child, isSvg, parentContext, parentComponent)
          if (childNode) {
            domNode.appendChild(childNode)
          }
        }
      });
      return domNode
    }
  
    update (previous, current, parentContext, domNode?) {
      return null
    }
  
    destroy () {
      // unmountComponent(this)
    }
  }
  