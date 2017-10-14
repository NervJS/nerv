/** @jsx createElement */
import { Component, createElement, render } from '../../src'
import { rerender } from '../../src/render-queue'
import nextTick from '../../src/util/next-tick'
import sinon from 'sinon'

describe('handlers', () => {
  let scratch
  let addEventListenerSpy
  let removeEventListenerSpy
  beforeAll(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  afterAll(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })
  // beforeAll(() => {
  //   const proto = document.constructor.prototype
  //   addEventListenerSpy = sinon.spy(proto, 'addEventListener')
  //   removeEventListenerSpy = sinon.spy(proto, 'removeEventListener')
  // })

  // beforeEach(() => {
  //   addEventListenerSpy.restore()
  //   removeEventListenerSpy.restore()
  // })

  it('should only register on* functions as handlers', () => {
    const click = () => { }
    const onclick = () => { }

    let doRender = null
    const proto = document.constructor.prototype
    addEventListenerSpy = sinon.spy(proto, 'addEventListener')
    removeEventListenerSpy = sinon.spy(proto, 'removeEventListener')

    class Outer extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          show: true
        }
      }

      componentDidMount () {
        doRender = () => {
          this.setState({
            show: false
          })
        }
      }

      render () {
        return (
          this.state.show ? <div click={click} onClick={onclick} /> : null
        )
      }
    }

    render(<Outer />, scratch)

    expect(scratch.childNodes[0].attributes).toHaveLength(0)
    expect(addEventListenerSpy.calledOnce).toBeTruthy()
    expect(addEventListenerSpy.calledWithExactly('click', sinon.match.func, false)).toBeTruthy()

    addEventListenerSpy.restore()
    doRender()
    rerender()
  })

  it('should add and remove event handlers', () => {
    const click = sinon.spy()
    const mousedown = sinon.spy()

    let doRender = null
    const proto = document.constructor.prototype
    addEventListenerSpy = sinon.spy(proto, 'addEventListener')
    removeEventListenerSpy = sinon.spy(proto, 'removeEventListener')

    function fireEvent (on, type) {
      const e = document.createEvent('Event')
      e.initEvent(type, true, true)
      on.dispatchEvent(e)
    }

    class Outer extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          count: 0
        }
        this.clickHandler = () => {
          click(this.state.count)
        }
      }

      componentDidMount () {
        doRender = () => {
          this.setState({
            count: ++this.state.count
          })
        }
      }

      render () {
        return ([
          <div onClick={this.clickHandler} onMouseDown={mousedown} />,
          <div onClick={this.clickHandler} />,
          <div />
        ][this.state.count])
      }
    }

    render(<Outer />, scratch)

    expect(addEventListenerSpy.callCount).toBe(2)
    expect(addEventListenerSpy.calledWith('click')).toBeTruthy()
    expect(addEventListenerSpy.calledWith('mousedown')).toBeTruthy()
    // expect(proto.addEventListener).to.have.been.calledTwice
    //   .and.to.have.been.calledWith('click')
    //   .and.calledWith('mousedown')

    fireEvent(scratch.childNodes[0], 'click')
    expect(click.calledOnce).toBeTruthy()
    expect(click.calledWith(0)).toBeTruthy()
    // expect(click).to.have.been.calledOnce
    //   .and.calledWith(0)

    addEventListenerSpy.reset()
    click.reset()
    doRender()
    rerender()

    expect(addEventListenerSpy.called).toBeFalsy()
    // expect(proto.addEventListener).not.to.have.been.called

    expect(removeEventListenerSpy.calledOnce).toBeTruthy()
    expect(removeEventListenerSpy.calledWith('mousedown')).toBeTruthy()
    // expect(proto.removeEventListener)
    //   .to.have.been.calledOnce
    //   .and.calledWith('mousedown')

    fireEvent(scratch.childNodes[0], 'click')
    expect(click.calledOnce).toBeTruthy()
    expect(click.calledWith(1)).toBeTruthy()
    // expect(click).to.have.been.calledOnce
    //   .and.to.have.been.calledWith(1)

    fireEvent(scratch.childNodes[0], 'mousedown')
    expect(mousedown.called).toBeFalsy()
    // expect(mousedown).not.to.have.been.called

    removeEventListenerSpy.reset()
    click.reset()
    mousedown.reset()

    doRender()
    rerender()

    expect(removeEventListenerSpy.calledOnce).toBeTruthy()
    expect(removeEventListenerSpy.calledWith('click')).toBeTruthy()
    // expect(proto.removeEventListener)
    //   .to.have.been.calledOnce
    //   .and.calledWith('click')

    fireEvent(scratch.childNodes[0], 'click')
    expect(click.called).toBeTruthy()
    // expect(click).not.to.have.been.called

    addEventListenerSpy.restore()
    removeEventListenerSpy.restore()
  })

  it('unbubbleEvents should attach to node instaed of document', (done) => {
    const focus = sinon.spy()

    let doRender = null

    class Outer extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          count: 0
        }
        this.focusHandler = () => {
          focus(this.state.count)
        }
      }

      componentDidMount () {
        doRender = () => {
          this.setState({
            count: ++this.state.count
          })
        }
      }

      render () {
        return ([
          <input onFocus={this.focusHandler} id='input' />,
          <input onFocus={() => ({})} />
        ][this.state.count])
      }
    }

    render(<Outer />, scratch)
    const input = scratch.childNodes[0]
    const proto = input.constructor.prototype
    sinon.spy(proto, 'addEventListener')
    sinon.spy(proto, 'removeEventListener')
    // https://stackoverflow.com/questions/1096436/document-getelementbyidid-focus-is-not-working-for-firefox-or-chrome
    input.focus()
    setTimeout(() => {
      expect(focus).to.have.been.calledOnce
      proto.addEventListener.reset()
      focus.reset()
      doRender()
      nextTick(() => {
        rerender()
        scratch.childNodes[0].focus()
        setTimeout(() => {
          done()
        }, 100)
      })
    }, 100)
  })
})
