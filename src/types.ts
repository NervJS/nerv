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

// tslint:disable-next-line:interface-name
export interface ComponentLifecycle<P, S> {
  /**
   * Called immediately before mounting occurs, and before `Component#render`.
   * Avoid introducing any side-effects or subscriptions in this method.
   */
  componentWillMount? (): void
  /**
   * Called immediately after a compoment is mounted. Setting state here will trigger re-rendering.
   */
  componentDidMount? (): void
  /**
   * Called when the component may be receiving new props.
   * React may call this even if props have not changed, so be sure to compare new and existing
   * props if you only want to handle changes.
   *
   * Calling `Component#setState` generally does not trigger this method.
   */
  componentWillReceiveProps? (nextProps: Readonly<P>, nextContext: any): void
  /**
   * Called to determine whether the change in props and state should trigger a re-render.
   *
   * `Component` always returns true.
   * `PureComponent` implements a shallow comparison on props and state and returns true if any
   * props or states have changed.
   *
   * If false is returned, `Component#render`, `componentWillUpdate`
   * and `componentDidUpdate` will not be called.
   */
  shouldComponentUpdate? (nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean
  /**
   * Called immediately before rendering when new props or state is received. Not called for the initial render.
   *
   * Note: You cannot call `Component#setState` here.
   */
  componentWillUpdate? (nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void
  /**
   * Called immediately after updating occurs. Not called for the initial render.
   */
  componentDidUpdate? (prevProps: Readonly<P>, prevState: Readonly<S>, prevContext: any): void
  /**
   * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
   * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
   */
  componentWillUnmount? (): void
  /**
   * Catches exceptions generated in descendant components. Unhandled exceptions will cause
   * the entire component tree to unmount.
   */
}
