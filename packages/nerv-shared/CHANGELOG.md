# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.4.0"></a>
# [1.4.0](https://github.com/NervJS/nerv/compare/v1.4.0-beta.5...v1.4.0) (2019-06-03)


### Features

* 增加getDerivedStateFromError ([71c3df0](https://github.com/NervJS/nerv/commit/71c3df0))
* 增加getSnapshotBeforeUpdate ([c8594b6](https://github.com/NervJS/nerv/commit/c8594b6))
* 新增生命周期函数getDerivedStateFromProps ([06624cf](https://github.com/NervJS/nerv/commit/06624cf))




<a name="1.3.7"></a>
## [1.3.7](https://github.com/NervJS/nerv/compare/v1.3.6...v1.3.7) (2018-10-26)


### Bug Fixes

* get latest state in componentWillMount setState callback ([20e1e2d](https://github.com/NervJS/nerv/commit/20e1e2d))




<a name="1.3.2"></a>
## [1.3.2](https://github.com/NervJS/nerv/compare/v1.3.2-beta.0...v1.3.2) (2018-07-23)


### Bug Fixes

* invoke setState callback in componentWillMount, fix [#84](https://github.com/NervJS/nerv/issues/84) ([12fa8cf](https://github.com/NervJS/nerv/commit/12fa8cf))




<a name="1.2.15"></a>
## [1.2.15](https://github.com/NervJS/nerv/compare/v1.2.14...v1.2.15) (2018-03-15)


### Bug Fixes

* **nerv-build:** fix error during installing nerv-build on windows ([6f9caf6](https://github.com/NervJS/nerv/commit/6f9caf6))




<a name="1.2.14"></a>
## [1.2.14](https://github.com/NervJS/nerv/compare/v1.2.14-beta.0...v1.2.14) (2018-03-08)




**Note:** Version bump only for package nerv-shared

<a name="1.2.14-beta.0"></a>
## [1.2.14-beta.0](https://github.com/NervJS/nerv/compare/v1.2.13...v1.2.14-beta.0) (2018-03-02)


### Bug Fixes

* DOM reference lost during the patch. close [#42](https://github.com/NervJS/nerv/issues/42). ([055eeb9](https://github.com/NervJS/nerv/commit/055eeb9))




<a name="1.2.13"></a>
## [1.2.13](https://github.com/NervJS/nerv/compare/v1.2.13-beta.0...v1.2.13) (2018-03-01)




**Note:** Version bump only for package nerv-shared

<a name="1.2.9"></a>
## [1.2.9](https://github.com/NervJS/nerv/compare/v1.2.8...v1.2.9) (2018-02-01)




**Note:** Version bump only for package nerv-shared

<a name="1.2.6"></a>
## [1.2.6](https://github.com/NervJS/nerv/compare/v1.2.5...v1.2.6) (2018-01-23)


### Bug Fixes

* should not pass refs to children ([d625476](https://github.com/NervJS/nerv/commit/d625476))




<a name="1.2.3"></a>
## [1.2.3](https://github.com/NervJS/nerv/compare/v1.2.2...v1.2.3) (2018-01-11)


### Bug Fixes

* unstable_renderSubtreeIntoContainer lose context ([4279a77](https://github.com/NervJS/nerv/commit/4279a77))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/NervJS/nerv/compare/v1.1.0...v1.2.0) (2018-01-05)


### Bug Fixes

* `document` can't found in node envirment. ([238163d](https://github.com/NervJS/nerv/commit/238163d))
* set `dangerouslySetInnerHTML` could fail ([e4b3b50](https://github.com/NervJS/nerv/commit/e4b3b50))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/NervJS/nerv/compare/v1.0.2...v1.1.0) (2018-01-02)


### Features

* new module `nerv-create-class` ([e5e5773](https://github.com/NervJS/nerv/commit/e5e5773))




<a name="1.0.2"></a>
## [1.0.2](https://github.com/NervJS/nerv/compare/v1.0.1...v1.0.2) (2017-12-26)


### Bug Fixes

* wrong typing file direaction ([a1bd090](https://github.com/NervJS/nerv/commit/a1bd090))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/NervJS/nerv/compare/v1.0.0...v1.0.1) (2017-12-26)


### Bug Fixes

* nerv-shared|utils don't export default ([dce46eb](https://github.com/NervJS/nerv/commit/dce46eb))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/NervJS/nerv/compare/0.2.8...1.0.0) (2017-12-22)


### Bug Fixes

* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* componentDidCatch should work ([f50f195](https://github.com/NervJS/nerv/commit/f50f195))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.e7741103"></a>
# [0.4.0-beta.e7741103](https://github.com/NervJS/nerv/compare/0.2.8...0.4.0-beta.e7741103) (2017-12-19)


### Bug Fixes

* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* componentDidCatch should work ([f50f195](https://github.com/NervJS/nerv/commit/f50f195))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.04d2693f"></a>
# [0.4.0-beta.04d2693f](https://github.com/NervJS/nerv/compare/0.2.8...0.4.0-beta.04d2693f) (2017-12-07)


### Bug Fixes

* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.f0ef1ef6"></a>
# [0.4.0-beta.f0ef1ef6](https://github.com/NervJS/nerv/compare/0.2.8...0.4.0-beta.f0ef1ef6) (2017-12-04)


### Bug Fixes

* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))



<a name="0.2.0-alpha.1"></a>
# [0.2.0-alpha.1](https://github.com/NervJS/nerv/compare/0.2.1...v0.2.0-alpha.1) (2017-10-28)




<a name="0.4.0-beta.f869cca6"></a>
# [0.4.0-beta.f869cca6](https://github.com/NervJS/nerv/compare/v0.3.0...v0.4.0-beta.f869cca6) (2017-12-04)


### Bug Fixes

* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))




<a name="0.4.0-beta.4b0270d1"></a>
# [0.4.0-beta.4b0270d1](https://github.com/NervJS/nerv/compare/v0.3.0...v0.4.0-beta.4b0270d1) (2017-12-04)


### Bug Fixes

* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))




<a name="0.4.0-beta.4a1e5c20"></a>
# [0.4.0-beta.4a1e5c20](https://github.com/NervJS/nerv/compare/v0.3.0...v0.4.0-beta.4a1e5c20) (2017-12-01)


### Bug Fixes

* attach ref failed ([99b3c41](https://github.com/NervJS/nerv/commit/99b3c41))
* string refs support ([d8f4c56](https://github.com/NervJS/nerv/commit/d8f4c56))
* undefined vnode can't be removed from the document ([4992359](https://github.com/NervJS/nerv/commit/4992359))


### Features

* componentDidCatch basic logic and test ([69d7378](https://github.com/NervJS/nerv/commit/69d7378))
* componentDidCatch can catch every lifecycle ([6b7ff51](https://github.com/NervJS/nerv/commit/6b7ff51))
* new top-level API, `isValidElement` ([6d91881](https://github.com/NervJS/nerv/commit/6d91881))
* refs support string ([662d4db](https://github.com/NervJS/nerv/commit/662d4db))
* remove unnessceily hook type check ([07c7d04](https://github.com/NervJS/nerv/commit/07c7d04))


### Performance Improvements

* don't diff in simple situation ([77f21f9](https://github.com/NervJS/nerv/commit/77f21f9))
* lazy init children ([70f3e56](https://github.com/NervJS/nerv/commit/70f3e56))
* use a empty obj for context ([ddba0ab](https://github.com/NervJS/nerv/commit/ddba0ab))
* use object-literal to create VNode and VText ([3412be7](https://github.com/NervJS/nerv/commit/3412be7))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/NervJS/nerv/compare/v0.2.0-alpha.1...v0.3.0) (2017-10-28)


### Features

* export a empty function from nerv-shared ([1f51b2b](https://github.com/NervJS/nerv/commit/1f51b2b))
