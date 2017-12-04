import React from 'nervjs'
// tslint:disable-next-line:no-var-requires
const simulateEvents = require('simulate-event')

function isValidElement (instance) {
  return false
}

function isFunction (x) {
  return typeof x === 'function'
}

function renderIntoDocument (instance) {
  const dom = document.createElement('div')
  return React.render(instance, dom)
}

// tslint:disable-next-line:max-line-length
const Simulate = {}
const EVENTS = [
  'keyDown',
  'keyPress',
  'keyUp',
  'focus',
  'blur',
  'click',
  'contextMenu',
  'doubleClick',
  'drag',
  'dragEnd',
  'dragEnter',
  'dragExit',
  'dragLeave',
  'dragOver',
  'dragStart',
  'drop',
  'mouseDown',
  'mouseEnter',
  'mouseLeave',
  'mouseMove',
  'mouseOut',
  'mouseOver',
  'mouseUp',
  'change',
  'input',
  'submit',
  'touchCancel',
  'touchEnd',
  'touchMove',
  'touchStart',
  'load',
  'error',
  'animationStart',
  'animationEnd',
  'animationIteration',
  'transitionEnd'
]
EVENTS.forEach((event) => {
  Simulate[event] = (node, mock) =>
    simulateEvents.simulate(node, event.toLowerCase(), mock)
})

function isElement (instance) {
  return isValidElement(instance)
}

function isElementOfType (instance, convenienceConstructor) {
  return isElement(instance) && convenienceConstructor
}

function isDOMComponent (instance) {
  return Boolean(instance && instance.nodeType === 1 && instance.tagName)
}

function isCompositeComponent (instance) {
  if (isDOMComponent(instance)) {
    return false
  }
  return isFunction(instance.render) && isFunction(instance.setState)
}

function isCompositeComponentWithType (instance, type) {
  if (!isCompositeComponent(instance)) {
    return false
  }
  return type === instance.type
}

function isCompositeComponentElement (instance) {
  if (!isValidElement(instance)) {
    return false
  }
  const { render, setState } = instance.type.prototype
  return isFunction(render) && isFunction(setState)
}

function findAllInRenderedTree (instance, test) {
  if (!instance) {
    return []
  }
  const findTreeFromDOM = (dom, _test) => {
    let ret: any[] = []
    const inc = dom._component
    if (inc && _test(inc)) {
      ret.push(inc, dom)
      for (let i = 0; i < dom.childNodes.length; i++) {
        const childNode = dom.childNodes[i]
        ret = ret.concat(findTreeFromDOM(childNode, _test))
      }
    } else if (isDOMComponent(dom)) {
      ret.push(dom)
    }
    return ret
  }
  return findTreeFromDOM(instance.dom, test)
}

function mockComponent (module, mockTagName) {
  mockTagName = mockTagName || module.mockTagName || 'div'
  module.prototype.render.mockImplementation(function () {
    return React.createElement(mockTagName, null, this.props.children)
  })
}

function createRenderer () {
  // tslint:disable-next-line:no-empty
  return () => {}
}

function batchedUpdates (cb) {
  cb()
}

export {
  Simulate,
  renderIntoDocument,
  isElementOfType,
  isCompositeComponentWithType,
  isCompositeComponent,
  isCompositeComponentElement,
  findAllInRenderedTree,
  mockComponent,
  batchedUpdates,
  createRenderer
}

export default {
  Simulate,
  renderIntoDocument,
  isElementOfType,
  isCompositeComponentWithType,
  isCompositeComponent,
  isCompositeComponentElement,
  findAllInRenderedTree,
  mockComponent,
  batchedUpdates,
  createRenderer
}
