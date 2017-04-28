import { isFunction, isString } from './util'

class Module {
  constructor (name, path) {
    this.name = name
    this.path = path

    this.fn = null
    this.exports = {}
    this._loaded = false
    this._readyStack = []
    Module.cache[this.name] = this
  }

  init () {
    if (!this._inited) {
      this._inited = true
      if (!this.fn) {
        throw new Error('Module ' + this.name + ' not found!')
      }
      Module.initingModules[this.name] = true
      const result = this.fn.call(null, require, this.exports, this)
      if (result) {
        this.exports = result
      }

      Module.initingModules[this.name] = false
    }
  }

  ready (fn) {
    const stack = this._readyStack
    if (this._loaded) {
      this.init()
      fn()
    } else {
      stack.push(fn)
    }
  }

  load () {
    const path = this.path
    Module.loadingPaths[this.name] = true
    Script.load({
      src: path
    })
  }

  triggerStack () {
    if (this._readyStack.length > 0) {
      this.init()
      this._readyStack.forEach(func => {
        if (!func.excuting) {
          func.excuting = true
          func()
        }
      })
    }
    this._readyStack = []
  }

  define () {
    this._loaded = true
    Module.loadedPaths[this.name] = true
    delete Module.loadingPaths[this.name]
    this.triggerStack()
  }

  lazyload () {
    if (Module.lazyLoadPaths[this.name]) {
      this.define()
      delete Module.lazyLoadPaths[this.name]
    } else if (Module.loadedPaths[this.name]) {
      this.triggerStack()
    } else {
      Module.requiredPaths[this.name] = true
      this.load()
    }
  }
}

Module.config = {
  baseUrl: ''
}
Module.paths = {}
Module.loadedPaths = {}
Module.cache = {}
Module.loadingPaths = {}
Module.initingModules = {}
Module.requiredPaths = {}
Module.lazyLoadPaths = {}

function require (name) {
  const mod = getModule(name)
  if (!Module.initingModules[name]) {
    mod.init()
  }
  return mod.exports
}

function getPathByName (name) {
  return Module.config.baseUrl ? Module.config.baseUrl + name : name
}

function getModule (name) {
  const path = name.indexOf(':') > -1 ? name : getPathByName(name)
  const cache = Module.cache[name]
  return cache ? cache : new Module(name, path)
}

const Script = {
  _paths: {},
  _rules: [],
  load (opts) {
    if (opts.src in this._paths) {
      return
    }
    this._paths[opts.src] = true
    this._rules.forEach(rule => rule.call(null, opts))
    const head = document.getElementsByTagName('head')[0]
    let node = document.createElement('script')
    node.type = opts.type || 'text/javascript'
    if (opts.charset) {
      node.charset = opts.charset
    }
    node.src = opts.src
    node.onload = node.onerror = node.onreadystatechange = () => {
      if (!this.readyState || this.readyState === 'load' || this.readyState === 'complete') {
        node.onload = node.onerror = node.onreadystatechange = null
        if (node.parentNode) {
          head.removeChild(node)
        }
        node = null
        if (isFunction(opts.loaded)) {
          opts.loaded()
        }
      }
    }
    head.insertBefore(node, head.firstChild)
  },

  addPathRule (rule) {
    if (rule) {
      this._rules.push(rule)
    }
  }
}

function define (name, fn) {
  const mod = getModule(name)
  mod.fn = fn
  if (Module.requiredPaths[name]) {
    mod.define()
  } else {
    Module.lazyLoadPaths[name] = true
  }
}

function use (names, fn) {
  if (isFunction(names)) {
    names = [names]
  }
  let args = []
  let flags = []
  names.forEach((name, i) => flags[i] = false)
  names.forEach((name, i) => {
    const mod = getModule(name)
    mod.ready(() => {
      args[i] = mod.exports
      flags[i] = true
      let done = true
      flags.forEach(flag => {
        if (flag === false) {
          done = false
          return done
        }
      })
      if (fn && done) {
        fn.apply(null, args)
      }
    })
    mod.lazyload()
  })
}

require.async = use

function addPathRule (rule) {
  Script.addPathRule(rule)
}

function config ({ baseUrl }) {
  if (isString(baseUrl)) {
    Module.config.baseUrl = baseUrl
  }
}

export default {
  _Module: Module,
  define,
  require,
  use,
  addPathRule,
  config
}