export interface Widget {
  vtype: VType
  name: string
  _owner: any
  props: any
  _rendered: any
  parentContext: any
  context: any
  init (): Element | null
  update (previous: this, current: this, dom?: Element): Element | null
  destroy (dom?: Element): Element | null
}

export interface CompositeComponent extends Widget {
  tagName: any
  component: Component<any, any>
}

export interface StatelessComponent extends Widget {
  tagName: Function
}

export interface VText {
  vtype: VType
  text: string | number
}

export interface PatchOrder {
  removes: any[]
  inserts: any[]
}

export type Patch = PatchOrder | VirtualNode

export interface VNode {
  vtype: VType
  tagName: string
  props: Props
  children: VirtualChildren
  key: string | number | undefined
  namespace: string | null
  _owner: any // TODO: this is a component
  count: number
  hasWidgets: boolean
  hooks: {
    [k: string]: any
  }
  descendantHooks: boolean
  isSvg?: boolean
  parentContext?: any
}

export type VirtualNode =
  | VNode
  | VText
  | CompositeComponent
  | StatelessComponent
  | VirtualChildren
  | boolean
  | string
  | number
  | null
  | undefined

export type VirtualChildren = Array<string | number | VNode>

export type Ref = (node?: Element | null) => void | null

export interface Props {
  children?: VirtualChildren
  ref?: Ref
  key?: any
  className?: string
  [k: string]: any
}

export interface ComponentLifecycle<P, S> {
  componentWillMount? (): void
  componentDidMount? (): void
  componentWillReceiveProps? (nextProps: Readonly<P>, nextContext: any): void
  shouldComponentUpdate? (
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any
  ): boolean
  componentWillUpdate? (
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any
  ): void
  componentDidUpdate? (
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    prevContext: any
  ): void
  componentWillUnmount? (): void
}

export interface Component<P, S> extends ComponentLifecycle<P, S> {
  state: Readonly<S>
  props: Readonly<P> & Readonly<any>
  context: any
  _dirty: boolean
  _disable: boolean
  _rendered: any
  dom: any
  getState (): S
}

export function isVNode (node): node is VNode {
  return node && node.vtype === VType.Node
}

export function isVText (node): node is VText {
  return node && node.vtype === VType.Text
}

export function isWidget (node): node is CompositeComponent | StatelessComponent {
  return node && node.vtype > 3
}

export function isComposite (node): node is CompositeComponent {
  return node && node.vtype === VType.Composite
}

export function isHook (arg) {
  if (
    (arg && (typeof arg.hook === 'function' && !arg.hasOwnProperty('hook'))) ||
    (arg && (typeof arg.unhook === 'function' && !arg.hasOwnProperty('unhook')))
  ) {
    return true
  }
  return false
}

// typescript will compile the enum's value for us.
// eg.
// Composite = 1 << 2  => Composite = 4
export enum VType {
  Text = 1,
  Node = 1 << 1,
  Composite = 1 << 2,
  Stateless = 1 << 3
}
