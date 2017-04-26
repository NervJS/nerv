import Events from './lib/events'
import Module from './lib/module'
import Component from './lib/component'
import { render, renderComponentToString } from './lib/render'
import createElement from './lib/create-element'
import * as Util from './lib/util'
import { addEvent, removeEvent } from './lib/util/dom-events'
import nextTick from './lib/util/next-tick'

const isBrowser = new Function('try {return this===window}catch(e){ return false}')
const isNode = new Function('try {return this===global}catch(e){ return false}')

if (isBrowser()) {
  window.Base = {
    Events,
    Module,
    Component,
    createElement,
    Util,
    addEvent,
    removeEvent,
    render,
    nextTick
  }
} else if (isNode()) {
  module.exports = {
    Events,
    Module,
    Component,
    createElement,
    render,
    renderComponentToString
  }
}