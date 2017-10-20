class HtmlHook {
  type = 'HtmlHook'
  value: any
  constructor (value) {
    this.value = value
  }

  hook (node: Element, prop?, prev?) {
    if (prev && prev.type === 'HtmlHook' &&
      prev.value.__html === this.value.__html) {
      return
    }
    node.innerHTML = this.value.__html || ''
  }
}

export default HtmlHook
