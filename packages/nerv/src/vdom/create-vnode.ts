import { isString } from 'nerv-utils'
import { isWidget, isVNode, isHook, Props, VType, VNode } from 'nerv-shared'
export interface IHooks {
  [props: string]: any
}

function createVNode (
  tagName: string,
  props: Props,
  children: any,
  key,
  namespace,
  owner
): VNode {
  const count = children.length || 0
  let descendants = 0
  let hasWidgets = false
  let descendantHooks = false
  const hooks = Object.create(null)
  for (const propName in props) {
    if (props.hasOwnProperty(propName)) {
      const property = props[propName]
      if (isHook(property)) {
        hooks[propName] = property
      }
    }
  }
  if (count) {
    children.forEach((child: VNode) => {
      if (isVNode(child)) {
        descendants += child.count || 0
        if (!hasWidgets && child.hasWidgets) {
          hasWidgets = true
        }
        if (!descendantHooks && (child.hooks || child.descendantHooks)) {
          descendantHooks = true
        }
      } else if (!hasWidgets && isWidget(child)) {
        hasWidgets = true
      }
    })
  }
  return {
    tagName,
    key: key || null,
    vtype: VType.Node,
    props: props || {},
    children: children || [],
    namespace: isString(namespace) ? namespace : null,
    _owner: owner,
    hasWidgets,
    count: count + descendants,
    descendantHooks,
    hooks,
    dom: null
  }
}

export default createVNode
