import Events from './lib/events';
import Module from './lib/module';
import Component from './lib/component';
import ComponentDom from './lib/componentdom';
import createElement from './lib/create-element';

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const isNode = new Function('try {return this===global;}catch(e){ return false;}');

if (isBrowser()) {
  window.Base = {
    Events,
    Module,
    Component,
    createElement
  };
  window.BaseDom = ComponentDom;
} else if (isNode()) {
  module.exports = {
    Events,
    Module,
    Component,
    ComponentDom,
    createElement
  };
}