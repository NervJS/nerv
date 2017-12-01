/* eslint-disable */
window.it.skip = xit;
window.describe.skip = xdescribe;
// disable the test suites in IE8
window.describe.ie = document.all && !document.addEventListener
  ? xdescribe
  : describe;
