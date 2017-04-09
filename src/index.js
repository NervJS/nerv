import Events from './lib/events';
import Module from './lib/module';
import Widget from './lib/widget';
import WidgetDom from './lib/widgetdom';
import h from '#/h';

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const isNode = new Function('try {return this===global;}catch(e){ return false;}');

if (isBrowser()) {
  window.Events = Events;
  window.Module = Module;
  window.Widget = Widget;
  window.WidgetDom = WidgetDom;
  window.h = h;
} else if (isNode()) {
  module.exports = {
    Events,
    Module,
    Widget,
    WidgetDom
  };
}