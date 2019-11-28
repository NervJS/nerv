# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.5.6"></a>
## [1.5.6](https://github.com/NervJS/nerv/compare/v1.5.5...v1.5.6) (2019-11-28)


### Bug Fixes

* setState callback should emit in willMount ([885b822](https://github.com/NervJS/nerv/commit/885b822))




<a name="1.5.5"></a>
## [1.5.5](https://github.com/NervJS/nerv/compare/v1.5.4...v1.5.5) (2019-11-12)


### Bug Fixes

* touch and scroll event call event.preventDefault error ([04c6ce8](https://github.com/NervJS/nerv/commit/04c6ce8))




<a name="1.5.4"></a>
## [1.5.4](https://github.com/NervJS/nerv/compare/v1.5.3...v1.5.4) (2019-11-07)


### Bug Fixes

* setState callbacks fire in wrong order ([bab047e](https://github.com/NervJS/nerv/commit/bab047e))




<a name="1.5.3"></a>
## [1.5.3](https://github.com/NervJS/nerv/compare/v1.5.2...v1.5.3) (2019-10-30)


### Bug Fixes

* forget to clear setState callback ([dee494f](https://github.com/NervJS/nerv/commit/dee494f))




<a name="1.5.2"></a>
## [1.5.2](https://github.com/NervJS/nerv/compare/v1.5.1...v1.5.2) (2019-10-29)


### Bug Fixes

* call setState() in setState's callback ([f219ad3](https://github.com/NervJS/nerv/commit/f219ad3))
* render function return a empty array ([f165bf7](https://github.com/NervJS/nerv/commit/f165bf7))




<a name="1.5.1"></a>
## [1.5.1](https://github.com/NervJS/nerv/compare/v1.5.0...v1.5.1) (2019-10-17)


### Bug Fixes

* should correctly append children ([ad95df9](https://github.com/NervJS/nerv/commit/ad95df9))




<a name="1.5.0"></a>
# [1.5.0](https://github.com/NervJS/nerv/compare/v1.4.7...v1.5.0) (2019-10-14)


### Bug Fixes

* ci can't start karma test ([f42d89b](https://github.com/NervJS/nerv/commit/f42d89b))
* fix all fragment test cases ([c648096](https://github.com/NervJS/nerv/commit/c648096))


### Features

* basic support for fragments ([3487ca2](https://github.com/NervJS/nerv/commit/3487ca2))
* fragment should work in most of cases ([104819f](https://github.com/NervJS/nerv/commit/104819f))




<a name="1.4.4"></a>
## [1.4.4](https://github.com/NervJS/nerv/compare/v1.4.3...v1.4.4) (2019-08-19)


### Features

* export getHooks and Current ([8c1b281](https://github.com/NervJS/nerv/commit/8c1b281))




<a name="1.4.0"></a>
# [1.4.0](https://github.com/NervJS/nerv/compare/v1.4.0-beta.5...v1.4.0) (2019-06-03)


### Bug Fixes

* getDerivedStateFromProps导致shouldComponentUpdate 取值不正常 ([b27a488](https://github.com/NervJS/nerv/commit/b27a488))
* 合并master对didMount执行顺序bug的修复 ([8e47105](https://github.com/NervJS/nerv/commit/8e47105))
* 增加lifecycle测试 ([1395ef2](https://github.com/NervJS/nerv/commit/1395ef2))


### Features

* 增加getDerivedStateFromError ([71c3df0](https://github.com/NervJS/nerv/commit/71c3df0))
* 增加getSnapshotBeforeUpdate ([c8594b6](https://github.com/NervJS/nerv/commit/c8594b6))
* 新增生命周期函数getDerivedStateFromProps ([06624cf](https://github.com/NervJS/nerv/commit/06624cf))




<a name="1.3.13"></a>
## [1.3.13](https://github.com/NervJS/nerv/compare/v1.3.12...v1.3.13) (2019-03-21)


### Bug Fixes

* call this.setState fail in the callback of componentWillMount's this.setState ([0e38891](https://github.com/NervJS/nerv/commit/0e38891))




<a name="1.3.12"></a>
## [1.3.12](https://github.com/NervJS/nerv/compare/v1.3.11...v1.3.12) (2019-01-30)




**Note:** Version bump only for package nervjs

<a name="1.3.11"></a>
## [1.3.11](https://github.com/NervJS/nerv/compare/v1.3.10...v1.3.11) (2019-01-28)




**Note:** Version bump only for package nervjs

<a name="1.3.10"></a>
## [1.3.10](https://github.com/NervJS/nerv/compare/v1.3.9...v1.3.10) (2019-01-28)




**Note:** Version bump only for package nervjs

<a name="1.3.9"></a>
## [1.3.9](https://github.com/NervJS/nerv/compare/v1.3.8...v1.3.9) (2018-11-22)


### Bug Fixes

* devtools not working ([9cf6b10](https://github.com/NervJS/nerv/commit/9cf6b10))




<a name="1.3.8"></a>
## [1.3.8](https://github.com/NervJS/nerv/compare/v1.3.7...v1.3.8) (2018-10-29)


### Bug Fixes

* setState first params to be a function, close [#97](https://github.com/NervJS/nerv/issues/97) ([b9d88c7](https://github.com/NervJS/nerv/commit/b9d88c7))
* support clone number ([5f877f9](https://github.com/NervJS/nerv/commit/5f877f9))




<a name="1.3.7"></a>
## [1.3.7](https://github.com/NervJS/nerv/compare/v1.3.6...v1.3.7) (2018-10-26)


### Bug Fixes

* get latest state in componentWillMount setState callback ([20e1e2d](https://github.com/NervJS/nerv/commit/20e1e2d))




<a name="1.3.6"></a>
## [1.3.6](https://github.com/NervJS/nerv/compare/v1.3.5...v1.3.6) (2018-10-25)


### Bug Fixes

* patching error while lastVnode and nextVnode are both array ([e2bd4a3](https://github.com/NervJS/nerv/commit/e2bd4a3))




<a name="1.3.5"></a>
## [1.3.5](https://github.com/NervJS/nerv/compare/v1.3.4...v1.3.5) (2018-09-29)


### Bug Fixes

* sourcemap empty, close [#92](https://github.com/NervJS/nerv/issues/92) ([f1d354f](https://github.com/NervJS/nerv/commit/f1d354f))




<a name="1.3.4"></a>
## [1.3.4](https://github.com/NervJS/nerv/compare/v1.3.4-beta.0...v1.3.4) (2018-09-29)


### Bug Fixes

* cloneElement with false cause error ([e15a5dd](https://github.com/NervJS/nerv/commit/e15a5dd))




<a name="1.3.4-beta.0"></a>
## [1.3.4-beta.0](https://github.com/NervJS/nerv/compare/v1.3.3...v1.3.4-beta.0) (2018-08-16)


### Features

* add typing to pathcStyle ([41e3618](https://github.com/NervJS/nerv/commit/41e3618))




<a name="1.3.3"></a>
## [1.3.3](https://github.com/NervJS/nerv/compare/v1.3.2...v1.3.3) (2018-08-15)


### Bug Fixes

* lastStyle contains style that nextStyle don't, close [#88](https://github.com/NervJS/nerv/issues/88) ([ee0ef8e](https://github.com/NervJS/nerv/commit/ee0ef8e))




<a name="1.3.2"></a>
## [1.3.2](https://github.com/NervJS/nerv/compare/v1.3.2-beta.0...v1.3.2) (2018-07-23)


### Bug Fixes

* children is 0 but not render ([d0014f0](https://github.com/NervJS/nerv/commit/d0014f0))
* invoke setState callback in componentWillMount, fix [#84](https://github.com/NervJS/nerv/issues/84) ([12fa8cf](https://github.com/NervJS/nerv/commit/12fa8cf))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/NervJS/nerv/compare/v1.3.0-beta.0...v1.3.0) (2018-06-08)


### Bug Fixes

* children is a falsy but valid value ([911f017](https://github.com/NervJS/nerv/commit/911f017))




<a name="1.3.2-beta.0"></a>
## [1.3.2-beta.0](https://github.com/NervJS/nerv/compare/v1.3.1...v1.3.2-beta.0) (2018-07-13)


### Bug Fixes

* **nerv:** fix the buggy behavior of modifying context when calling getChildContext ([56911c6](https://github.com/NervJS/nerv/commit/56911c6))




<a name="1.3.1"></a>
## [1.3.1](https://github.com/NervJS/nerv/compare/v1.3.0-beta.0...v1.3.1) (2018-06-29)


### Bug Fixes

* set empty methods to propTypes ([1dbbdd0](https://github.com/NervJS/nerv/commit/1dbbdd0))




<a name="1.3.0-beta.0"></a>
# [1.3.0-beta.0](https://github.com/NervJS/nerv/compare/v1.2.18...v1.3.0-beta.0) (2018-05-31)


### Features

* export  PropTypes as top-level API ([f45010f](https://github.com/NervJS/nerv/commit/f45010f))




<a name="1.2.18"></a>
## [1.2.18](https://github.com/NervJS/nerv/compare/v1.2.17...v1.2.18) (2018-05-03)


### Bug Fixes

* componentDidUpdate prevState error ([c2aecac](https://github.com/NervJS/nerv/commit/c2aecac))
* syntax error ([1f8d0a1](https://github.com/NervJS/nerv/commit/1f8d0a1))




<a name="1.2.17"></a>
## [1.2.17](https://github.com/NervJS/nerv/compare/v1.2.16...v1.2.17) (2018-04-01)




**Note:** Version bump only for package nervjs

<a name="1.2.16"></a>
## [1.2.16](https://github.com/NervJS/nerv/compare/v1.2.15...v1.2.16) (2018-03-26)


### Bug Fixes

* fix cloneElement's bug ([dbceca8](https://github.com/NervJS/nerv/commit/dbceca8))
* patch void element lost dom reference ([32f403d](https://github.com/NervJS/nerv/commit/32f403d))




<a name="1.2.15"></a>
## [1.2.15](https://github.com/NervJS/nerv/compare/v1.2.14...v1.2.15) (2018-03-15)


### Bug Fixes

* cloneElement should clone children as well ([682fe15](https://github.com/NervJS/nerv/commit/682fe15))
* Stateless component should support function returning null. ([386f07a](https://github.com/NervJS/nerv/commit/386f07a))
* **nerv-build:** fix error during installing nerv-build on windows ([6f9caf6](https://github.com/NervJS/nerv/commit/6f9caf6))
* **test:** add test for commit 386f07a and 682fe15. ([f307fec](https://github.com/NervJS/nerv/commit/f307fec))
* **test:** normalize html and format the test file ([a0de170](https://github.com/NervJS/nerv/commit/a0de170))




<a name="1.2.14"></a>
## [1.2.14](https://github.com/NervJS/nerv/compare/v1.2.14-beta.0...v1.2.14) (2018-03-08)


### Bug Fixes

* as per React, functional ref should also detach ([9338a0a](https://github.com/NervJS/nerv/commit/9338a0a))
* cloneElement should clone void vnode as well ([b007de9](https://github.com/NervJS/nerv/commit/b007de9))
* findDOMNode should return null while input is invalid ([76bbec5](https://github.com/NervJS/nerv/commit/76bbec5))
* patch do nothing when lastVnode and nextVnode are both Portal ([cd99801](https://github.com/NervJS/nerv/commit/cd99801))
* ref should exec after componentDidMount hook ([7bf5efa](https://github.com/NervJS/nerv/commit/7bf5efa))
* ref should exeute before render() function ([a4cb918](https://github.com/NervJS/nerv/commit/a4cb918))




<a name="1.2.14-beta.0"></a>
## [1.2.14-beta.0](https://github.com/NervJS/nerv/compare/v1.2.13...v1.2.14-beta.0) (2018-03-02)


### Bug Fixes

* DOM reference lost during the patch. close [#42](https://github.com/NervJS/nerv/issues/42). ([055eeb9](https://github.com/NervJS/nerv/commit/055eeb9))




<a name="1.2.13"></a>
## [1.2.13](https://github.com/NervJS/nerv/compare/v1.2.13-beta.0...v1.2.13) (2018-03-01)


### Bug Fixes

* call insertBefore with null only if nextSibling is an empty textnode ([b44fb2c](https://github.com/NervJS/nerv/commit/b44fb2c))
* **test:** IE8 ignore empty space ([fffbca2](https://github.com/NervJS/nerv/commit/fffbca2))
* export React version as top level API ([5ea0920](https://github.com/NervJS/nerv/commit/5ea0920))




<a name="1.2.13-beta.0"></a>
## [1.2.13-beta.0](https://github.com/NervJS/nerv/compare/v1.2.12...v1.2.13-beta.0) (2018-02-26)


### Bug Fixes

* unkeyed children diffing error. close [#40](https://github.com/NervJS/nerv/issues/40). ([218563a](https://github.com/NervJS/nerv/commit/218563a))




<a name="1.2.12"></a>
## [1.2.12](https://github.com/NervJS/nerv/compare/v1.2.11...v1.2.12) (2018-02-24)


### Bug Fixes

* clone text vnode error when Component update ([4ada5bd](https://github.com/NervJS/nerv/commit/4ada5bd))




<a name="1.2.11"></a>
## [1.2.11](https://github.com/NervJS/nerv/compare/v1.2.10...v1.2.11) (2018-02-09)


### Bug Fixes

* cloneElement lose refs ([8321f4a](https://github.com/NervJS/nerv/commit/8321f4a))
* make a children copy to props in DOM Component ([b513fa5](https://github.com/NervJS/nerv/commit/b513fa5))
* not patch vnode array ([94b5605](https://github.com/NervJS/nerv/commit/94b5605))
* remove portal could fail ([7e64994](https://github.com/NervJS/nerv/commit/7e64994))




<a name="1.2.10"></a>
## [1.2.10](https://github.com/NervJS/nerv/compare/v1.2.9...v1.2.10) (2018-02-02)


### Bug Fixes

* IE9 input/textarea cursor position ([ecc591a](https://github.com/NervJS/nerv/commit/ecc591a))




<a name="1.2.9"></a>
## [1.2.9](https://github.com/NervJS/nerv/compare/v1.2.8...v1.2.9) (2018-02-01)


### Bug Fixes

* only composite and dom element is valid in React ([faf3a90](https://github.com/NervJS/nerv/commit/faf3a90))
* the value update for textarea/input ([22bea4d](https://github.com/NervJS/nerv/commit/22bea4d))




<a name="1.2.8"></a>
## [1.2.8](https://github.com/NervJS/nerv/compare/v1.2.7...v1.2.8) (2018-01-24)


### Bug Fixes

* stateless component patch wrongly ([d595183](https://github.com/NervJS/nerv/commit/d595183))




<a name="1.2.7"></a>
## [1.2.7](https://github.com/NervJS/nerv/compare/v1.2.6...v1.2.7) (2018-01-23)


### Bug Fixes

* typo in unstable_batchedUpdates ([d2852df](https://github.com/NervJS/nerv/commit/d2852df))




<a name="1.2.6"></a>
## [1.2.6](https://github.com/NervJS/nerv/compare/v1.2.5...v1.2.6) (2018-01-23)


### Bug Fixes

* cloneElement should preserve EMPTY_ARRAY instead of create a  new one. ([3b13ed9](https://github.com/NervJS/nerv/commit/3b13ed9))
* componentWillUnmount should be called before removing DOM. fix [#32](https://github.com/NervJS/nerv/issues/32). ([eef6297](https://github.com/NervJS/nerv/commit/eef6297))
* Event.persit support ([eb0c682](https://github.com/NervJS/nerv/commit/eb0c682))
* iOS onClick event ([4b06357](https://github.com/NervJS/nerv/commit/4b06357))
* render() function should render null ([8e32021](https://github.com/NervJS/nerv/commit/8e32021))
* should not ignore children when component pass a empty children ([057f106](https://github.com/NervJS/nerv/commit/057f106))
* should not pass refs to children ([d625476](https://github.com/NervJS/nerv/commit/d625476))




<a name="1.2.5"></a>
## [1.2.5](https://github.com/NervJS/nerv/compare/v1.2.5-beta.3...v1.2.5) (2018-01-18)


### Bug Fixes

* patch children while lastChildren is empty ([7828ba5](https://github.com/NervJS/nerv/commit/7828ba5))


### Performance Improvements

* clear the content instead of removeChild while nextChildren is empty ([fc5d09d](https://github.com/NervJS/nerv/commit/fc5d09d))




<a name="1.2.4"></a>
## [1.2.4](https://github.com/NervJS/nerv/compare/v1.2.4-beta.1...v1.2.4) (2018-01-14)


### Bug Fixes

* stateless component has no state ([c7e84bd](https://github.com/NervJS/nerv/commit/c7e84bd))




<a name="1.2.3"></a>
## [1.2.3](https://github.com/NervJS/nerv/compare/v1.2.2...v1.2.3) (2018-01-11)


### Bug Fixes

* stateless component don't support ref from now ([3e6781f](https://github.com/NervJS/nerv/commit/3e6781f))
* unstable_renderSubtreeIntoContainer lose context ([4279a77](https://github.com/NervJS/nerv/commit/4279a77))




<a name="1.2.2"></a>
## [1.2.2](https://github.com/NervJS/nerv/compare/v1.2.1...v1.2.2) (2018-01-08)




**Note:** Version bump only for package nervjs

<a name="1.2.1"></a>
## [1.2.1](https://github.com/NervJS/nerv/compare/v1.2.0...v1.2.1) (2018-01-08)




**Note:** Version bump only for package nervjs

<a name="1.2.0"></a>
# [1.2.0](https://github.com/NervJS/nerv/compare/v1.1.0...v1.2.0) (2018-01-05)


### Bug Fixes

* `document` can't found in node envirment. ([238163d](https://github.com/NervJS/nerv/commit/238163d))
* flatten children before call Children.forEach etc. ([5060bad](https://github.com/NervJS/nerv/commit/5060bad))
* set `dangerouslySetInnerHTML` could fail ([e4b3b50](https://github.com/NervJS/nerv/commit/e4b3b50))


### Features

* hydrate ([48ec6bf](https://github.com/NervJS/nerv/commit/48ec6bf))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/NervJS/nerv/compare/v1.0.2...v1.1.0) (2018-01-02)


### Bug Fixes

* export createPortal ([2ac34b4](https://github.com/NervJS/nerv/commit/2ac34b4))




<a name="1.0.2"></a>
## [1.0.2](https://github.com/NervJS/nerv/compare/v1.0.1...v1.0.2) (2017-12-26)


### Bug Fixes

* missing main file index.js ([5993ff2](https://github.com/NervJS/nerv/commit/5993ff2))
* wrong typing file direaction ([a1bd090](https://github.com/NervJS/nerv/commit/a1bd090))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/NervJS/nerv/compare/v1.0.0...v1.0.1) (2017-12-26)


### Bug Fixes

* build file include tsd typing ([be83467](https://github.com/NervJS/nerv/commit/be83467))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/NervJS/nerv/compare/0.2.8...1.0.0) (2017-12-22)


### Bug Fixes

*  wrong boolen for IS_NON_DIMENSIONAL ([087918c](https://github.com/NervJS/nerv/commit/087918c))
* `unmountComponentAtNode` don't export as default ([e680b8e](https://github.com/NervJS/nerv/commit/e680b8e))
* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* child context lost during createElement ([6ebed2c](https://github.com/NervJS/nerv/commit/6ebed2c))
* component can't catch ([0d685f8](https://github.com/NervJS/nerv/commit/0d685f8))
* componentDidCatch can't catch component that wraped by vnode ([8b6e71a](https://github.com/NervJS/nerv/commit/8b6e71a))
* componentDidCatch should work ([f50f195](https://github.com/NervJS/nerv/commit/f50f195))
* correct devtools main file ([669d5b8](https://github.com/NervJS/nerv/commit/669d5b8))
* diff break down when nothing returns or throw error in render() function. ([64e3b2f](https://github.com/NervJS/nerv/commit/64e3b2f))
* diff failed when lastVnode is invalid ([6d622b0](https://github.com/NervJS/nerv/commit/6d622b0))
* don't clear dom reference during unount ([b1cbcdd](https://github.com/NervJS/nerv/commit/b1cbcdd))
* error in hoc ([68ec3fc](https://github.com/NervJS/nerv/commit/68ec3fc))
* foreignObject should be created by createElementNS ([5ff40d7](https://github.com/NervJS/nerv/commit/5ff40d7))
* ignore function prop ([749b01e](https://github.com/NervJS/nerv/commit/749b01e))
* multiple define event crash in some browsers ([28cf266](https://github.com/NervJS/nerv/commit/28cf266))
* patch can't get proper lastDom ([200ebf9](https://github.com/NervJS/nerv/commit/200ebf9))
* patch failed when  next vnode length > last vnode length ([df17b50](https://github.com/NervJS/nerv/commit/df17b50))
* patchProps don't remove event listener ([f907f11](https://github.com/NervJS/nerv/commit/f907f11))
* react-router compat ([885bf86](https://github.com/NervJS/nerv/commit/885bf86))
* server rendering style ([f2bfd1b](https://github.com/NervJS/nerv/commit/f2bfd1b))
* set element style.float cross browser ([ca1aaa0](https://github.com/NervJS/nerv/commit/ca1aaa0))
* set input property failed ([9f1d863](https://github.com/NervJS/nerv/commit/9f1d863))
* set type property first for input element ([14dc228](https://github.com/NervJS/nerv/commit/14dc228))
* stateless component can't detach ref ([b7f018a](https://github.com/NervJS/nerv/commit/b7f018a))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))
* unmount  does not return new dom ([c36957d](https://github.com/NervJS/nerv/commit/c36957d))
* unmount can't unhook event ([62a26be](https://github.com/NervJS/nerv/commit/62a26be))
* unmount children don't remove child ([ddc8832](https://github.com/NervJS/nerv/commit/ddc8832))
* unmount clear reference ([aa28146](https://github.com/NervJS/nerv/commit/aa28146))
* unmount component failed ([020f5b2](https://github.com/NervJS/nerv/commit/020f5b2))
* unmountComponentAtNode failed in stateless component ([88a054e](https://github.com/NervJS/nerv/commit/88a054e))
* use a lineweight svg solution ([fe23362](https://github.com/NervJS/nerv/commit/fe23362))
* use try/catch when setting input.type ([e13320a](https://github.com/NervJS/nerv/commit/e13320a))


### Features

* better event compatibility with React ([973a3c1](https://github.com/NervJS/nerv/commit/973a3c1))
* Children export as top-level API ([f780dd9](https://github.com/NervJS/nerv/commit/f780dd9))
* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* componentDidCatch can passthrough child ([931ff20](https://github.com/NervJS/nerv/commit/931ff20))
* createPortal should work ([b8d45aa](https://github.com/NervJS/nerv/commit/b8d45aa))
* devtools support stateless component ([e774110](https://github.com/NervJS/nerv/commit/e774110))
* hooks use enum to identify ([628e1e9](https://github.com/NervJS/nerv/commit/628e1e9))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))
* stateless component now has   shouldComponentUpdate ([48686c9](https://github.com/NervJS/nerv/commit/48686c9))


### Performance Improvements

* better performance when create Children ([dccca50](https://github.com/NervJS/nerv/commit/dccca50))
* createElement ([a22e3f7](https://github.com/NervJS/nerv/commit/a22e3f7))
* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* nextTick use Promise.then ->  requestAnimationFrame -> setTimeout ([dacc145](https://github.com/NervJS/nerv/commit/dacc145))
* remove inaccessible branch ([220ce29](https://github.com/NervJS/nerv/commit/220ce29))
* remove unnecessary prop's setup ([8f98212](https://github.com/NervJS/nerv/commit/8f98212))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use c-style for loop instead of forEach ([3415fe8](https://github.com/NervJS/nerv/commit/3415fe8))
* use internal isArray function ([d65488e](https://github.com/NervJS/nerv/commit/d65488e))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Bug Fixes

* unmountComponentAtNode can't unmount vnode and stateless properly ([e08cb13](https://github.com/NervJS/nerv/commit/e08cb13))


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))


### Performance Improvements

* explicit equal null  for parentNode ([463a9ca](https://github.com/NervJS/nerv/commit/463a9ca))
* remove unnecessary widget type check ([9813c81](https://github.com/NervJS/nerv/commit/9813c81))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.e7741103"></a>
# [0.4.0-beta.e7741103](https://github.com/NervJS/nerv/compare/0.2.8...0.4.0-beta.e7741103) (2017-12-19)


### Bug Fixes

*  wrong boolen for IS_NON_DIMENSIONAL ([087918c](https://github.com/NervJS/nerv/commit/087918c))
* `unmountComponentAtNode` don't export as default ([e680b8e](https://github.com/NervJS/nerv/commit/e680b8e))
* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* child context lost during createElement ([6ebed2c](https://github.com/NervJS/nerv/commit/6ebed2c))
* component can't catch ([0d685f8](https://github.com/NervJS/nerv/commit/0d685f8))
* componentDidCatch can't catch component that wraped by vnode ([8b6e71a](https://github.com/NervJS/nerv/commit/8b6e71a))
* componentDidCatch should work ([f50f195](https://github.com/NervJS/nerv/commit/f50f195))
* diff break down when nothing returns or throw error in render() function. ([64e3b2f](https://github.com/NervJS/nerv/commit/64e3b2f))
* diff failed when lastVnode is invalid ([6d622b0](https://github.com/NervJS/nerv/commit/6d622b0))
* error in hoc ([68ec3fc](https://github.com/NervJS/nerv/commit/68ec3fc))
* ignore function prop ([749b01e](https://github.com/NervJS/nerv/commit/749b01e))
* multiple define event crash in some browsers ([28cf266](https://github.com/NervJS/nerv/commit/28cf266))
* patch can't get proper lastDom ([200ebf9](https://github.com/NervJS/nerv/commit/200ebf9))
* patch failed when  next vnode length > last vnode length ([df17b50](https://github.com/NervJS/nerv/commit/df17b50))
* patchProps don't remove event listener ([f907f11](https://github.com/NervJS/nerv/commit/f907f11))
* react-router compat ([885bf86](https://github.com/NervJS/nerv/commit/885bf86))
* server rendering style ([f2bfd1b](https://github.com/NervJS/nerv/commit/f2bfd1b))
* set element style.float cross browser ([ca1aaa0](https://github.com/NervJS/nerv/commit/ca1aaa0))
* set input property failed ([9f1d863](https://github.com/NervJS/nerv/commit/9f1d863))
* set type property first for input element ([14dc228](https://github.com/NervJS/nerv/commit/14dc228))
* stateless component can't detach ref ([b7f018a](https://github.com/NervJS/nerv/commit/b7f018a))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))
* unmount  does not return new dom ([c36957d](https://github.com/NervJS/nerv/commit/c36957d))
* unmount can't unhook event ([62a26be](https://github.com/NervJS/nerv/commit/62a26be))
* unmount children don't remove child ([ddc8832](https://github.com/NervJS/nerv/commit/ddc8832))
* unmount component failed ([020f5b2](https://github.com/NervJS/nerv/commit/020f5b2))
* unmountComponentAtNode failed in stateless component ([88a054e](https://github.com/NervJS/nerv/commit/88a054e))
* use a lineweight svg solution ([fe23362](https://github.com/NervJS/nerv/commit/fe23362))
* use try/catch when setting input.type ([e13320a](https://github.com/NervJS/nerv/commit/e13320a))


### Features

* better event compatibility with React ([973a3c1](https://github.com/NervJS/nerv/commit/973a3c1))
* Children export as top-level API ([f780dd9](https://github.com/NervJS/nerv/commit/f780dd9))
* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* componentDidCatch can passthrough child ([931ff20](https://github.com/NervJS/nerv/commit/931ff20))
* createPortal should work ([b8d45aa](https://github.com/NervJS/nerv/commit/b8d45aa))
* devtools support stateless component ([e774110](https://github.com/NervJS/nerv/commit/e774110))
* hooks use enum to identify ([628e1e9](https://github.com/NervJS/nerv/commit/628e1e9))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))
* stateless component now has   shouldComponentUpdate ([48686c9](https://github.com/NervJS/nerv/commit/48686c9))


### Performance Improvements

* better performance when create Children ([dccca50](https://github.com/NervJS/nerv/commit/dccca50))
* createElement ([a22e3f7](https://github.com/NervJS/nerv/commit/a22e3f7))
* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* nextTick use Promise.then ->  requestAnimationFrame -> setTimeout ([dacc145](https://github.com/NervJS/nerv/commit/dacc145))
* remove inaccessible branch ([220ce29](https://github.com/NervJS/nerv/commit/220ce29))
* remove unnecessary prop's setup ([8f98212](https://github.com/NervJS/nerv/commit/8f98212))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use c-style for loop instead of forEach ([3415fe8](https://github.com/NervJS/nerv/commit/3415fe8))
* use internal isArray function ([d65488e](https://github.com/NervJS/nerv/commit/d65488e))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Bug Fixes

* unmountComponentAtNode can't unmount vnode and stateless properly ([e08cb13](https://github.com/NervJS/nerv/commit/e08cb13))


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))


### Performance Improvements

* explicit equal null  for parentNode ([463a9ca](https://github.com/NervJS/nerv/commit/463a9ca))
* remove unnecessary widget type check ([9813c81](https://github.com/NervJS/nerv/commit/9813c81))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.04d2693f"></a>
# [0.4.0-beta.04d2693f](https://github.com/NervJS/nerv/compare/0.2.8...0.4.0-beta.04d2693f) (2017-12-07)


### Bug Fixes

*  wrong boolen for IS_NON_DIMENSIONAL ([087918c](https://github.com/NervJS/nerv/commit/087918c))
* `unmountComponentAtNode` don't export as default ([e680b8e](https://github.com/NervJS/nerv/commit/e680b8e))
* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* child context lost during createElement ([6ebed2c](https://github.com/NervJS/nerv/commit/6ebed2c))
* component can't catch ([0d685f8](https://github.com/NervJS/nerv/commit/0d685f8))
* componentDidCatch can't catch component that wraped by vnode ([8b6e71a](https://github.com/NervJS/nerv/commit/8b6e71a))
* diff break down when nothing returns or throw error in render() function. ([64e3b2f](https://github.com/NervJS/nerv/commit/64e3b2f))
* diff failed when lastVnode is invalid ([6d622b0](https://github.com/NervJS/nerv/commit/6d622b0))
* error in hoc ([68ec3fc](https://github.com/NervJS/nerv/commit/68ec3fc))
* ignore function prop ([749b01e](https://github.com/NervJS/nerv/commit/749b01e))
* multiple define event crash in some browsers ([28cf266](https://github.com/NervJS/nerv/commit/28cf266))
* patch can't get proper lastDom ([200ebf9](https://github.com/NervJS/nerv/commit/200ebf9))
* patch failed when  next vnode length > last vnode length ([df17b50](https://github.com/NervJS/nerv/commit/df17b50))
* patchProps don't remove event listener ([f907f11](https://github.com/NervJS/nerv/commit/f907f11))
* server rendering style ([f2bfd1b](https://github.com/NervJS/nerv/commit/f2bfd1b))
* set element style.float cross browser ([ca1aaa0](https://github.com/NervJS/nerv/commit/ca1aaa0))
* set input property failed ([9f1d863](https://github.com/NervJS/nerv/commit/9f1d863))
* set type property first for input element ([14dc228](https://github.com/NervJS/nerv/commit/14dc228))
* stateless component can't detach ref ([b7f018a](https://github.com/NervJS/nerv/commit/b7f018a))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))
* unmount  does not return new dom ([c36957d](https://github.com/NervJS/nerv/commit/c36957d))
* unmount can't unhook event ([62a26be](https://github.com/NervJS/nerv/commit/62a26be))
* unmount children don't remove child ([ddc8832](https://github.com/NervJS/nerv/commit/ddc8832))
* unmountComponentAtNode failed in stateless component ([88a054e](https://github.com/NervJS/nerv/commit/88a054e))
* use a lineweight svg solution ([fe23362](https://github.com/NervJS/nerv/commit/fe23362))
* use try/catch when setting input.type ([e13320a](https://github.com/NervJS/nerv/commit/e13320a))


### Features

* Children export as top-level API ([f780dd9](https://github.com/NervJS/nerv/commit/f780dd9))
* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* componentDidCatch can passthrough child ([931ff20](https://github.com/NervJS/nerv/commit/931ff20))
* createPortal should work ([b8d45aa](https://github.com/NervJS/nerv/commit/b8d45aa))
* hooks use enum to identify ([628e1e9](https://github.com/NervJS/nerv/commit/628e1e9))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* nextTick use Promise.then ->  requestAnimationFrame -> setTimeout ([dacc145](https://github.com/NervJS/nerv/commit/dacc145))
* remove inaccessible branch ([220ce29](https://github.com/NervJS/nerv/commit/220ce29))
* remove unnecessary prop's setup ([8f98212](https://github.com/NervJS/nerv/commit/8f98212))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use c-style for loop instead of forEach ([3415fe8](https://github.com/NervJS/nerv/commit/3415fe8))
* use internal isArray function ([d65488e](https://github.com/NervJS/nerv/commit/d65488e))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Bug Fixes

* unmountComponentAtNode can't unmount vnode and stateless properly ([e08cb13](https://github.com/NervJS/nerv/commit/e08cb13))


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))


### Performance Improvements

* explicit equal null  for parentNode ([463a9ca](https://github.com/NervJS/nerv/commit/463a9ca))
* remove unnecessary widget type check ([9813c81](https://github.com/NervJS/nerv/commit/9813c81))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.f0ef1ef6"></a>
# [0.4.0-beta.f0ef1ef6](https://github.com/NervJS/nerv/compare/0.2.8...0.4.0-beta.f0ef1ef6) (2017-12-04)


### Bug Fixes

*  wrong boolen for IS_NON_DIMENSIONAL ([087918c](https://github.com/NervJS/nerv/commit/087918c))
* `unmountComponentAtNode` don't export as default ([e680b8e](https://github.com/NervJS/nerv/commit/e680b8e))
* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* child context lost during createElement ([6ebed2c](https://github.com/NervJS/nerv/commit/6ebed2c))
* component can't catch ([0d685f8](https://github.com/NervJS/nerv/commit/0d685f8))
* componentDidCatch can't catch component that wraped by vnode ([8b6e71a](https://github.com/NervJS/nerv/commit/8b6e71a))
* diff break down when nothing returns or throw error in render() function. ([64e3b2f](https://github.com/NervJS/nerv/commit/64e3b2f))
* diff failed when lastVnode is invalid ([6d622b0](https://github.com/NervJS/nerv/commit/6d622b0))
* error in hoc ([68ec3fc](https://github.com/NervJS/nerv/commit/68ec3fc))
* ignore function prop ([749b01e](https://github.com/NervJS/nerv/commit/749b01e))
* patch can't get proper lastDom ([200ebf9](https://github.com/NervJS/nerv/commit/200ebf9))
* patch failed when  next vnode length > last vnode length ([df17b50](https://github.com/NervJS/nerv/commit/df17b50))
* patchProps don't remove event listener ([f907f11](https://github.com/NervJS/nerv/commit/f907f11))
* server rendering style ([f2bfd1b](https://github.com/NervJS/nerv/commit/f2bfd1b))
* set element style.float cross browser ([ca1aaa0](https://github.com/NervJS/nerv/commit/ca1aaa0))
* set input property failed ([9f1d863](https://github.com/NervJS/nerv/commit/9f1d863))
* stateless component can't detach ref ([b7f018a](https://github.com/NervJS/nerv/commit/b7f018a))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))
* unmount  does not return new dom ([c36957d](https://github.com/NervJS/nerv/commit/c36957d))
* unmount can't unhook event ([62a26be](https://github.com/NervJS/nerv/commit/62a26be))
* unmount children don't remove child ([ddc8832](https://github.com/NervJS/nerv/commit/ddc8832))
* unmountComponentAtNode failed in stateless component ([88a054e](https://github.com/NervJS/nerv/commit/88a054e))
* use a lineweight svg solution ([fe23362](https://github.com/NervJS/nerv/commit/fe23362))


### Features

* Children export as top-level API ([f780dd9](https://github.com/NervJS/nerv/commit/f780dd9))
* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* componentDidCatch can passthrough child ([931ff20](https://github.com/NervJS/nerv/commit/931ff20))
* createPortal should work ([b8d45aa](https://github.com/NervJS/nerv/commit/b8d45aa))
* hooks use enum to identify ([628e1e9](https://github.com/NervJS/nerv/commit/628e1e9))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* nextTick use Promise.then ->  requestAnimationFrame -> setTimeout ([dacc145](https://github.com/NervJS/nerv/commit/dacc145))
* remove inaccessible branch ([220ce29](https://github.com/NervJS/nerv/commit/220ce29))
* remove unnecessary prop's setup ([8f98212](https://github.com/NervJS/nerv/commit/8f98212))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use c-style for loop instead of forEach ([3415fe8](https://github.com/NervJS/nerv/commit/3415fe8))
* use internal isArray function ([d65488e](https://github.com/NervJS/nerv/commit/d65488e))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Bug Fixes

* unmountComponentAtNode can't unmount vnode and stateless properly ([e08cb13](https://github.com/NervJS/nerv/commit/e08cb13))


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))


### Performance Improvements

* explicit equal null  for parentNode ([463a9ca](https://github.com/NervJS/nerv/commit/463a9ca))
* remove unnecessary widget type check ([9813c81](https://github.com/NervJS/nerv/commit/9813c81))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.f869cca6"></a>
# [0.4.0-beta.f869cca6](https://github.com/NervJS/nerv/compare/v0.3.0...v0.4.0-beta.f869cca6) (2017-12-04)


### Bug Fixes

*  wrong boolen for IS_NON_DIMENSIONAL ([087918c](https://github.com/NervJS/nerv/commit/087918c))
* `unmountComponentAtNode` don't export as default ([e680b8e](https://github.com/NervJS/nerv/commit/e680b8e))
* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* child context lost during createElement ([6ebed2c](https://github.com/NervJS/nerv/commit/6ebed2c))
* component can't catch ([0d685f8](https://github.com/NervJS/nerv/commit/0d685f8))
* componentDidCatch can't catch component that wraped by vnode ([8b6e71a](https://github.com/NervJS/nerv/commit/8b6e71a))
* diff break down when nothing returns or throw error in render() function. ([64e3b2f](https://github.com/NervJS/nerv/commit/64e3b2f))
* diff failed when lastVnode is invalid ([6d622b0](https://github.com/NervJS/nerv/commit/6d622b0))
* error in hoc ([68ec3fc](https://github.com/NervJS/nerv/commit/68ec3fc))
* ignore function prop ([749b01e](https://github.com/NervJS/nerv/commit/749b01e))
* patch can't get proper lastDom ([200ebf9](https://github.com/NervJS/nerv/commit/200ebf9))
* patch failed when  next vnode length > last vnode length ([df17b50](https://github.com/NervJS/nerv/commit/df17b50))
* patchProps don't remove event listener ([f907f11](https://github.com/NervJS/nerv/commit/f907f11))
* server rendering style ([f2bfd1b](https://github.com/NervJS/nerv/commit/f2bfd1b))
* set element style.float cross browser ([ca1aaa0](https://github.com/NervJS/nerv/commit/ca1aaa0))
* set input property failed ([9f1d863](https://github.com/NervJS/nerv/commit/9f1d863))
* stateless component can't detach ref ([b7f018a](https://github.com/NervJS/nerv/commit/b7f018a))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))
* unmount  does not return new dom ([c36957d](https://github.com/NervJS/nerv/commit/c36957d))
* unmount can't unhook event ([62a26be](https://github.com/NervJS/nerv/commit/62a26be))
* unmount children don't remove child ([ddc8832](https://github.com/NervJS/nerv/commit/ddc8832))
* unmountComponentAtNode failed in stateless component ([88a054e](https://github.com/NervJS/nerv/commit/88a054e))
* use a lineweight svg solution ([fe23362](https://github.com/NervJS/nerv/commit/fe23362))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* componentDidCatch can passthrough child ([931ff20](https://github.com/NervJS/nerv/commit/931ff20))
* createPortal should work ([b8d45aa](https://github.com/NervJS/nerv/commit/b8d45aa))
* hooks use enum to identify ([628e1e9](https://github.com/NervJS/nerv/commit/628e1e9))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* nextTick use Promise.then ->  requestAnimationFrame -> setTimeout ([dacc145](https://github.com/NervJS/nerv/commit/dacc145))
* remove inaccessible branch ([220ce29](https://github.com/NervJS/nerv/commit/220ce29))
* remove unnecessary prop's setup ([8f98212](https://github.com/NervJS/nerv/commit/8f98212))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use c-style for loop instead of forEach ([3415fe8](https://github.com/NervJS/nerv/commit/3415fe8))
* use internal isArray function ([d65488e](https://github.com/NervJS/nerv/commit/d65488e))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))




<a name="0.4.0-beta.4b0270d1"></a>
# [0.4.0-beta.4b0270d1](https://github.com/NervJS/nerv/compare/v0.3.0...v0.4.0-beta.4b0270d1) (2017-12-04)


### Bug Fixes

*  wrong boolen for IS_NON_DIMENSIONAL ([087918c](https://github.com/NervJS/nerv/commit/087918c))
* `unmountComponentAtNode` don't export as default ([e680b8e](https://github.com/NervJS/nerv/commit/e680b8e))
* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* child context lost during createElement ([6ebed2c](https://github.com/NervJS/nerv/commit/6ebed2c))
* component can't catch ([0d685f8](https://github.com/NervJS/nerv/commit/0d685f8))
* componentDidCatch can't catch component that wraped by vnode ([8b6e71a](https://github.com/NervJS/nerv/commit/8b6e71a))
* diff break down when nothing returns or throw error in render() function. ([64e3b2f](https://github.com/NervJS/nerv/commit/64e3b2f))
* diff failed when lastVnode is invalid ([6d622b0](https://github.com/NervJS/nerv/commit/6d622b0))
* error in hoc ([68ec3fc](https://github.com/NervJS/nerv/commit/68ec3fc))
* ignore function prop ([749b01e](https://github.com/NervJS/nerv/commit/749b01e))
* patch can't get proper lastDom ([200ebf9](https://github.com/NervJS/nerv/commit/200ebf9))
* patch failed when  next vnode length > last vnode length ([df17b50](https://github.com/NervJS/nerv/commit/df17b50))
* patchProps don't remove event listener ([f907f11](https://github.com/NervJS/nerv/commit/f907f11))
* server rendering style ([f2bfd1b](https://github.com/NervJS/nerv/commit/f2bfd1b))
* set element style.float cross browser ([ca1aaa0](https://github.com/NervJS/nerv/commit/ca1aaa0))
* set input property failed ([9f1d863](https://github.com/NervJS/nerv/commit/9f1d863))
* stateless component can't detach ref ([b7f018a](https://github.com/NervJS/nerv/commit/b7f018a))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))
* unmount  does not return new dom ([c36957d](https://github.com/NervJS/nerv/commit/c36957d))
* unmount can't unhook event ([62a26be](https://github.com/NervJS/nerv/commit/62a26be))
* unmount children don't remove child ([ddc8832](https://github.com/NervJS/nerv/commit/ddc8832))
* unmountComponentAtNode failed in stateless component ([88a054e](https://github.com/NervJS/nerv/commit/88a054e))
* use a lineweight svg solution ([fe23362](https://github.com/NervJS/nerv/commit/fe23362))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* componentDidCatch can passthrough child ([931ff20](https://github.com/NervJS/nerv/commit/931ff20))
* createPortal should work ([b8d45aa](https://github.com/NervJS/nerv/commit/b8d45aa))
* hooks use enum to identify ([628e1e9](https://github.com/NervJS/nerv/commit/628e1e9))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* nextTick use Promise.then ->  requestAnimationFrame -> setTimeout ([dacc145](https://github.com/NervJS/nerv/commit/dacc145))
* remove inaccessible branch ([220ce29](https://github.com/NervJS/nerv/commit/220ce29))
* remove unnecessary prop's setup ([8f98212](https://github.com/NervJS/nerv/commit/8f98212))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use c-style for loop instead of forEach ([3415fe8](https://github.com/NervJS/nerv/commit/3415fe8))
* use internal isArray function ([d65488e](https://github.com/NervJS/nerv/commit/d65488e))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))




<a name="0.4.0-beta.4a1e5c20"></a>
# [0.4.0-beta.4a1e5c20](https://github.com/NervJS/nerv/compare/v0.3.0...v0.4.0-beta.4a1e5c20) (2017-12-01)


### Bug Fixes

*  wrong boolen for IS_NON_DIMENSIONAL ([087918c](https://github.com/NervJS/nerv/commit/087918c))
* `unmountComponentAtNode` don't export as default ([e680b8e](https://github.com/NervJS/nerv/commit/e680b8e))
* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* child context lost during createElement ([6ebed2c](https://github.com/NervJS/nerv/commit/6ebed2c))
* component can't catch ([0d685f8](https://github.com/NervJS/nerv/commit/0d685f8))
* componentDidCatch can't catch component that wraped by vnode ([8b6e71a](https://github.com/NervJS/nerv/commit/8b6e71a))
* diff break down when nothing returns or throw error in render() function. ([64e3b2f](https://github.com/NervJS/nerv/commit/64e3b2f))
* diff failed when lastVnode is invalid ([6d622b0](https://github.com/NervJS/nerv/commit/6d622b0))
* error in hoc ([68ec3fc](https://github.com/NervJS/nerv/commit/68ec3fc))
* ignore function prop ([749b01e](https://github.com/NervJS/nerv/commit/749b01e))
* patch can't get proper lastDom ([200ebf9](https://github.com/NervJS/nerv/commit/200ebf9))
* patch failed when  next vnode length > last vnode length ([df17b50](https://github.com/NervJS/nerv/commit/df17b50))
* patchProps don't remove event listener ([f907f11](https://github.com/NervJS/nerv/commit/f907f11))
* server rendering style ([f2bfd1b](https://github.com/NervJS/nerv/commit/f2bfd1b))
* set element style.float cross browser ([ca1aaa0](https://github.com/NervJS/nerv/commit/ca1aaa0))
* set input property failed ([9f1d863](https://github.com/NervJS/nerv/commit/9f1d863))
* stateless component can't detach ref ([b7f018a](https://github.com/NervJS/nerv/commit/b7f018a))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))
* unmount  does not return new dom ([c36957d](https://github.com/NervJS/nerv/commit/c36957d))
* unmount can't unhook event ([62a26be](https://github.com/NervJS/nerv/commit/62a26be))
* unmount children don't remove child ([ddc8832](https://github.com/NervJS/nerv/commit/ddc8832))
* unmountComponentAtNode failed in stateless component ([88a054e](https://github.com/NervJS/nerv/commit/88a054e))
* use a lineweight svg solution ([fe23362](https://github.com/NervJS/nerv/commit/fe23362))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* componentDidCatch can passthrough child ([931ff20](https://github.com/NervJS/nerv/commit/931ff20))
* createPortal should work ([b8d45aa](https://github.com/NervJS/nerv/commit/b8d45aa))
* hooks use enum to identify ([628e1e9](https://github.com/NervJS/nerv/commit/628e1e9))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* nextTick use Promise.then ->  requestAnimationFrame -> setTimeout ([dacc145](https://github.com/NervJS/nerv/commit/dacc145))
* remove inaccessible branch ([220ce29](https://github.com/NervJS/nerv/commit/220ce29))
* remove unnecessary prop's setup ([8f98212](https://github.com/NervJS/nerv/commit/8f98212))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use c-style for loop instead of forEach ([3415fe8](https://github.com/NervJS/nerv/commit/3415fe8))
* use internal isArray function ([d65488e](https://github.com/NervJS/nerv/commit/d65488e))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Bug Fixes

* unmountComponentAtNode can't unmount vnode and stateless properly ([e08cb13](https://github.com/NervJS/nerv/commit/e08cb13))


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))


### Performance Improvements

* explicit equal null  for parentNode ([463a9ca](https://github.com/NervJS/nerv/commit/463a9ca))
* remove unnecessary widget type check ([9813c81](https://github.com/NervJS/nerv/commit/9813c81))
