/** @jsx createElement */
import { Component, createElement, render } from '../../src'
import { rerender } from '../../src/lib/render-queue'

import { getAttributes } from '../util'

describe('render()', function () {
  this.timeout(20000)
  let scratch

  before(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should create empty nodes (<* />)', () => {
    render(<div />, scratch)
    expect(scratch.childNodes).to.have.length(1)
    expect(scratch.childNodes[0]).to.have.deep.property('nodeName', 'DIV')
    scratch.innerHTML = ''

    render(<span />, scratch)
    expect(scratch.childNodes).to.have.length(1)
    expect(scratch.childNodes[0]).to.have.deep.property('nodeName', 'SPAN')

    scratch.innerHTML = ''

    render(<foo />, scratch)
    render(<x-bar />, scratch)
    expect(scratch.childNodes).to.have.length(2)
    expect(scratch.childNodes[0]).to.have.property('nodeName', 'FOO')
    expect(scratch.childNodes[1]).to.have.property('nodeName', 'X-BAR')
  })

  it('should nest empty nodes', () => {
    render((
      <div>
        <span />
        <foo />
        <x-bar />
      </div>
    ), scratch)

    expect(scratch.childNodes).to.have.length(1)
    expect(scratch.childNodes[0]).to.have.deep.property('nodeName', 'DIV')

    const c = scratch.childNodes[0].childNodes
    expect(c).to.have.length(3)
    expect(c[0]).to.have.deep.property('nodeName', 'SPAN')
    expect(c[1]).to.have.deep.property('nodeName', 'FOO')
    expect(c[2]).to.have.deep.property('nodeName', 'X-BAR')
  })

  it('should not render falsey values', () => {
    render((
      <div>
        {null},{undefined},{false},{0},{NaN}
      </div>
    ), scratch)

    expect(scratch.firstChild).to.have.property('innerHTML', ',,,0,NaN')
  })

  it('should not render null', () => {
    render(null, scratch)
    expect(scratch.innerHTML).to.equal('')
  })

  it('should not render undefined', () => {
    render(undefined, scratch)
    expect(scratch.innerHTML).to.equal('')
  })

  it('should not render boolean true', () => {
    render(true, scratch)
    expect(scratch.innerHTML).to.equal('')
  })

  it('should not render boolean false', () => {
    render(false, scratch)
    expect(scratch.innerHTML).to.equal('')
  })

  it('should render NaN as text content', () => {
    render(NaN, scratch)
    expect(scratch.innerHTML).to.equal('NaN')
  })

  it('should render numbers (0) as text content', () => {
    render(0, scratch)
    expect(scratch.innerHTML).to.equal('0')
  })

  it('should render numbers (42) as text content', () => {
    render(42, scratch)
    expect(scratch.innerHTML).to.equal('42')
  })

  it('should render strings as text content', () => {
    render('Testing, huh! How is it going?', scratch)
    expect(scratch.innerHTML).to.equal('Testing, huh! How is it going?')
  })

  it('should clear falsey attributes', () => {
    render((
      <div anull={null} aundefined={undefined} afalse={false} anan={NaN} a0={0} />
    ), scratch)

    expect(getAttributes(scratch.firstChild), 'from previous truthy values').to.eql({
      a0: '0',
      anan: 'NaN'
    })

    scratch.innerHTML = ''

    render((
      <div anull={null} aundefined={undefined} afalse={false} anan={NaN} a0={0} />
    ), scratch)

    expect(getAttributes(scratch.firstChild), 'initial render').to.eql({
      a0: '0',
      anan: 'NaN'
    })
  })

  it('should clear falsey input values', () => {
    const root = render((
      <div>
        <input value={0} />
        <input value={false} />
        <input value={null} />
        <input value={undefined} />
      </div>
    ), scratch)

    expect(root.children[0]).to.have.property('value', '0')
    expect(root.children[1]).to.have.property('value', 'false')
    expect(root.children[2]).to.have.property('value', '')
    expect(root.children[3]).to.have.property('value', '')
  })

  it('should clear falsey DOM properties', () => {
    function test (val) {
      scratch.innerHTML = ''
      render((
        <div>
          <input value={val} />
          <table border={val} />
        </div>
      ), scratch)
    }

    test('2')
    test(false)
    expect(scratch).to.have.property('innerHTML', '<div><input><table></table></div>', 'for false')

    test('3')
    test(null)
    expect(scratch).to.have.property('innerHTML', '<div><input><table></table></div>', 'for null')

    test('4')
    test(undefined)
    expect(scratch).to.have.property('innerHTML', '<div><input><table></table></div>', 'for undefined')
  })

  it('should apply string attributes', () => {
    render(<div foo='bar' data-foo='databar' />, scratch)

    const div = scratch.childNodes[0]
    expect(div).to.have.deep.property('attributes').to.have.lengthOf(2)

    expect(div).to.have.deep.nested.property('attributes[0].name', 'foo')
    expect(div).to.have.deep.nested.property('attributes[0].value', 'bar')

    expect(div).to.have.deep.nested.property('attributes[1].name', 'data-foo')
    expect(div).to.have.deep.nested.property('attributes[1].value', 'databar')
  })

  it('should not serialize function props as attributes', () => {
    render(<div click={function a () { }} ONCLICK={function b () { }} />, scratch)

    const div = scratch.childNodes[0]
    expect(div).to.have.deep.nested.property('attributes.length', 0)
  })

  it('should serialize object props as attributes', () => {
    render(<div foo={{ a: 'b' }} bar={{ toString () { return 'abc' } }} />, scratch)

    const div = scratch.childNodes[0]
    expect(div).to.have.nested.deep.property('attributes.length', 2)

    expect(div).to.have.nested.deep.property('attributes[0].name', 'foo')
    expect(div).to.have.nested.deep.property('attributes[0].value', '[object Object]')

    expect(div).to.have.nested.deep.property('attributes[1].name', 'bar')
    expect(div).to.have.nested.deep.property('attributes[1].value', 'abc')
  })

  it('should apply class as String', () => {
    render(<div class='foo' />, scratch)
    expect(scratch.childNodes[0]).to.have.property('className', 'foo')
  })

  it('should alias className to class', () => {
    render(<div className='bar' />, scratch)
    expect(scratch.childNodes[0]).to.have.property('className', 'bar')
  })

  it('should apply style as String', () => {
    render(<div style='top:5px; position:relative;' />, scratch)
    expect(scratch.childNodes[0]).to.have.nested.deep.property('style.cssText')
      .that.matches(/top\s*:\s*5px\s*/)
      .and.matches(/position\s*:\s*relative\s*/)
  })

  it('should only register on* functions as handlers', () => {
    const click = () => { }
    const onclick = () => { }

    let doRender = null

    const proto = document.constructor.prototype

    sinon.spy(proto, 'addEventListener')

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

    expect(scratch.childNodes[0]).to.have.nested.deep.property('attributes.length', 0)

    expect(proto.addEventListener).to.have.been.calledOnce
      .and.to.have.been.calledWithExactly('click', sinon.match.func, false)

    proto.addEventListener.restore()
    doRender()
    rerender()
  })

  it('should add and remove event handlers', () => {
    const click = sinon.spy()
    const mousedown = sinon.spy()

    let doRender = null

    const proto = document.constructor.prototype
    sinon.spy(proto, 'addEventListener')
    sinon.spy(proto, 'removeEventListener')

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

    expect(proto.addEventListener).to.have.been.calledTwice
      .and.to.have.been.calledWith('click')
      .and.calledWith('mousedown')

    fireEvent(scratch.childNodes[0], 'click')
    expect(click).to.have.been.calledOnce
      .and.calledWith(0)

    proto.addEventListener.reset()
    click.reset()
    doRender()
    rerender()

    expect(proto.addEventListener).not.to.have.been.called

    expect(proto.removeEventListener)
      .to.have.been.calledOnce
      .and.calledWith('mousedown')

    fireEvent(scratch.childNodes[0], 'click')
    expect(click).to.have.been.calledOnce
      .and.to.have.been.calledWith(1)

    fireEvent(scratch.childNodes[0], 'mousedown')
    expect(mousedown).not.to.have.been.called

    proto.removeEventListener.reset()
    click.reset()
    mousedown.reset()

    doRender()
    rerender()

    expect(proto.removeEventListener)
      .to.have.been.calledOnce
      .and.calledWith('click')

    fireEvent(scratch.childNodes[0], 'click')
    expect(click).not.to.have.been.called

    proto.addEventListener.restore()
    proto.removeEventListener.restore()
  })

  it('should serialize style objects', () => {
    let doRender1 = null
    let doRender2 = null
    class Outer extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          style: {
            color: 'rgb(255, 255, 255)',
            background: 'rgb(255, 100, 0)',
            backgroundPosition: '10px 10px',
            'background-size': 'cover',
            padding: 5,
            top: 100,
            left: '100%'
          }
        }
      }

      componentDidMount () {
        doRender1 = () => {
          this.setState({
            style: { color: 'rgb(0, 255, 255)' }
          })
        }
        doRender2 = () => {
          this.setState({
            style: 'display: inline;'
          })
        }
      }

      render () {
        return (
          <div style={this.state.style}>test</div>
        )
      }
    }
    render(<Outer />, scratch)

    const { style } = scratch.childNodes[0]
    expect(style).to.have.property('color').that.equals('rgb(255, 255, 255)')
    expect(style).to.have.property('background').that.contains('rgb(255, 100, 0)')
    expect(style).to.have.property('backgroundPosition').that.equals('10px 10px')
    expect(style).to.have.property('backgroundSize', 'cover')
    expect(style).to.have.property('padding', '5px')
    expect(style).to.have.property('top', '100px')
    expect(style).to.have.property('left', '100%')

    doRender1()
    rerender()

    expect(style).to.have.property('color').that.equals('rgb(0, 255, 255)')
    doRender2()
    rerender()

    expect(scratch.childNodes[0]).to.have.nested.deep.property('style.cssText').that.equals('display: inline;')
  })

  it('should support dangerouslySetInnerHTML', () => {
    const html = '<b>foo &amp; bar</b>'
    render(<div dangerouslySetInnerHTML={{ __html: html }} />, scratch)

    expect(scratch.firstChild, 'set').to.have.property('innerHTML', html)
    expect(scratch.innerHTML).to.equal('<div>' + html + '</div>')
    scratch.innerHTML = ''
    render(<div>a<strong>b</strong></div>, scratch)

    expect(scratch, 'unset').to.have.property('innerHTML', `<div>a<strong>b</strong></div>`)
    scratch.innerHTML = ''
    render(<div dangerouslySetInnerHTML={{ __html: html }} />, scratch)

    expect(scratch.innerHTML, 're-set').to.equal('<div>' + html + '</div>')
  })

  it('should apply proper mutation for VNodes with dangerouslySetInnerHTML attr', () => {
    class Thing extends Component {
      constructor (props, context) {
        super(props, context)
        this.state.html = this.props.html
      }
      render () {
        return this.state.html ? <div dangerouslySetInnerHTML={{ __html: this.state.html }} /> : <div />
      }
    }

    // let thing

    render(<Thing html='<b><i>test</i></b>' />, scratch)

    expect(scratch.innerHTML).to.equal('<div><b><i>test</i></b></div>')

    // thing.setState({ html: false })
    // thing.forceUpdate()

    // expect(scratch.innerHTML).to.equal('<div></div>')

    // thing.setState({ html: '<foo><bar>test</bar></foo>' })
    // thing.forceUpdate()

    // expect(scratch.innerHTML).to.equal('<div><foo><bar>test</bar></foo></div>')
  })

  it('should hydrate with dangerouslySetInnerHTML', () => {
    const html = '<b>foo &amp; bar</b>'
    render(<div dangerouslySetInnerHTML={{ __html: html }} />, scratch)
    expect(scratch.firstChild).to.have.property('innerHTML', '<b>foo &amp; bar</b>')
    expect(scratch.innerHTML).to.equal(`<div>${html}</div>`)
  })

  it('should reconcile mutated DOM attributes', () => {
    const check = p => {
      scratch.innerHTML = ''
      render(<input type='checkbox' checked={p} />, scratch)
    }
    const value = () => scratch.lastChild.checked
    const setValue = p => (scratch.lastChild.checked = p)
    check(true)
    expect(value()).to.equal(true)
    check(false)
    expect(value()).to.equal(false)
    check(true)
    expect(value()).to.equal(true)
    setValue(true)
    check(false)
    expect(value()).to.equal(false)
    setValue(false)
    check(true)
    expect(value()).to.equal(true)
  })

  it('should ignore props.children if children are manually specified', () => {
    expect(
      <div a children={['a', 'b']}>c</div>
    ).to.eql(
      <div a>c</div>
      )
  })

  it('should reorder child pairs', () => {
    class Outer extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          first: true
        }
      }

      render () {
        return (
          this.state.first ? (
            <div>
              <a>a</a>
              <b>b</b>
            </div>
          ) : (
            <div>
              <b>b</b>
              <a>a</a>
            </div>
          )
        )
      }
    }
    let outer
    render(<Outer ref={c => (outer = c)} />, scratch)

    const a = scratch.firstChild.firstChild
    const b = scratch.firstChild.lastChild

    expect(a).to.have.property('nodeName', 'A')
    expect(b).to.have.property('nodeName', 'B')

    outer.setState({
      first: false
    })
    outer.forceUpdate()
    expect(scratch.firstChild.firstChild).to.have.property('nodeName', 'B')
    expect(scratch.firstChild.lastChild).to.have.property('nodeName', 'A')
  })

  it('should skip non-nerv elements', () => {
    class Foo extends Component {
      render () {
        const alt = this.props.alt || this.state.alt || this.alt
        const c = [
          <a>foo</a>,
          <b>{alt ? 'alt' : 'bar'}</b>
        ]
        if (alt) c.reverse()
        return <div>{c}</div>
      }
    }

    let comp
    render(<Foo ref={c => (comp = c)} />, scratch)

    const c = document.createElement('c')
    c.textContent = 'baz'
    comp.dom.appendChild(c)

    const b = document.createElement('b')
    b.textContent = 'bat'
    comp.dom.appendChild(b)

    expect(scratch.firstChild.children, 'append').to.have.length(4)

    comp.forceUpdate()

    expect(scratch.firstChild.children, 'forceUpdate').to.have.length(4)
    expect(scratch.innerHTML, 'forceUpdate').to.equal(`<div><a>foo</a><b>bar</b><c>baz</c><b>bat</b></div>`)

    comp.alt = true
    comp.forceUpdate()

    expect(scratch.firstChild.children, 'forceUpdate alt').to.have.length(4)
    expect(scratch.innerHTML, 'forceUpdate alt').to.equal(`<div><b>alt</b><a>foo</a><c>baz</c><b>bat</b></div>`)

    comp.alt = false
    comp.forceUpdate()

    expect(scratch.firstChild.children, 'root re-render').to.have.length(4)
    expect(scratch.innerHTML, 'root re-render').to.equal(`<div><a>foo</a><b>bar</b><c>baz</c><b>bat</b></div>`)

    comp.alt = true
    comp.forceUpdate()

    expect(scratch.firstChild.children, 'root re-render 2').to.have.length(4)
    expect(scratch.innerHTML, 'root re-render 2').to.equal(`<div><b>alt</b><a>foo</a><c>baz</c><b>bat</b></div>`)
  })

  it('should not execute append operation when child is at last', (done) => {
    let input
    class TodoList extends Component {
      constructor (props) {
        super(props)
        this.state = { todos: [], text: '' }
        this.setText = this.setText.bind(this)
        this.addTodo = this.addTodo.bind(this)
      }
      setText (e) {
        this.setState({ text: e.target.value })
      }
      addTodo () {
        const { text } = this.state
        let { todos } = this.state
        todos = todos.concat({ text })
        this.setState({ todos, text: '' })
      }
      render () {
        const { todos, text } = this.state
        return (
          <div onKeyDown={this.addTodo}>
            {todos.map(todo => (<div>{todo.text}</div>))}
            <input value={text} onInput={this.setText} ref={i => (input = i)} />
          </div>
        )
      }
    }
    let todo
    render(<TodoList ref={c => (todo = c)} />, scratch)
    input.focus()
    input.value = 1
    todo.setText({
      target: input
    })
    todo.forceUpdate()
    todo.addTodo()
    expect(document.activeElement).to.equal(input)
    setTimeout(() => {
      expect(/1/.test(scratch.innerHTML)).to.equal(true)
      done()
    }, 10)
  })
})
