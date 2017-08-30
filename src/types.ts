import VNode from './vdom/vnode/vnode'
import Stateless from './stateless-component'
import Widget from './full-component'

export type Ref = (node?: Element | null) => void | null

export type VirtualNode = IVNode | Widget | Stateless | Array<string | number | IVNode> | boolean | string | number

export interface IProps {
  children?: Array<string | number | VNode>
  ref?: Ref
  key?: any
  className?: string
  [k: string]: any
}

export interface IVNode {
  type: string
  tagName: string
  props: IProps
  children: Array<string | number | IVNode >
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
