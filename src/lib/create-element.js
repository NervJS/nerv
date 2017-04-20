import h from '#/h';
import { isFunction, isString, isBoolean, isObject } from '~';
import ComponentWrapper from './componentwapper';
import RefHook from './hooks/ref-hook';
import HtmlHook from './hooks/html-hook';

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

function transformPropsForRealTag (props) {
  let newProps = {};
  for (let propName in props) {
    let propValue = props[propName];
    if (propName === 'id' || propName === 'className') {
      newProps[propName] = propValue;
      continue;
    }
    if (propName === 'ref') {
      newProps[propName] = new RefHook(propValue);
      continue;
    }
    if (propName === 'dangerouslySetInnerHTML') {
      newProps[propName] = new HtmlHook(propValue);
      continue;
    }
    // 收集事件
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

function transformPropsForComponent (props) {
  let newProps = {};
  for (let propName in props) {
    let propValue = props[propName];
    newProps[propName] = propValue;
  }
  return newProps;
}

function createElement (tagName, properties) {
  let children = [];
  for (let i = 2, len = arguments.length; i < len; i++) {
    children.push(arguments[i]);
  }
  let props;
  if (isString(tagName)) {
    props = transformPropsForRealTag(properties);
    return h(tagName, props, children);
  } else if (isFunction(tagName)) {
    props = transformPropsForComponent(properties);
    props.children = children;
    return new ComponentWrapper(tagName, props);
  }
  return tagName;
}

module.exports = createElement;