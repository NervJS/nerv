import h from '#/h';
import { isFunction, isString, isBoolean, isObject } from '~';
import ComponentWrapper from './componentwapper';

function transformProps (props) {
  let newProps = {};
  for (let propName in props) {
    let propValue = props[propName];
    if (propName === 'id' || propName === 'className') {
      newProps[propName] = propValue;
      continue;
    }
    if (propName.charAt(0) === 'o' && propName.charAt(1) === 'n') {
      propName = propName.toLowerCase();
      newProps[propName] = propValue;
      continue;
    }
    if (propName === 'defaultValue') {
      newProps.value = props.value || props.defaultValue;
      continue;
    }
    if (isBoolean(propValue)) {
      if (propValue) {
        newProps.attributes = newProps.attributes || {};
        newProps.attributes[propName] = propValue;
      }
      newProps[propName] = propValue;
      continue;
    }
    if (propName === 'style') {
      if (isString(propValue)) {
        newProps[propName] = propValue;
      } else if (isObject(propValue)) {
        for (let styleName in propValue) {
          let styleValue = propValue[styleName];
          styleValue = typeof styleValue === 'number' && IS_NON_DIMENSIONAL.test(styleName) === false ? (styleValue + 'px') : styleValue;
          newProps[propName][styleName] = styleValue;
        }
      }
      continue;
    }
    newProps.attributes = newProps.attributes || {};
    newProps.attributes[propName] = propValue;
  }
  return newProps;
}

function createElement (tagName, properties) {
  let children = [];
  for (let i = 2, len = arguments.length; i < len; i++) {
    children.push(arguments[i]);
  }
  let props = transformProps(properties);
  if (isString(tagName)) {
    return h(tagName, props, children);
  } else if (isFunction(tagName)) {
    props.children = children;
    return new ComponentWrapper(tagName, props);
  }
  return tagName;
}

module.exports = createElement;