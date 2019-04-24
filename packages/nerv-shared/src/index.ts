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

export interface Portal {
  type: Element
  vtype: VType
  children: VirtualNode
  dom: null | Element
}

export type ComponentInstance = CompositeComponent | StatelessComponent

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

export const EMPTY_CHILDREN: any[] = []

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
  ref: Function | string | null
}

export type VirtualNode =
  | VNode
  | VText
  | CompositeComponent
  | StatelessComponent
  | VVoid
  | Portal

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
  componentDidCatch? (error?): void
  getDerivedStateFromProps? (nextProps: Readonly<P>, prevState: Readonly<S>): object | null
  getDerivedStateFromError? (error?): object | null
  getSnapshotBeforeUpdate? (prevProps: Readonly<P>, prevState: Readonly<S>): object | null
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
  render (props?, context?): VirtualNode
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
): node is CompositeComponent | StatelessComponent {
  return (
    !isNullOrUndef(node) &&
    (node.vtype & (VType.Composite)) > 0
  )
}

export function isPortal (vtype: VType, node): node is Portal {
  return (vtype & VType.Portal) > 0
}

export function isComposite (node): node is CompositeComponent {
  return !isNullOrUndef(node) && node.vtype === VType.Composite
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
  Void = 1 << 4,
  Portal = 1 << 5
}
