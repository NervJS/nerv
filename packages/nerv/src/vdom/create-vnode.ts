import { isString } from 'nerv-utils'
import {
  Props,
  VType,
  VNode,
  VirtualChildren,
  Component
} from 'nerv-shared'

function createVNode (
  type: string,
  props: Props,
  children: VirtualChildren,
  key,
  namespace: string,
  owner: Component<any, any>,
  ref: Function | string | null | undefined
): VNode {
  return {
    type,
    key: key || null,
    vtype: VType.Node,
    props: props || {},
    children,
    namespace: isString(namespace) ? namespace : null,
    _owner: owner,
    dom: null,
    ref: ref || null
  }
}

export default createVNode
