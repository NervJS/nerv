import VNode from './vdom/vnode/vnode'

export type Ref = (node?: Element | null) => void | null

export interface IProps {
  children?: Array<string | number | VNode>
  ref?: Ref
  key?: any
  className?: string
  [k: string]: any
}
