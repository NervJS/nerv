import Widget from './widget';
import { type } from './util';

class WidgetDom {
  static render (widget, container, callback) {
    if (!(widget instanceof Widget)) {
      return;
    }
    let p = null;
    if (!widget._loaded) {
      p = widget._init();
    }
    if (p) {
      p.then(() => {
        widget._$el = $(container);
        widget._link();
        if (type(callback) === 'function') {
          callback.call(widget, widget);
        }
      });
    } else {
      widget._$el = $(container);
      widget._link();
      if (type(callback) === 'function') {
        callback.call(widget, widget);
      }
    }
  }

  static renderToString (widget, callback) {
    if (!(widget instanceof Widget)) {
      return;
    }
    return new Promise((resolve, reject) => {
      let p = widget._init();
      p.then(() => {
        if (type(callback) === 'function') {
          callback.call(widget, widget);
        }
        resolve(widget);
      });
    });
  }
}

export default WidgetDom;