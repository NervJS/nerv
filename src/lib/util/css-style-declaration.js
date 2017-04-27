function getPixelSize (element, style, property, fontSize) {
  let sizeWithSuffix = style[property]
  let size = parseFloat(sizeWithSuffix)
  let suffix = sizeWithSuffix.split(/\d/)[0]
  let rootSize
  fontSize = (fontSize !== null) ? fontSize :
    (/%|em/.test(suffix) && element.parentElement) ?
      getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) : 16
  rootSize = property === 'fontSize' ? fontSize :
    /width/i.test(property) ? element.clientWidth : element.clientHeight
  return (suffix ==='em') ? size * fontSize :
    (suffix === 'in') ? size * 96 :
      (suffix === 'pt') ? size * 96 / 72 :
        (suffix === '%') ? size / 100 * rootSize : size
}

function setShortStyleProperty (style, property) {
  let borderSuffix = property === 'border' ? 'Width' : ''
  let t = property + 'Top' + borderSuffix
  let r = property + 'Right' + borderSuffix
  let b = property + 'Bottom' + borderSuffix
  let l = property + 'Left' + borderSuffix
  style[property] = (style[t] == style[r] == style[b] == style[l] ? [style[t]]
		: style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]]
		: style[l] == style[r] ? [style[t], style[r], style[b]]
		: [style[t], style[r], style[b], style[l]]).join(' ')
}

function CSSStyleDeclaration (element) {
  let currentStyle = element.currentStyle || {}
  let style = this
  let fontSize = getPixelSize(element, currentStyle, 'fontSize', null)
  for (let property in currentStyle) {
    if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
      style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px'
    } else if (property === 'styleFloat') {
      style['float'] = currentStyle[property]
    } else {
      style[property] = currentStyle[property]
    }
  }
  setShortStyleProperty(style, 'margin')
  setShortStyleProperty(style, 'padding')
  setShortStyleProperty(style, 'border')
  style.fontSize = fontSize + 'px'
  return style
}

CSSStyleDeclaration.prototype = {
  constructor: CSSStyleDeclaration,
  getPropertyPriority () { },
  getPropertyValue (prop) {
    return this[prop] || ''
  },
  item () { },
  removeProperty () { },
  setProperty () { },
  getPropertyCSSValue () { }
}

export default CSSStyleDeclaration