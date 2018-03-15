# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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




<a name="1.2.13-beta.0"></a>
## [1.2.13-beta.0](https://github.com/NervJS/nerv/compare/v1.2.12...v1.2.13-beta.0) (2018-02-26)


### Bug Fixes

* unkeyed children diffing error. close [#40](https://github.com/NervJS/nerv/issues/40). ([218563a](https://github.com/NervJS/nerv/commit/218563a))
