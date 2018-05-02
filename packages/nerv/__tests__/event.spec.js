/** @jsx createElement */
import { Component, createElement, render, nextTick } from '../src'
import { rerender } from '../src/render-queue'
import sinon from 'sinon'

// @TODO: figure out why run component.spec before event.spec will occurs error
describe('Events', () => {
  beforeEach(() => {
    const {
      addEventListener,
      removeEventListener
    } = document.constructor.prototype
    if (addEventListener.restore) {
      addEventListener.restore()
    }
    if (removeEventListener.restore) {
      removeEventListener.restore()
    }
  })

  it('should only register on* functions as handlers', () => {
    const scratch = document.createElement('div')
    document.body.appendChild(scratch)
    const click = () => {}
    const onclick = () => {}

    let doRender = null
    const proto = document.constructor.prototype
    const addEventListenerSpy = sinon.spy(proto, 'addEventListener')

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
        return this.state.show ? <div click={click} onClick={onclick} /> : null
      }
    }

    render(<Outer />, scratch)

    expect(scratch.childNodes[0].attributes.length.toString()).toMatch(/0|1/) // 1 for ie8
    expect(addEventListenerSpy.calledOnce).toBeTruthy()
    expect(
      addEventListenerSpy.calledWithExactly('click', sinon.match.func, false)
    ).toBeTruthy()

    addEventListenerSpy.restore()
    doRender()
    rerender()
  })

  it('should add and remove event handlers', () => {
    const scratch = document.createElement('div')
    document.body.appendChild(scratch)
    const click = sinon.spy()
    const mousedown = sinon.spy()

    let doRender = null
    const proto = document.constructor.prototype
    const addEventListenerSpy = sinon.spy(proto, 'addEventListener')
    const removeEventListenerSpy = sinon.spy(proto, 'removeEventListener')

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
        return [
          <div onClick={this.clickHandler} onMouseDown={mousedown} />,
          <div onClick={this.clickHandler} />,
          <div />
        ][this.state.count]
      }
    }

    render(<Outer />, scratch)

    expect(addEventListenerSpy.callCount).toBe(2)
    expect(addEventListenerSpy.calledWith('click')).toBeTruthy()
    expect(addEventListenerSpy.calledWith('mousedown')).toBeTruthy()

    fireEvent(scratch.childNodes[0], 'click')
    expect(click.calledOnce).toBeTruthy()
    expect(click.calledWith(0)).toBeTruthy()

    addEventListenerSpy.reset()
    click.reset()
    doRender()
    rerender()

    expect(addEventListenerSpy.called).toBeFalsy()

    expect(removeEventListenerSpy.calledOnce).toBeTruthy()
    expect(removeEventListenerSpy.calledWith('mousedown')).toBeTruthy()

    fireEvent(scratch.childNodes[0], 'click')
    expect(click.calledOnce).toBeTruthy()
    expect(click.calledWith(1)).toBeTruthy()

    fireEvent(scratch.childNodes[0], 'mousedown')
    expect(mousedown.called).toBeFalsy()

    removeEventListenerSpy.reset()
    click.reset()
    mousedown.reset()

    doRender()
    rerender()

    expect(removeEventListenerSpy.calledOnce).toBeTruthy()
    expect(removeEventListenerSpy.calledWith('click')).toBeTruthy()

    fireEvent(scratch.childNodes[0], 'click')
    expect(click.called).toBeFalsy()

    addEventListenerSpy.restore()
    removeEventListenerSpy.restore()
  })

  it('unbubbleEvents should attach to node instaed of document', async () => {
    const scratch = document.createElement('div')
    document.body.appendChild(scratch)
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
        return [
          <input onFocus={this.focusHandler} id='input' />,
          <input onFocus={() => ({})} />
        ][this.state.count]
      }
    }

    render(<Outer />, scratch)
    const input = scratch.childNodes[0]
    const proto = input.constructor.prototype
    const addEventListenerSpy = sinon.spy(proto, 'addEventListener')
    const removeEventListenerSpy = sinon.spy(proto, 'removeEventListener')
    // https://stackoverflow.com/questions/1096436/document-getelementbyidid-focus-is-not-working-for-firefox-or-chrome
    input.focus()
    await nextTick()
    // expect(addEventListenerSpy.called).toBeTruthy(`expect(focus.calledOnce)`)
    addEventListenerSpy.reset()
    focus.reset()
    doRender()
    await nextTick()
    rerender()
    scratch.childNodes[0].focus()
    await nextTick()
    expect(removeEventListenerSpy.called).toBeTruthy()
  })

  // it('should change/fix onchange event name', () => {
  //   const container = document.createElement('div')
  //   document.body.appendChild(container)
  //   const onchange = function () {}
  //   const proto = document.constructor.prototype
  //   const addEventListenerSpy = sinon.spy(proto, 'addEventListener')
  //   // const ondbclick = function () {}
  //   // const ontouchtap = function () {}
  //   class Outer extends Component {
  //     render () {
  //       return (
  //         <div>
  //           <input onChange={onchange} />
  //           <button />
  //         </div>
  //       )
  //     }
  //   }
  //   const app = <Outer />
  //   render(app, container)
  //   expect(addEventListenerSpy.called).toBe(true)
  // })

  it('should change/fix onDoubleClick/onTouchTap event name', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const proto = document.constructor.prototype
    const addEventListenerSpy = sinon.spy(proto, 'addEventListener')
    const ondbclick = function () {}
    const ontouchtap = function () {}
    class Outer extends Component {
      render () {
        return (
          <div>
            <button onDoubleClick={ondbclick} />
            <button onTouchTap={ontouchtap} />
          </div>
        )
      }
    }
    const app = <Outer />
    render(app, container)
    expect(addEventListenerSpy.called).toBe(true)
    expect(addEventListenerSpy.callCount).toBe(2)
  })
})
