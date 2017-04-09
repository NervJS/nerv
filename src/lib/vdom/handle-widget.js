import { type, clone, map } from '~';
import { isVNode, isVText, isWidget } from './vnode/types';
import diff from './diff';
import patch from './patch';
import { createWidget } from './widget-pool';

function getVNodeProps (vnode) {
  if (!isVNode(vnode)) {
    return null;
  }
  const properties = clone(vnode.properties);
  properties.children = vnode.children;
  const defaultProps = vnode.tagName.defaultProps;
  if (defaultProps) {
		for (let i in defaultProps) {
			if (properties[i] === undefined) {
				properties[i] = defaultProps[i];
			}
		}
	}
  return properties;
}

function setWidgetProps (widget, props, context) {
  if (widget._disable) {
    return;
  }
  widget._disable = true;
  if ((widget.__ref = props.ref)) {
    delete props.ref;
  }
	if ((widget.__key = props.key)) {
    delete props.key;
  }
  if (widget.willReceiveProps) {
    widget.willReceiveProps(props, context);
  }
  widget.prevContext = widget.context;
  widget.context = context;
  widget.prevProps = widget.props;
  widget.props = props;
  widget._disable = false;
}

export function renderWidget (widget) {
  if (widget._disable) {
    return;
  }
  let shouldRender = true;
  let rendered;
  let base = widget.base;
  let nextBase = widget.nextBase;
  let state = widget.state;
  let props = widget.props;
  let context = widget.context;
  let prevState = widget.prevState || state;
  let prevProps = widget.prevProps || props;
  let instance;
  if (base) {
    if (widget.shouldUpdate && !widget.shouldUpdate(props, state)) {
      shouldRender = false;
    } else if (widget.willUpdate) {
      widget.willUpdate(props, state);
    }
  }
  widget._dirty = false;
  if (shouldRender) {
    if (widget.render) {
      rendered = widget.render();
    }
    let toUnmount;
    const tagName = rendered && rendered.tagName;
    let prevVnode = widget._vnode;
    widget._vnode = rendered;
  }
}

export function handleWidget (oldVNode, newVNode) {
  let instance = oldVNode && oldVNode._widget;
  let originalWidget = instance;
  let isDirectOwner = instance && oldVNode._widgetConstructor === newVNode.tagName;
  let isOwner = isDirectOwner;
  while (instance && !isOwner && (instance = instance._parentWidget)) {
		isOwner = w.constructor === newVNode.tagName;
	}
  let props = getVNodeProps(newVNode);
  let old = instance && instance._vnode;
  if (instance && isOwner && instance._widget) {
    setWidgetProps(instance, props);
    renderWidget(instance);
  } else {
    instance = createWidget(newVNode.tagName, props);
    setWidgetProps(instance, props);
    renderWidget(instance);
  }
  return {
    a: old || null,
    b: instance._vnode || null
  }
}
