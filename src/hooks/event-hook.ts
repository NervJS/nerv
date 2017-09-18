import { isFunction, isNative } from '../util'
import SimpleMap from '../util/simple-map'

const canUseNativeMap = (() => {
  return 'Map' in window && isNative(Map)
})()
  /* istanbul ignore next */
const MapClass = canUseNativeMap ? Map : SimpleMap as any

const delegatedEvents = new (MapClass as MapConstructor)()

const unbubbleEvents = {
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
    const eventName = this.eventName
    let delegatedRoots = delegatedEvents.get(eventName)
    if (unbubbleEvents[eventName] === 1) {
      if (!delegatedRoots) {
        delegatedRoots = new (MapClass as MapConstructor)()
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
    const eventName = this.eventName
    const delegatedRoots = delegatedEvents.get(eventName)
    if (unbubbleEvents[eventName] === 1 && delegatedRoots) {
      const event = delegatedRoots.get(node)
      node.removeEventListener(parseEventName(eventName), event.event, false)
      /* istanbul ignore next */
      const delegatedRootsSize = typeof delegatedRoots.size === 'function'
        ? delegatedRoots.size.bind(delegatedRoots)
        : () => delegatedRoots.size
      if (delegatedRoots.delete(node) && delegatedRootsSize() === 0) {
        delegatedEvents.delete(eventName)
      }
    } else if (delegatedRoots && delegatedRoots.items) {
      const items = delegatedRoots.items
        /* istanbul ignore next */
      const itemsSize = typeof items.size === 'function' ? items.size.bind(items) : () => items.size
      if (items.delete(node) && itemsSize() === 0) {
        document.removeEventListener(parseEventName(eventName), delegatedRoots.event, false)
        delegatedEvents.delete(eventName)
      }
    }
  }
}

function getEventName (name) {
  if (name === 'onDoubleClick') {
    name = 'ondblclick'
  } else if (name === 'onTouchTap') {
    name = 'onclick'
  }
  return name.toLowerCase()
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
    /* istanbul ignore next */
    const count = typeof items.size === 'function' ? items.size() : items.size
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
