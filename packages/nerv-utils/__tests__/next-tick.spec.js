import { nextTick } from '../src'
import sinon from 'sinon'

describe('nextTick', () => {
  // const canUsePromise = (() => {
  //   return 'Promise' in window && isNative(Promise)
  // })()
  // function isNative (Ctor) {
  //   return typeof ctor === 'function' && /native code/.test(Ctor.toString())
  // }
  it('accepts a callback', done => {
    nextTick(done)
  })

  // TODO: fix this in IE X
  // it('returns a Promise when provided no callback', done => {
  //   const ua = navigator.userAgent.match(/MSIE (\d+)/)
  //   if (!canUsePromise || ua !== null) {
  //     done()
  //   }
  //   nextTick().then(done)
  // })X

  it.skip('throw error in callback can carry on', async () => {
    const consoleErr = console.error
    console.error = function () {}
    const spy = sinon.spy(console, 'error')
    nextTick(() => {
      throw new Error('e')
    })
    await nextTick()
    expect(spy.called).toBeTruthy()
    console.error = consoleErr
  })
})
