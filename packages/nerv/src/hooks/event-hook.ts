import { isFunction, isNative } from '../util'
import SimpleMap from '../util/simple-map'

const ONINPUT = 'oninput'
const ONPROPERTYCHANGE = 'onpropertychange'

const canUseNativeMap = (() => {
  return 'Map' in window && isNative(Map)
})()
  /* istanbul ignore next */
const MapClass: MapConstructor = canUseNativeMap ? Map : SimpleMap as any

const delegatedEvents = new MapClass()

const unbubbleEvents = {
  [ONPROPERTYCHANGE]: 1,
  onmousemove: 1,
  ontouchmove: 1,
  onmouseleave: 1,
  onmouseenter: 1,
  onload: 1,
  onunload: 1,
  onscroll: 1,
  onfocus: 1,
  onblur: 1,
  onrowexit: 1,
  onbeforeunload: 1,
  onstop: 1,
  ondragdrop: 1,
  ondragenter: 1,
  ondragexit: 1,
  ondraggesture: 1,
  ondragover: 1,
  oncontextmenu: 1,
  onerror: 1,
  onabort: 1,
  oncanplay: 1,
  oncanplaythrough: 1,
  ondurationchange: 1,
  onemptied: 1,
  onended: 1,
  onloadeddata: 1,
  onloadedmetadata: 1,
  onloadstart: 1,
  onencrypted: 1,
  onpause: 1,
  onplay: 1,
  onplaying: 1,
  onprogress: 1,
  onratechange: 1,
  onseeking: 1,
  onseeked: 1,
  onstalled: 1,
  onsuspend: 1,
  ontimeupdate: 1,
  onvolumechange: 1,
  onwaiting: 1
}

let bindFocus = false

class EventHook {
  type = 'EventHook'
  eventName: string
  handler: Function
  constructor (eventName: string, handler) {
    this.eventName = getEventName(eventName)
    this.handler = handler
  }

  hook (node, prop, prev) {
    if (prev && prev.type === 'EventHook' &&
      prev.handler === this.handler &&
      prev.eventName === this.eventName) {
      return
    }
    const eventName = fixEvent(node, this.eventName)
    this.eventName = eventName
    if (eventName === ONPROPERTYCHANGE) {
      processOnPropertyChangeEvent(node, this.handler)
      return
    }
    let delegatedRoots = delegatedEvents.get(eventName)
    if (unbubbleEvents[eventName] === 1) {
      if (!delegatedRoots) {
        delegatedRoots = new MapClass()
      }
      const event = attachEventToNode(node, eventName, delegatedRoots)
      delegatedEvents.set(eventName, delegatedRoots)
      if (isFunction(this.handler)) {
        delegatedRoots.set(node, {
          eventHandler: this.handler,
          event
        })
      }
    } else {
      if (!delegatedRoots) {
        delegatedRoots = {
          items: new MapClass()
        }
        delegatedRoots.event = attachEventToDocument(document, eventName, delegatedRoots)
        delegatedEvents.set(eventName, delegatedRoots)
      }
      if (isFunction(this.handler)) {
        delegatedRoots.items.set(node, this.handler)
      }
    }
  }

  unhook (node, prop, next) {
    if (next && next.type === 'EventHook' &&
      next.handler === this.handler &&
      next.eventName === next.eventName) {
      return
    }
    const eventName = fixEvent(node, this.eventName)
    if (eventName === ONPROPERTYCHANGE) {
      return
    }
    const delegatedRoots = delegatedEvents.get(eventName)
    if (unbubbleEvents[eventName] === 1 && delegatedRoots) {
      const event = delegatedRoots.get(node)
      node.removeEventListener(parseEventName(eventName), event.event, false)
      /* istanbul ignore next */
      const delegatedRootsSize = delegatedRoots.size
      if (delegatedRoots.delete(node) && delegatedRootsSize === 0) {
        delegatedEvents.delete(eventName)
      }
    } else if (delegatedRoots && delegatedRoots.items) {
      const items = delegatedRoots.items
      if (items.delete(node) && items.size === 0) {
        document.removeEventListener(parseEventName(eventName), delegatedRoots.event, false)
        delegatedEvents.delete(eventName)
      }
    }
  }
}

function getEventName (eventName) {
  if (eventName === 'onDoubleClick') {
    eventName = 'ondblclick'
  } else if (eventName === 'onTouchTap') {
    eventName = 'onclick'
  }
  return eventName.toLowerCase()
}

let propertyChangeActiveElement
let propertyChangeActiveElementValue
let propertyChangeActiveElementValueProp
let propertyChangeActiveHandler

function propertyChangeHandler (event) {
  if (event.propertyName !== 'value') {
    return
  }
  const target = event.target || event.srcElement
  const val = target.value
  if (val === propertyChangeActiveElementValue) {
    return
  }
  propertyChangeActiveElementValue = val
  if (isFunction(propertyChangeActiveHandler)) {
    propertyChangeActiveHandler.call(target, event)
  }
}

function processOnPropertyChangeEvent (node, handler) {
  propertyChangeActiveHandler = handler
  if (!bindFocus) {
    bindFocus = true
    document.addEventListener('focusin', () => {
      unbindOnPropertyChange()
      bindOnPropertyChange(node)
    }, false)
    document.addEventListener('focusout', unbindOnPropertyChange, false)
  }
}

function bindOnPropertyChange (node) {
  propertyChangeActiveElement = node
  propertyChangeActiveElementValue = node.value
  propertyChangeActiveElementValueProp = Object.getOwnPropertyDescriptor(node.constructor.prototype, 'value')
  Object.defineProperty(propertyChangeActiveElement, 'value', {
    get () {
      return propertyChangeActiveElementValueProp.get.call(this)
    },
    set (val) {
      propertyChangeActiveElementValue = val
      propertyChangeActiveElementValueProp.set.call(this, val)
    }
  })
  propertyChangeActiveElement.addEventListener('propertychange', propertyChangeHandler, false)
}

function unbindOnPropertyChange () {
  if (!propertyChangeActiveElement) {
    return
  }
  delete propertyChangeActiveElement.value
  propertyChangeActiveElement.removeEventListener('propertychange', propertyChangeHandler, false)

  propertyChangeActiveElement = null
  propertyChangeActiveElementValue = null
  propertyChangeActiveElementValueProp = null
}

function detectCanUseOnInputNode (node) {
  const nodeName = node.nodeName && node.nodeName.toLowerCase()
  const type = node.type
  return (nodeName === 'input' && /text|password/.test(type)) || nodeName === 'textarea'
}

function fixEvent (node, eventName) {
  if (detectCanUseOnInputNode(node)) {
    if (eventName === 'onchange') {
      eventName = ONINPUT in window ? ONINPUT : ONPROPERTYCHANGE
    }
  }
  return eventName
}

function parseEventName (name) {
  return name.substr(2)
}
  /* istanbul ignore next */
function stopPropagation () {
  this.cancelBubble = true
  this.stopImmediatePropagation()
}

function dispatchEvent (event, target, items, count, eventData) {
  const eventsToTrigger = items.get(target)
  if (eventsToTrigger) {
    count--
    eventData.currentTarget = target
    eventsToTrigger(event)
    if (event.cancelBubble) {
      return
    }
  }
  if (count > 0) {
    const parentDom = target.parentNode
    if (parentDom === null || (event.type === 'click' && parentDom.nodeType === 1 && parentDom.disabled)) {
      return
    }
    dispatchEvent(event, parentDom, items, count, eventData)
  }
}

function attachEventToDocument (doc, eventName, delegatedRoots) {
  const eventHandler = (event) => {
    const items = delegatedRoots.items
    const count = items.size
    if (count > 0) {
      const eventData = {
        currentTarget: event.target
      }
      /* istanbul ignore next */
      Object.defineProperties(event, {
        currentTarget: {
          configurable: true,
          get () {
            return eventData.currentTarget
          }
        },
        stopPropagation: {
          value: stopPropagation
        }
      })
      dispatchEvent(event, event.target, delegatedRoots.items, count, eventData)
    }
  }
  doc.addEventListener(parseEventName(eventName), eventHandler, false)
  return eventHandler
}

function attachEventToNode (node, eventName, delegatedRoots) {
  const eventHandler = (event) => {
    const eventToTrigger = delegatedRoots.get(node)
    if (eventToTrigger && eventToTrigger.eventHandler) {
      const eventData = {
        currentTarget: node
      }
      /* istanbul ignore next */
      Object.defineProperties(event, {
        currentTarget: {
          configurable: true,
          get () {
            return eventData.currentTarget
          }
        }
      })
      eventToTrigger.eventHandler(event)
    }
  }
  node.addEventListener(parseEventName(eventName), eventHandler, false)
  return eventHandler
}

export default EventHook
