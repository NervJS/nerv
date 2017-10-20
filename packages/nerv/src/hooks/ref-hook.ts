class RefHook {
  callback: Function
  constructor (callback: Function) {
    this.callback = callback
  }
  hook (node) {
    this.callback(node)
  }
  unhook () {
    this.callback(null)
  }
}

export default RefHook
