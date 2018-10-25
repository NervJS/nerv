import React from 'nervjs'
import {
  isValidElement,
  isComposite,
  VirtualNode,
  isWidget,
  isVNode,
  isComponent
} from 'nerv-shared'
import { isString, isArray } from 'nerv-utils'
import simulant from 'simulant'

function renderIntoDocument (instance) {
  const dom = document.createElement('div')
  document.body.appendChild(dom)
  return React.render(instance, dom)
}

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
    simulant.fire(node, event.toLowerCase(), mock)
})

function isElement (instance) {
  return isValidElement(instance)
}

function isElementOfType (instance, convenienceConstructor) {
  return isElement(instance) && convenienceConstructor === instance.type
}

function isDOMComponent (inst): inst is Element {
  return !!(inst && inst.nodeType === 1 && inst.tagName)
}

function isDOMComponentOfType (instance: any, tagName: string): boolean {
  return (
    isDOMComponent(instance) &&
    isString(tagName) &&
    instance.tagName === tagName.toUpperCase()
  )
}

function isCompositeComponent (instance) {
  return isComposite(instance)
}

function isCompositeComponentWithType (instance, type) {
  if (!isCompositeComponent(instance)) {
    return false
  }
  return type === instance.type
}

function findAllInRenderedTree (
  tree: VirtualNode,
  test: (vnode: VirtualNode) => boolean
) {
  if (isValidElement(tree) || isComponent(tree) || isDOMComponent) {
    const node = isVNode(tree) ? tree.dom : tree
    let result = test(node as any) ? [node as any] : []
    let children
    if (isWidget(tree) || isComponent(tree)) {
      children = tree._rendered
    } else if (isVNode(tree)) {
      children = tree.children
    } else {
      children = tree
    }
    if (isWidget(children)) {
      result = result.concat(findAllInRenderedTree(children, test) as any)
    } else if (isVNode(children)) {
      result = result.concat(findAllInRenderedTree(children, test) as any)
    } else if (isArray(children)) {
      children.forEach((child) => {
        result = result.concat(findAllInRenderedTree(child, test) as any)
      })
    } else if (isDOMComponent(children)) {
      console.log(children)
    }
    return result
  } else {
    throw new Error('Tree must be a valid elment!')
  }
}

function parseClass (filter) {
  if (isArray(filter)) {
    return filter
  } else if (isString(filter)) {
    return filter.trim().split(/\s+/)
  } else {
    return []
  }
}

function scryRenderedDOMComponentsWithClass (
  tree,
  classNames: string | string[]
) {
  return findAllInRenderedTree(tree, (instance) => {
    if (isDOMComponent(instance)) {
      const classList = parseClass(instance.getAttribute('class'))
      return parseClass(classNames).every(
        (className) => classList.indexOf(className) !== -1
      )
    }
    return false
  })
}

function findRenderedDOMComponentWithClass (
  tree,
  classNames: string | string[]
) {
  const result = scryRenderedDOMComponentsWithClass(tree, classNames)
  if (result.length === 1) {
    return result[0]
  }
  throw new Error(`Did not find exactly one result: ${result}.`)
}

function scryRenderedDOMComponentsWithTag (tree, tag: string) {
  return findAllInRenderedTree(tree, (instance) => {
    return isDOMComponentOfType(instance, tag)
  })
}

function findRenderedDOMComponentWithTag (tree, tag: string) {
  const result = scryRenderedDOMComponentsWithTag(tree, tag)
  if (result.length === 1) {
    return result[0]
  }
  throw new Error(`Did not find exactly one result: ${result}.`)
}

function scryRenderedComponentsWithType (tree, type) {
  return findAllInRenderedTree(tree, (instance) => {
    return isCompositeComponentWithType(instance, type)
  })
}

function findRenderedComponentWithType (tree, type: string) {
  const result = scryRenderedComponentsWithType(tree, type)
  if (result.length === 1) {
    return result[0]
  }
  throw new Error(`Did not find exactly one result: ${result}.`)
}

function mockComponent (module, mockTagName) {
  mockTagName = mockTagName || module.mockTagName || 'div'
  module.prototype.render.mockImplementation(function () {
    return React.createElement(mockTagName, null, this.props.children)
  })
}

export {
  Simulate,
  renderIntoDocument,
  mockComponent,
  isElement,
  isElementOfType,
  isDOMComponent,
  isDOMComponentOfType,
  isCompositeComponent,
  isCompositeComponentWithType,
  findAllInRenderedTree,
  scryRenderedDOMComponentsWithClass,
  scryRenderedComponentsWithType,
  scryRenderedDOMComponentsWithTag,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithClass,
  findRenderedDOMComponentWithTag
}

export default {
  Simulate,
  renderIntoDocument,
  mockComponent,
  isElement,
  isElementOfType,
  isDOMComponent,
  isDOMComponentOfType,
  isCompositeComponent,
  isCompositeComponentWithType,
  findAllInRenderedTree,
  scryRenderedDOMComponentsWithClass,
  scryRenderedComponentsWithType,
  scryRenderedDOMComponentsWithTag,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithClass,
  findRenderedDOMComponentWithTag
}
