import { isFunction, MapClass } from 'nerv-utils'
import { noop } from 'nerv-shared'

const ONINPUT = 'oninput'
const ONPROPERTYCHANGE = 'onpropertychange'

const delegatedEvents = new MapClass()

const doc = document

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

/* istanbul ignore next */
if (navigator.userAgent.indexOf('MSIE 9') >= 0) {
  doc.addEventListener('selectionchange', () => {
    const el = doc.activeElement
    if (detectCanUseOnInputNode(el)) {
      const ev = doc.createEvent('CustomEvent')
      ev.initCustomEvent('input', true, true, {})
      el.dispatchEvent(ev)
    }
  })
}

export function attachEvent (
  domNode: Element,
  eventName: string,
  handler: Function
) {
  eventName = fixEvent(domNode, eventName)
  /* istanbul ignore next */
  if (eventName === ONPROPERTYCHANGE) {
    processOnPropertyChangeEvent(domNode, handler)
    return
  }
  let delegatedRoots = delegatedEvents.get(eventName)
  if (unbubbleEvents[eventName] === 1) {
    if (!delegatedRoots) {
      delegatedRoots = new MapClass()
    }
    const event = attachEventToNode(domNode, eventName, delegatedRoots)
    delegatedEvents.set(eventName, delegatedRoots)
    if (isFunction(handler)) {
      delegatedRoots.set(domNode, {
        eventHandler: handler,
        event
      })
    }
  } else {
    if (!delegatedRoots) {
      delegatedRoots = {
        items: new MapClass()
      }
      delegatedRoots.event = attachEventToDocument(
        doc,
        eventName,
        delegatedRoots
      )
      delegatedEvents.set(eventName, delegatedRoots)
    }
    if (isFunction(handler)) {
      delegatedRoots.items.set(domNode, handler)
    }
  }
}

export function detachEvent (
  domNode: Element,
  eventName: string,
  handler: Function
) {
  eventName = fixEvent(domNode, eventName)
  if (eventName === ONPROPERTYCHANGE) {
    return
  }
  const delegatedRoots = delegatedEvents.get(eventName)
  if (unbubbleEvents[eventName] === 1 && delegatedRoots) {
    const event = delegatedRoots.get(domNode)
    if (event) {
      domNode.removeEventListener(parseEventName(eventName), event.event, false)
      /* istanbul ignore next */
      const delegatedRootsSize = delegatedRoots.size
      if (delegatedRoots.delete(domNode) && delegatedRootsSize === 0) {
        delegatedEvents.delete(eventName)
      }
    }
  } else if (delegatedRoots && delegatedRoots.items) {
    const items = delegatedRoots.items
    if (items.delete(domNode) && items.size === 0) {
      doc.removeEventListener(
        parseEventName(eventName),
        delegatedRoots.event,
        false
      )
      delegatedEvents.delete(eventName)
    }
  }
}

let propertyChangeActiveElement
let propertyChangeActiveElementValue
let propertyChangeActiveElementValueProp
let propertyChangeActiveHandler

/* istanbul ignore next */
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

/* istanbul ignore next */
function processOnPropertyChangeEvent (node, handler) {
  propertyChangeActiveHandler = handler
  if (!bindFocus) {
    bindFocus = true
    doc.addEventListener(
      'focusin',
      () => {
        unbindOnPropertyChange()
        bindOnPropertyChange(node)
      },
      false
    )
    doc.addEventListener('focusout', unbindOnPropertyChange, false)
  }
}

/* istanbul ignore next */
function bindOnPropertyChange (node) {
  propertyChangeActiveElement = node
  propertyChangeActiveElementValue = node.value
  propertyChangeActiveElementValueProp = Object.getOwnPropertyDescriptor(
    node.constructor.prototype,
    'value'
  )
  Object.defineProperty(propertyChangeActiveElement, 'value', {
    get () {
      return propertyChangeActiveElementValueProp.get.call(this)
    },
    set (val) {
      propertyChangeActiveElementValue = val
      propertyChangeActiveElementValueProp.set.call(this, val)
    }
  })
  propertyChangeActiveElement.addEventListener(
    'propertychange',
    propertyChangeHandler,
    false
  )
}

/* istanbul ignore next */
function unbindOnPropertyChange () {
  if (!propertyChangeActiveElement) {
    return
  }
  delete propertyChangeActiveElement.value
  propertyChangeActiveElement.removeEventListener(
    'propertychange',
    propertyChangeHandler,
    false
  )

  propertyChangeActiveElement = null
  propertyChangeActiveElementValue = null
  propertyChangeActiveElementValueProp = null
}

function detectCanUseOnInputNode (node) {
  const nodeName = node.nodeName && node.nodeName.toLowerCase()
  const type = node.type
  return (
    (nodeName === 'input' && /text|password/.test(type)) ||
    nodeName === 'textarea'
  )
}

function fixEvent (node: Element, eventName: string) {
  if (eventName === 'onDoubleClick') {
    eventName = 'ondblclick'
  } else if (eventName === 'onTouchTap') {
    eventName = 'onclick'
    // tslint:disable-next-line:prefer-conditional-expression
  } else if (eventName === 'onChange' && detectCanUseOnInputNode(node)) {
    eventName = ONINPUT in window ? ONINPUT : ONPROPERTYCHANGE
  } else {
    eventName = eventName.toLowerCase()
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
    // for React synthetic event compatibility
    Object.defineProperties(event, {
      nativeEvent: {
        value: event
      },
      persist: {
        value: noop
      }
    })
    eventsToTrigger(event)
    if (event.cancelBubble) {
      return
    }
  }
  if (count > 0) {
    const parentDom = target.parentNode
    if (
      parentDom === null ||
      (event.type === 'click' && parentDom.nodeType === 1 && parentDom.disabled)
    ) {
      return
    }
    dispatchEvent(event, parentDom, items, count, eventData)
  }
}

function attachEventToDocument (d, eventName, delegatedRoots) {
  const eventHandler = (event) => {
    const items = delegatedRoots.items
    const count = items.size
    if (count > 0) {
      const eventData = {
        currentTarget: event.target
      }
      /* istanbul ignore next */
      try {
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
      } catch (error) {
        // some browsers crashed
        // see: https://stackoverflow.com/questions/44052813/why-cannot-redefine-property
      }
      dispatchEvent(event, event.target, delegatedRoots.items, count, eventData)
    }
  }
  d.addEventListener(parseEventName(eventName), eventHandler, false)
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
