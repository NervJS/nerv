import { isString, isFunction } from '../../util'
import { isWidget, isVNode, isHook } from './types'

export type VnodeChildren = | string
  | number
  | boolean
  | undefined
  | VNode
  | Array<string | number | VNode>
  | null

class VNode {
  type = 'VirtualNode'
  tagName: string | undefined
  props: object
  children: VnodeChildren
  key: string | number | undefined
  namespace: string | null | undefined
  constructor (tagName, props, children, key, namespace, owner) {
    this.tagName = tagName || 'DIV'
    this.props = props || {}
    this.children = children || []
    this.key = key || null
    this.namespace = (isString(namespace)) ? namespace : null
    this._owner = owner
    const count = this.children.length || 0
    let descendants = 0
    let hasWidgets = false
    let descendantHooks = false
    let hooks
    for (const propName in props) {
      if (props.hasOwnProperty(propName)) {
        const property = props[propName]
        if (isHook(property) && property.unhook) {
          if (!hooks) {
            hooks = {}
          }
          hooks[propName] = property
        }
      }
    }
    if (count) {
      this.children.forEach((child) => {
        if (isVNode(child)) {
          descendants += child.count || 0
          if (!hasWidgets && child.hasWidgets) {
            hasWidgets = true
          }
          if (!descendantHooks && (child.hooks || child.descendantHooks)) {
            descendantHooks = true
          }
        } else if (!hasWidgets && isWidget(child)) {
          if (isFunction(child.destroy)) {
            hasWidgets = true
          }
        }
      })
    }
    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hooks = hooks
    this.descendantHooks = descendantHooks
  }
}

export default VNode
