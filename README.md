# Nerv

> 一个基于virtual dom的类React组件框架

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[![npm](https://img.shields.io/npm/v/nervjs.svg?style=flat-square)](https://www.npmjs.com/package/nervjs)
[![Build Status](https://img.shields.io/travis/NervJS/nerv.svg?style=flat-square)](https://travis-ci.org/NervJS/nerv)
[![Code Climate](https://img.shields.io/codeclimate/github/NervJS/nerv.svg?style=flat-square)](https://codeclimate.com/github/NervJS/nerv)
[![Coverage Status](https://img.shields.io/coveralls/NervJS/nerv.svg?style=flat-square)](https://coveralls.io/github/NervJS/nerv?branch=master)
[![npm](https://img.shields.io/npm/dt/nervjs.svg?style=flat-square)](https://www.npmjs.com/package/nervjs)

[![Build Status](https://saucelabs.com/browser-matrix/nerv-project.svg)](https://saucelabs.com/u/nerv-project)

## Getting started
Nerv 采用和 React 几乎一样的 API，尝试 Nerv 最简单的方法的就是使用 [JSFiddle Hello World 例子]()。但更推荐的方式是使用 Babel + NPM：

```javascript
import Nerv from 'nervjs'
// or
// const Nerv = require('nervjs')
class HelloMessage extends Nerv.Component {
  render() {
    return <div>Hello {this.props.name}</div>
  }
}

Nerv.render(
  <HelloMessage name="Nerv.js" />,
  document.getElementById('app')
)
```

在这个例子中，我们通过默认导入的方法把 `nervjs` 模块导出为 `Nerv`，而在 Babel 中编译 JSX 默认是寻找 `React.createElement`  的方法。因此我们需要修改一下 `.babelrc` 中的设置：

```js
{
  "plugins": [
    ["transform-react-jsx", { "pragma":"Nerv.createElement" }]
  ]
}
```

而当你使用命名方法导入模块时则需要这样：

```js
import { render, Component, createElement } from 'nervjs'
// or
// const { render, Component, createElement } = require('nervjs')

// .babelrc
{
  "plugins": [
    ["transform-react-jsx", { "pragma":"createElement" }]
  ]
}
```

看到这里聪明的你可能会想到一种更简单粗暴的方法：
```
import React from 'nervjs'
// or
// const React = require('nervjs')
// no need to change .babelrc
```

## 和 React 的异同
虽然 Nerv 和 React 的 API 近乎完全一样（你甚至可以直接把 Nerv import 成 React 来使用！），但在细微之处仍然有一些不同。

### 相同的特性

* ES6 class 和生命周期
* Context
* Refs
	* Nerv 支持函数 refs 引用，不支持字符串引用。
* Stateless Component
* High Order Component
* Virtual-DOM
* createElement

### 缺少的特性

* [SyntheticEvent](https://facebook.github.io/react/docs/events.html)
	* 出于维护成本和打包大小的考虑，Nerv 没有实现完整的 Synthetic Event。
* [Children](https://facebook.github.io/react/docs/react-api.html#react.children)
	* 因为所有 `Children` 都是数组，所以 Nerv 并不需要 `Children`。
* [PropType](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) 验证
	* React 16 之后也不推荐使用 PropType 来验证，你可以使用 Flow 或 TypeScript 把这件事做得更好。
*  `createClass() 和 getDefaultProps()`
	* 这两个 ES5 的方法和 `Children` 和 `PropType` 一样，都将在 `nerv-compat` 中得到支持。


### 新增的特性
* 更小的 size
* 更高的性能 （两个都等待最终发布数据）
* 更好的 TypeScript 支持
	* Nerv 就是 TypeScript 写的
* 更好的浏览器兼容性
	* Nerv 会在未来至少一年一直支持 IE8
* 更自由的 License
	* Nerv 是 MIT license，并且没有任何依赖

### 其他的不同
* render 函数
	* 当多次调用 render 函数时，Nerv 默认是追加内容，而 React 是替换内容。
	* render 函数包含在 `ReactDOM` 的包中，而 Nerv 直接内置了这个方法。

## 引入 React 生态的模块
除了少数经过特殊处理过的模块（例如 nerv-redux），当引入 `react-router` 这样的模块时，需要在打包工具中进行多一步处理：

```js
// webpack.config.js
{
  "resolve": {
    "alias": {
      "react": "nerv-compat", // 使用 nervjs 或者 compat 取决于你引入的包是否使用了上述 Nerv 缺少的特性
      "react-dom": "nerv-compat"
    }
  }
}
```

## devtools
当你在安装了 React Dev Tools  的 [Chrome 插件](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=zh-CN) 之后，可以使用该工具调试 Nerv 应用：

```js
import 'nervjs/devtools'
// or 
// require('nervjs/devtools')
// before initial render()
```

