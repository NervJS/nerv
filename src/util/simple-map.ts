export interface ICache<Key, Value> {
  k: Key,
  v: Value
}

class SimpleMap<Key, Value> {
  cache: Array<ICache<Key, Value>>
  constructor () {
    this.cache = []
  }
  set (k, v) {
    const len = this.cache.length
    if (!len) {
      this.cache.push({k, v})
      return
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        item.v = v
        return
      }
    }
    this.cache.push({k, v})
  }

  get (k) {
    const len = this.cache.length
    if (!len) {
      return
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        return item.v
      }
    }
  }

  has (k) {
    const len = this.cache.length
    if (!len) {
      return false
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        return true
      }
    }
    return false
  }

  delete (k) {
    const len = this.cache.length
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        this.cache.splice(i, 1)
        return true
      }
    }
    return false
  }

  clear () {
    let len = this.cache.length
    if (!len) {
      return
    }
    while (len) {
      this.cache.pop()
      len--
    }
  }

  size () {
    return this.cache.length
  }
}

export default SimpleMap
