
<h3 style="text-align:center;font-weight: 300;" align="center">
  <img src="http://storage.360buyimg.com/mtd/home/logo-2x1513837926707.png" width="160px">
</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/nervjs"><img src="https://img.shields.io/npm/v/nervjs.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/l/nervjs.svg" alt="License"></a>
  <a href="https://coveralls.io/github/NervJS/nerv?branch=master"><img src="https://img.shields.io/coveralls/NervJS/nerv.svg?style=flat-square" alt="Coverage Status"></a>
  <a href="https://www.npmjs.com/package/nervjs"><img src="https://img.shields.io/npm/dt/nervjs.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://travis-ci.org/NervJS/nerv"><img src="https://img.shields.io/travis/NervJS/nerv.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://saucelabs.com/u/nerv-project"><img src="https://saucelabs.com/browser-matrix/nerv-project.svg" alt="Sauce Test Status"></a>
</p>

> Nerv是一款基于虚拟DOM技术的JavaScript（TypeScript）库，它提供了与React 16一致的使用方式与API，并且拥有更高的性能表现、更小的包大小以及更好的浏览器兼容性

[English](/README.md)


## 特性

⚛ 与React保持一致的API，不需要 `nerv-compat`

️⚔ 久经战斗洗礼，已经应用于[京东PC首页](https://www.jd.com/2017?t=1607) 与 [京东旗下TOPLIFE](https://www.toplife.com)

⚡️ 强劲的性能

🤣 IE8兼容

🎯 更小尺寸, 9Kb gziped

🌗 支持客户端与服务端同构渲染

💫 支持React 16的新特性, 例如错误处理, Portals, 自定义DOM属性等等.

## 相关NPM包

本项目采用[Lerna](https://github.com/lerna/lerna)对多个NPM包进行维护管理，包括：

| NPM包           |   介绍 |
| ------------- |:-------------:|
| [`nervjs`](/packages/nerv)      |  Nerv库  |
| [`nerv-redux`](/packages/nerv-redux)      |  Nerv与Redux结合，类似react-redux  |
| [`nerv-devtools`](/packages/nerv-devtools) | 提供对React Developer Tool的支持 |
| [`nerv-server`](/packages/nerv-server) | 提供服务端渲染支持 |
| [`nerv-test-utils`](/packages/nerv-test-utils) | Nerv应用测试套件   |
| [`nerv-utils`](/packages/nerv-utils) |  Nerv内部帮助方法集  |
| [`nerv-shared`](/packages/nerv-shared) |  Nerv内部shared方法集  |
| [`nerv-create-class`](/packages/nerv-create-class) |  `createClass` API支持  |

## 快速开始

[CodeSandbox Playground](https://codesandbox.io/s/qkr5ww1q8j)是最简单的开始使用**Nerv**的方式。并且如果你已经使用过**React**，你就已经知道如何来使用**Nerv**了。

### 安装

当然我们推荐使用 [Webpack](https://webpack.js.org) 和 [Babel](https://babeljs.io) 来使用Nerv。首先你需要安装Nerv

With npm

```bash
$ npm install --save nervjs
```

With yarn

```bash
$ yarn add nervjs
```

### 使用

然后就可以引入Nerv了，Nerv同时提供了作为命名空间默认导出和多个方法导出两种使用方式

**默认导出作为命名空间：**

```javascript
import Nerv from 'nervjs'
class HelloMessage extends Nerv.Component {
  render() {
    return <div>Hello {this.props.name}</div>
  }
}

Nerv.render(
  <HelloMessage name="Nerv" />,
  document.getElementById('app')
)
```

**多个方法单独导出：**

```javascript
import { Component, render } from 'nervjs'
class HelloMessage extends Component {
  render() {
    return <div>Hello {this.props.name}</div>
  }
}

render(
  <HelloMessage name="Nerv" />,
  document.getElementById('app')
)
```

☝️ 更多信息请移步到官方 [开发文档](https://nervjs.github.io/docs/)

## 示例 
* [TodoMVC](https://github.com/NervJS/nerv-redux-todomvc), built with Nerv and Redux
* [Nerv官网](https://github.com/NervJS/nerv-website), built with Nerv and [react-intl](https://github.com/yahoo/react-intl)
* [京东PC首页](https://www.jd.com/2017?t=1607)
* [京东旗下TOPLIFE](https://www.toplife.com)


## 从React切换成Nerv

从React切换成使用Nerv非常方便，只需要将`react` 和 `react-dom` 重命名成 `nervjs`，而不需要任何的代码变动。

### 使用Webpack

在你的 `webpack.config.js` 文件增加一个 `alias` 配置:

```js
{
  // ...
  resolve: {
    alias: {
      'react': 'nervjs',
      'react-dom': 'nervjs',
      // 除非你想使用 `createClass`，否则这一条配置是没有必要的
      'create-react-class': "nerv-create-class"
    }
  }
  // ...
}
```

### 使用Babel

通过安装这个babel插件来进行重命名

```bash

$ npm install --save-dev babel-plugin-module-resolver
```

并且在 `.babelrc` 中进行配置

```json
{
  "plugins": [
    ["module-resolver", {
      "root": ["."],
      "alias": {
        "react": "nervjs",
        "react-dom": "nervjs",
        // 除非你想使用 `createClass`，否则这一条配置是没有必要的
        "create-react-class": "nerv-create-class"
      }
    }]
  ]
}
```

### 使用Browserify

安装重命名转换工具

```bash

$ npm i --save-dev aliasify
```

然后在你的 `package.json` 文件中加入配置

```json
{
  "aliasify": {
    "aliases": {
      "react": "nervjs",
      "react-dom": "nervjs"
    }
  }
}
```

## 适配React

当前Nerv支持的React API与特性

### `react`

* React.createClass (legacy)
* React.createElement
* React.cloneElement
* React.Component
* React.PureComponent
* React.PropTypes
* React.Children
* React.isValidElement
* [Error Boundaries](https://reactjs.org/docs/error-boundaries.html#introducing-error-boundaries) (React 16)
 
### `react-dom`

* React.unstable_renderSubtreeIntoContainer (legacy)
* ReactDOM.render
* ReactDOM.unmountComponentAtNode
* ReactDOM.findDOMNode
* ReactDOM.hydrate (React 16)
* ReactDOM.createPortal (React 16)


## IE8兼容

首先, 安装 `es5-polyfill`

```bash
npm install --save es5-polyfill
```

然后在你的代码文件中引用它

```js
require('es5-polyfill')
```

最后如果你使用 `babel` 的话，配置 `.babelrc`

```json
{
  "presets": [
    ["env", {
      "spec": true,
      "useBuiltIns": false
    }],
    ["es3"]
  ],
  ...
}
```

## 开发者工具Developer Tools

Nerv提供了一个开发者工具模块来帮助你使用[React Chrome Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) 插件。

使用Nerv时开启开发者工具，需要安装 `nerv-devtools` 包，然后在初始化的 `Nerv.render()` 方法调用之前引用这个包 `require('nerv-devtools')`。


```js
if (process.env.NODE_ENV !== 'production')  {
  require('nerv-devtools')
}
// 在 Nerv.render()调用之前
Nerv.render(<App />, document.getElementById('#root'))
```

![nerv-devtools](https://i.loli.net/2018/01/09/5a5480c074d99.png)

## [Change Log](https://github.com/NervJS/nerv/blob/master/packages/nerv/CHANGELOG.md)

## 特别鸣谢

[凹凸实验室（京东-多终端研发部）](https://aotu.io)

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FNervJS%2Fnerv.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FNervJS%2Fnerv?ref=badge_large)
