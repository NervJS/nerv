class HtmlHook {
  type = 'HtmlHook'
  constructor (value) {
    this.value = value
  }

  hook (node, prop, prev) {
    if (prev && prev.type === 'HtmlHook' &&
      prev.value === this.value) {
      return
    }
    node.innerHTML = this.value.__html || ''
  }

  unhook (node, prop, next) {
    node.innerHTML = next ? next.value.__html : ''
  }
}

export default HtmlHook
