import { LazyELement, LazyComponent, VType, Ref} from 'nerv-shared'
import { Component } from '..'
import { SuspenseElement } from './suspense';
export const Rejected = 0
export const Pending = 1
export const Resolved = 2
export function lazy (importFunction: ()=> Promise<any>): LazyELement {
  let lazyComponent= importFunction && importFunction()
  let lazy = {
    status: -1,
    result: lazyComponent,
    toImport: importFunction,
    vtype: VType.LazyComponent,
    name: 'LazyComponent',
    Suspense: null as any,
    SuspenseComponent: null as any
  }
  lazy.Suspense = new SuspenseElement(VType.Suspense, lazy)
  return lazy
}
export class LazyComponentWrapper implements LazyComponent {
  vtype = VType.LazyComponent
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
  init (parentContext) {
    return null
  }

  update (previous, current, parentContext, domNode?) {
    return null
  }

  destroy () {
    return null
  }
  initLazyComponent(parentContext, parentComponent, isSvg) {
    // let domNode = doc.createDocumentFragment()
    // let children = this.props.children
    // if(!isArray(children)) { children = [children]}
    // children.map && children.map((child) => {
    //   if (!isInvalid(child)) {
    //     const childNode = createElement(child, isSvg, parentContext, parentComponent)
    //     if (childNode) {
    //       domNode.appendChild(childNode)
    //     }
    //   }
    // });
    // return domNode
    console.log('initLazyComponent', this)
    // let type = this.type
    // let replaceChildCallback = this.props.replaceChildCallback
    this.readLazyComponent(this.type)
  }

  readLazyComponent(component) {
  
    let status = component.status
    let result = component.result
    switch(status) {
      case Resolved: {
        return result
      }
      case Rejected: {
        // const error = result;
        // throw error;
      }
      case Pending: {
        // const thenable = result;
        // throw thenable;
      }
      default: {
        component.status = Pending;
        let toImport = component.toImport
        console.log('status in readtoImport', toImport)
        const thenable = toImport()
        thenable.then((moduleObject) =>{
          if (component.status === Pending) {
            const defaultExport = moduleObject.default;
            if (defaultExport === undefined) {
                  // todo: give some warnings
            }
            component.status = Resolved;
            console.log('status in read.result and status', component)
            component.result = defaultExport;
            let suspenseComponent = this.type.SuspenseComponent
            let callback = suspenseComponent['__proto__'].suspenseCallback
            console.log('defaultExport', defaultExport)
            callback(defaultExport)
          }
        }, (error)=>{
          if (component.status === Pending) {
            component.status = Rejected;
            component.result = error;
          }
        });
        // component.result = thenable;
        switch (component.status) {
          case Resolved:
            return component.result;
          case Rejected:
            throw component.result;
        }
        component.result = thenable;
        // throw thenable;
      }
    }
  }
}
