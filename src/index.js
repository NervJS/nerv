import Events from './lib/events';
import Module from './lib/module';
import Widget from './lib/widget';
import WidgetDom from './lib/widgetdom';

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const isNode = new Function('try {return this===global;}catch(e){ return false;}');

if (isBrowser()) {
  window.Events = Events;
  window.Module = Module;
  window.Widget = Widget;
  window.WidgetDom = WidgetDom;
} else if (isNode()) {
  exports.Events = Events;
  exports.Module = Module;
  exports.Widget = Widget;
  exports.WidgetDom = WidgetDom;
}