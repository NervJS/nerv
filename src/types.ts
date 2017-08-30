import Stateless from './stateless-component'
import Widget from './full-component'
import VText from './vdom/vnode/vtext'

export type Ref = (node?: Element | null) => void | null

export type VirtualNode = IVNode
  | VText
  | Widget
  | Stateless
  | VirtualChildren
  | boolean
  | string
  | number
  | null
  | undefined

export type VirtualChildren = Array<string | number | IVNode>

// tslint:disable-next-line:interface-name
export interface PatchOrder {
  removes: any[]
  inserts: any[]
}

export type Patch = PatchOrder | VirtualNode

export interface IProps {
  children?: VirtualChildren
  ref?: Ref
  key?: any
  className?: string
  [k: string]: any
}

export interface IVNode {
  type: string
  tagName: string
  props: IProps
  children: VirtualChildren
  key: string | number | undefined
  namespace: string | null
  _owner: any // TODO: this is a component
  count: number
  hasWidgets: boolean
  hooks: {
    [k: string]: any
  }
  descendantHooks: boolean,
  isSvg?: boolean,
  parentContext?: any
}
