(function () {
  const ua = navigator.userAgent.match(/MSIE (\d+)/)
  if (ua === null) {
    return
  }
  const ieVersion = ua[1]
  if (ieVersion > 9) {
    return
  }

  const innerText = Object.getOwnPropertyDescriptor(Element.prototype, 'innerText')
  const nodeName = Object.getOwnPropertyDescriptor(Element.prototype, 'nodeName')

  Object.defineProperties(Element.prototype, {
    'textContent': {
      get: function () {
        return innerText.get.call(this)
      },
      set: function (x) {
        return innerText.set.call(this, x)
      }
    },
    'nodeName': {
      get () {
        return nodeName.get.call(this).toUpperCase()
      }
    }
  })

  // Overwrites native 'firstElementChild' prototype.
  // Adds Document & DocumentFragment support for IE9 & Safari.
  // Returns array instead of HTMLCollection.
  ; (function (constructor) {
    if (constructor &&
      constructor.prototype &&
      constructor.prototype.firstElementChild == null) {
      Object.defineProperty(constructor.prototype, 'firstElementChild', {
        get: function () {
          // eslint-disable-next-line
          var node, nodes = this.childNodes, i = 0
          // eslint-disable-next-line
          while (node = nodes[i++]) {
            if (node.nodeType === 1) {
              return node
            }
          }
          return null
        }
      })
    }
  })(window.Node || window.Element)
}())
