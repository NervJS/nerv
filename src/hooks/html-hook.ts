class HtmlHook {
  type = 'HtmlHook'
  value: any
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
    node.innerHTML = ''
  }
}

export default HtmlHook
