import { VHook } from './vhook'
class HtmlHook {
  vhook = VHook.HTML
  value: any
  constructor (value) {
    this.value = value
  }

  hook (node: Element, prop?: this, prev?: this) {
    if (prev && prev.vhook === VHook.HTML &&
      prev.value.__html === this.value.__html) {
      return
    }
    node.innerHTML = this.value.__html || ''
  }
}

export default HtmlHook
