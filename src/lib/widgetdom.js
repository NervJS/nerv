import Widget from './widget';
import { type } from './util';
import VText from '#/vnode/vtext';
import createElement from '#/create-element';
import { buildVTree } from '#/handle-widget';
import diff from '#/diff';
import patch from '#/patch';
import { isVText, isVNode, isWidget } from '#/vnode/types';

class WidgetDom {
  /**
   * 渲染组件到指定容器
   * @param {*} widget 
   * @param {*} container 
   * @param {*} callback 
   * @example
   * Widget.render(<div>hello</div>, document.getElementById('root'))
   */
  static render (node, container, callback) {
    if (!node) {
      return;
    }
    const patches = diff(null, node);
    const dom = patch(null, patches);
    container.appendChild(dom);
    type(callback) === 'function' && callback();
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

module.exports = WidgetDom;