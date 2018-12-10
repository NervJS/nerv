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
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
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

const entities = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  '\\': '&#039;'
}

export function encodeEntities (text): string {
  if (typeof text !== 'string') {
    text = String(text)
  }
  return text.replace(/[<>\"\&\\]/g, (m) => entities[m])
}

export { extend } from 'nerv-utils'
