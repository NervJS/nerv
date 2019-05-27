class Emiter<T> {
  public value: T
  private handlers: Function[] = []

  constructor (value: T) {
    this.value = value
  }

  on (handler: Function) {
    this.handlers.push(handler)
  }

  off (handler: Function) {
    this.handlers = this.handlers.filter((h) => h !== handler)
  }

  set (value: T) {
    this.value = value
    this.handlers.forEach((h) => h(this.value))
  }
}

export {
  Emiter
}
