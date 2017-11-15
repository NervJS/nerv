import { isString } from 'nerv-utils'
import { Props, VType, VNode } from 'nerv-shared'

function createVNode (
  tagName: string,
  props: Props,
  children: any,
  key,
  namespace,
  owner
): VNode {
  return {
    tagName,
    key: key || null,
    vtype: VType.Node,
    props: props || {},
    children: children || [],
    namespace: isString(namespace) ? namespace : null,
    _owner: owner,
    dom: null
  }
}

export default createVNode
