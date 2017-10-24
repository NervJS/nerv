export function escapeText (text: string): string {
  let result = ''
  let escape = ''
  let start = 0
  let i
  for (i = 0; i < text.length; i++) {
    switch (text.charCodeAt(i)) {
      case 34: // "
        escape = '&quot;'
        break
      case 39: // \
        escape = '&#039;'
        break
      case 38: // &
        escape = '&amp;'
        break
      case 60: // <
        escape = '&lt;'
        break
      case 62: // >
        escape = '&gt;'
        break
      default:
        continue
    }
    if (i > start) {
      if (start) {
        result += text.slice(start, i)
      } else {
        result = text.slice(start, i)
      }
    }
    result += escape
    start = i + 1
  }
  return result + text.slice(start, i)
}

const uppercasePattern = /[A-Z]/g

const CssPropCache = {}

export function getCssPropertyName (str): string {
  if (CssPropCache.hasOwnProperty(str)) {
    return CssPropCache[str]
  }
  return (CssPropCache[str] =
    str.replace(uppercasePattern, '-$&').toLowerCase() + ':')
}

export const isVoidElements = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'command': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
}

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
export const isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}

export function encodeEntities (text): string {
  if (typeof text === 'boolean' || typeof text === 'number') {
    return '' + text
  }
  return escapeText(text)
}

// TODO: use extend from nerv.js module
export function assign (obj, props) {
  for (const i in props) {
    obj[i] = props[i]
  }
  return obj
}
