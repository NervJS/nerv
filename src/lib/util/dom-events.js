import { forEach } from './index'

const handlersFlag = 'X-EVENTS-HANDLERS-CACHE'

function getEventHandler (element, handler) {
  let handlers = handler[handlersFlag]
  if (handlers && handlers.length) {
    for (let i = 0; i < handlers.length; i++) {
      let handlerItem = handlers[i]
      if (handlerItem.node && handlerItem.node === element) {
        return handlerItem.handlerWrapper
      }
    }
  }
}

function setEventHandler (element, handler, handlerWrapper) {
  let handlers = handler[handlersFlag] || (handler[handlersFlag] = [])
  let handlerInCache = getEventHandler(element, handler)
  if (!handlerInCache) {
    handlers.push({
      node: element,
      handlerWrapper
    })
    return handlerWrapper
  }
  return handlerInCache
}

export const addEvent = (function addEvent () {
  if (document.addEventListener) {
    return function (element, type, handler) {
      if (element.length) {
        forEach(element, item => addEvent(item, type, handler))
      } else {
        element.addEventListener(type, handler, false)
      }
    }
  }
  return function (element, type, handler) {
    if (element.length) {
      forEach(element, item => addEvent(item, type, handler))
    } else {
      element.attachEvent(`on${type}`, setEventHandler(element, handler, (event) => {
        event = event || window.event
        event.preventDefault = event.preventDefault || function () { event.returnValue = false }
        event.stopPropagation = event.stopPropagation || function () { event.cancelBubble = true }
        event.timeStamp || (event.timeStamp = (new Date()).getTime())
        handler.call(element, event)
      }))
    }
  }
})()

export const removeEvent = (function removeEvent () {
  if (document.removeEventListener) {
    return function (element, type, handler) {
      if (element.length) {
        forEach(element, item => removeEvent(item, type, handler))
      } else {
        element.removeEventListener(type, handler, false)
      }
    }
  }
  return function (element, type, handler) {
    if (element.length) {
      forEach(element, item => removeEvent(item, type, handler))
    } else {
      let handlerInCache = getEventHandler(element, handler)
      if (handlerInCache) {
        element.detachEvent(`on${type}`, handlerInCache)
      }
    }
  }
})()