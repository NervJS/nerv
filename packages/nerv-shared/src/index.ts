export interface Widget {
  vtype: VType
  name: string
  _owner: any
  props: any
  _rendered: any
  context: any
  init (parentContext, parentComponent): Element | null
  update (
    previous: ComponentInstance,
    current: ComponentInstance,
    context: any,
    dom?: Element
  ): Element | null
  destroy (dom?: Element)
}
export interface ExoticComponent<T> {
  vtype: VType
  name: string
}
export interface ForwardRefComponent {
  vtype: VType
  render: (props: any, refs: any) => VirtualNode
}
export interface MemoElement {
  vtype: VType
  render: (props: any) => VirtualNode
  equals?: (prevProps, nextProps) => boolean
  name: string
}

export interface LazyELement {
  vtype: VType
  toImport: () => Promise<any>
  status: number
  result: any
  name: string
  Suspense: any
  SuspenseComponent: any
}

export interface LazyComponent extends Widget {
  ref?: Ref
  dom: Element | null
  type: any
  initLazyComponent (parentContext, parentComponent, isSvg): any
}
export interface MemoComponent extends Widget {
  ref?: Ref
  dom: Element | null
  type: any
}
export interface NervContext<T> extends ExoticComponent<any>  {
  NervProvider: any
  NervConsumer: any
  contextValue: any
  vtype: VType
  name: string
}
export interface NervProvider<T> {
  _context: NervContext<T>
  ref?: Ref
  dom: Element | null
  vtype: VType
  props: any
}
export interface NervConsumer<T> {
  dom: null | Element
  key: null | string
  ref: any
  vtype: VType
  props: {
    children: (value: T) => VirtualNode
  },
}
export interface Portal {
  type: Element
  vtype: VType
  children: VirtualNode
  dom: null | Element
}
export interface Fragment {
  vtype: VType
  children: VirtualNode
  dom: null | Element
  props: any
  name: string
}
export interface Suspense extends Widget{
  vtype: VType
  name: string
  dom: null | Element
  props: {
    fallback: VirtualNode
  }
  lazyComponent: any
  initSuspenseComponent (parentContext, parentComponent, isSvg): DocumentFragment
}
export type ComponentInstance = CompositeComponent | StatelessComponent | Suspense

export interface CompositeComponent extends Widget {
  type: any
  component: Component<any, any>
  ref?: Ref
  dom: Element | null
}

export interface StatelessComponent extends Widget {
  type: Function
  dom: Element | null
}

export const EMPTY_CHILDREN = []

export const EMPTY_OBJ = {}

export interface VText {
  vtype: VType
  text: string | number
  dom: Text | null
}

export interface VVoid {
  dom: Text | null
  vtype: VType
}

export interface VNode {
  vtype: VType
  type: string
  props: Props
  children: VirtualChildren
  key: string | number | undefined
  namespace: string | null
  _owner: Component<any, any> // TODO: this is a component
  isSvg?: boolean
  parentContext?: any
  dom: Element | null
  ref: Function | string | RefObject | null
}
export type RefObject = {
  current: null | Element
}


export type VirtualNode =
  | VNode
  | VText
  | CompositeComponent
  | StatelessComponent
  | VVoid
  | Portal
  | Fragment
  | NervProvider<any>
  | NervConsumer<any>
  | Suspense

export type VirtualChildren = Array<string | number | VirtualNode> | VirtualNode

export type Ref = (node?: Element | null) => void | null | string

export interface Props {
  children?: VirtualChildren
  ref?: Ref
  key?: any
  className?: string | object
  [k: string]: any
}

export interface ComponentLifecycle<P, S> {
  componentWillMount? (): void
  UNSAFE_componentWillMount? (): void
  componentDidMount? (): void
  componentWillReceiveProps? (nextProps: Readonly<P>, nextContext: any): void
  UNSAFE_componentWillReceiveProps? (nextProps: Readonly<P>, nextContext: any): void
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
  UNSAFE_componentWillUpdate? (
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
  componentDidCatch? (error?): void
  getDerivedStateFromProps? (nextProps: Readonly<P>, prevState:Readonly<S>): object | null
  getSnapShotBeforeUpdate? (prevProps: Readonly<P>, prevState:Readonly<S>): object | null
}

export interface Refs {
  [k: string]: any
}

export interface Component<P, S> extends ComponentLifecycle<P, S> {
  state: Readonly<S>
  props: Readonly<P> & Readonly<any>
  context: any
  _dirty: boolean
  _disable: boolean
  _rendered: any
  _parentComponent: Component<any, any>
  prevProps: P
  prevState: S
  prevContext: object
  isReactComponent: object
  dom: any
  vnode: CompositeComponent
  clearCallBacks: () => void
  getState (): S
  // tslint:disable-next-line:member-ordering
  refs: Refs
  render (): VirtualNode
  vtype: VType
}

export function isNullOrUndef (o: any): o is undefined | null {
  return o === undefined || o === null
}

export function isInvalid (o: any): o is undefined | null | true | false {
  return isNullOrUndef(o) || o === true || o === false
}

export function isVNode (node): node is VNode {
  return !isNullOrUndef(node) && node.vtype === VType.Node
}

export function isVText (node): node is VText {
  return !isNullOrUndef(node) && node.vtype === VType.Text
}

export function isComponent (instance): instance is Component<any, any> {
  return !isInvalid(instance) && instance.isReactComponent === EMPTY_OBJ
}

export function isWidget (
  node
): node is CompositeComponent | StatelessComponent | Suspense {
  return (
    !isNullOrUndef(node) &&
    (node.vtype & (VType.Composite | VType.Stateless)) > 0
  )
}

export function isPortal (vtype: VType, node): node is Portal {
  return (vtype & VType.Portal) > 0
}

export function isFragment(vtype: VType, node): node is Fragment {
  return (vtype & VType.Fragment) > 0
}
export function isNervProvider(node): node is NervProvider<any> {
  let vtype = node && node.vtype
  return (vtype & VType.NervProvider) > 0
}
export function isNervConsumer(node):node is NervConsumer<any> {
  let vtype = node && node.vtype
  return (vtype & VType.NervConsumer) > 0
}
export function isComposite (node): node is CompositeComponent {
  return !isNullOrUndef(node) && node.vtype === VType.Composite
}

export function isStateless (node): node is StatelessComponent {
  return !isNullOrUndef(node) && node.vtype === VType.Stateless
}

export function isValidElement (node): node is VirtualNode {
  return !isNullOrUndef(node) && node.vtype
}

export function isHook (arg) {
  return !isNullOrUndef(arg) && typeof arg.vhook === 'number'
}

// tslint:disable-next-line:no-empty
export function noop () {}

// typescript will compile the enum's value for us.
// eg.
// Composite = 1 << 2  => Composite = 4
export const enum VType {
  Text = 1,
  Node = 1 << 1,
  Composite = 1 << 2,
  Stateless = 1 << 3,
  Void = 1 << 4,
  Portal = 1 << 5,
  Fragment = 1<<6,
  NervConsumer = 1<<7,
  NervProvider = 1<<8,
  NervContext = 1<<9,
  ForwardRefComponent = 1<<10,
  MemoComponent = 1<< 11,
  LazyComponent = 1<<12,
  Suspense = 1<<13

}
