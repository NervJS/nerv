import { isFunction } from '~'
import SimpleMap from '~/simple-map'

let delegatedEvents = new SimpleMap()

class EventHook {
  constructor (eventName, handler) {
    this.eventName = eventName
    this.handler = handler
  }

  hook (node) {
    let delegatedRoots = delegatedEvents.get(this.eventName)
    if (!delegatedRoots) {
      delegatedRoots = {
        items: new SimpleMap()
      }
      delegatedRoots.event = attachEventToDocument(this.eventName, delegatedRoots)
      delegatedEvents.set(this.eventName, delegatedRoots)
    }
    if (isFunction(this.handler)) {
      delegatedRoots.items.set(node, this.handler)
    }
  }

  unhook (node) {
    let delegatedRoots = delegatedEvents.get(this.eventName)
    if (delegatedRoots && delegatedRoots.items) {
      let items = delegatedRoots.items
      if (items.remove(node) && items.size() === 0) {
        document.removeEventListener(parseEventName(this.eventName), delegatedRoots.event, false);
        delegatedEvents.remove(this.eventName)
      }
    }
  }
}

function parseEventName (name) {
  return name.substr(2).toLowerCase()
}

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

function attachEventToDocument (eventName, delegatedRoots) {
  const docEvent = (event) => {
    const count = delegatedRoots.items.size()
    if (count > 0) {
      const eventData = {
        currentTarget: event.target
      }
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
  document.addEventListener(parseEventName(eventName), docEvent, false)
  return docEvent
}

export default EventHook