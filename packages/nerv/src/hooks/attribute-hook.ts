import { VHook } from './vhook'
class AttributeHook {
  vhook = VHook.Attribute
  namespace: string
  value: string | number | boolean
  constructor (namespace: string, value: string | number | boolean) {
    this.namespace = namespace
    this.value = value
  }

  hook (node: Element, prop: string, prev: this) {
    if (
      prev &&
      prev.vhook === VHook.Attribute &&
      prev.value === this.value &&
      prev.namespace === this.namespace
    ) {
      return
    }
    node.setAttributeNS(this.namespace, prop, this.value as string)
  }

  unhook (node: Element, prop: string, next: this) {
    if (
      next &&
      next.vhook === VHook.Attribute &&
      next.namespace === this.namespace
    ) {
      return
    }
    const colonPosition = prop.indexOf(':')
    const localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop
    node.removeAttributeNS(this.namespace, localName)
  }
}

export default AttributeHook
