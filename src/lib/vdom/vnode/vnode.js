import { isString, isFunction } from '~'
import { isWidget, isVNode, isHook } from './types'

class VNode {
  constructor (tagName, properties, children, key, namespace) {
    this.tagName = tagName || 'DIV'
    this.properties = properties || {}
    this.children = children || []
    this.key = key || null
    this.namespace = (isString(namespace)) ? namespace : null
    let count = this.children.length || 0
    let descendants = 0
    let hasWidgets = false
    let descendantHooks = false
    let hooks
    for (let propName in properties) {
      if (properties.hasOwnProperty(propName)) {
        let property = properties[propName]
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
  type = 'VirtualNode'
}

export default VNode
