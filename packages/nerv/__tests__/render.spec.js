/** @jsx createElement */
import { Component, createElement, render, findDOMNode } from '../src'
import { rerender } from '../src/render-queue'
import { getAttributes, normalizeHTML, delay } from './util'

describe('render()', function () {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  it('should create empty nodes (<* />)', () => {
    render(<div />, scratch)
    expect(scratch.childNodes.length).toBe(1)
    expect(scratch.childNodes[0].nodeName).toBe('DIV')

    render(<span />, scratch)
    expect(scratch.childNodes.length).toBe(1)
    expect(scratch.childNodes[0].nodeName).toBe('SPAN')

    render(<foo />, scratch)
    render(<x-bar />, scratch)
    expect(scratch.childNodes.length).toBe(1)
    expect(scratch.childNodes[0].nodeName).toBe('X-BAR')
  })

  it('should nest empty nodes', () => {
    render(
      <div>
        <span />
        <foo />
        <x-bar />
      </div>,
      scratch
    )

    expect(scratch.childNodes.length).toBe(1)
    expect(scratch.childNodes[0].nodeName).toBe('DIV')

    const c = scratch.childNodes[0].childNodes
    expect(c.length).toBe(3)
    expect(c[0].nodeName).toBe('SPAN')
    expect(c[1].nodeName).toBe('FOO')
    expect(c[2].nodeName).toBe('X-BAR')
  })

  it('should not render falsey values', () => {
    render(
      <div>
        {null},{undefined},{false},{0},{NaN}
      </div>,
      scratch
    )

    expect(scratch.firstChild.innerHTML).toBe(',,,0,NaN')
  })

  it('should not render null', () => {
    render(null, scratch)
    expect(scratch.innerHTML).toEqual('')
  })

  it('should not render undefined', () => {
    render(undefined, scratch)
    expect(scratch.innerHTML).toEqual('')
  })

  it('should not render boolean true', () => {
    render(true, scratch)
    expect(scratch.innerHTML).toEqual('')
  })

  it('should not render boolean false', () => {
    render(false, scratch)
    expect(scratch.innerHTML).toEqual('')
  })

  it('should render NaN as text content', () => {
    render(NaN, scratch)
    expect(scratch.innerHTML).toEqual('NaN')
  })

  it('should render numbers (0) as text content', () => {
    render(0, scratch)
    expect(scratch.innerHTML).toEqual('0')
  })

  it('should render numbers (42) as text content', () => {
    render(42, scratch)
    expect(scratch.innerHTML).toEqual('42')
  })

  it('should render strings as text content', () => {
    render('Testing, huh! How is it going?', scratch)
    expect(scratch.innerHTML).toEqual('Testing, huh! How is it going?')
  })

  it('should clear falsey attributes', () => {
    render(
      <div
        anull={null}
        aundefined={undefined}
        afalse={false}
        anan={NaN}
        a0={0}
      />,
      scratch
    )

    expect(getAttributes(scratch.firstChild)).toEqual({
      a0: '0',
      anan: 'NaN'
    })

    render(
      <div
        anull={null}
        aundefined={undefined}
        afalse={false}
        anan={NaN}
        a0={0}
      />,
      scratch
    )

    expect(getAttributes(scratch.firstChild)).toEqual({
      a0: '0',
      anan: 'NaN'
    })
  })

  it('should clear falsey input values', () => {
    const root = render(
      <div>
        <input value={0} />
        <input value={false} />
        <input value={null} />
        <input value={undefined} />
      </div>,
      scratch
    )

    expect(root.children[0].value).toBe('0')
    // expect(root.children[1].value).toBe('false')
    expect(root.children[2].value).toBe('')
    expect(root.children[3].value).toBe('')
  })

  it('should clear falsey DOM properties', () => {
    function test (val) {
      render(
        <div>
          <table border={val} />
        </div>,
        scratch
      )
    }

    test('2')
    test(false)
    expect(scratch.innerHTML).toBe(normalizeHTML('<div><table></table></div>'))

    test('3')
    test(null)
    expect(scratch.innerHTML).toBe(normalizeHTML('<div><table></table></div>'))

    test('4')
    test(undefined)
    expect(scratch.innerHTML).toBe(normalizeHTML('<div><table></table></div>'))
  })

  it('should apply string attributes', () => {
    render(<div foo='bar' data-foo='databar' />, scratch)

    const div = scratch.childNodes[0]
    expect(div.attributes.length).toBe(2)

    expect(div.attributes[0].name).toBe('foo')
    expect(div.attributes[0].value).toBe('bar')

    expect(div.attributes[1].name).toBe('data-foo')
    expect(div.attributes[1].value).toBe('databar')
  })

  it('should not serialize function props as attributes', () => {
    render(<div click={function a () {}} ONCLICK={function b () {}} />, scratch)

    const div = scratch.childNodes[0]
    expect(div.attributes.length.toString()).toMatch(/[01]/) // 1 for ie8
  })

  it('should serialize object props as attributes', () => {
    render(
      <div
        foo={{ a: 'b' }}
        bar={{
          toString () {
            return 'abc'
          }
        }}
      />,
      scratch
    )

    const div = scratch.childNodes[0]
    expect(div.attributes[0].name).toBe('foo')
    expect(div.attributes[0].value).toBe('[object Object]')
    expect(div.attributes[1].name).toBe('bar')
    expect(div.attributes[1].value).toBe('abc')
  })

  it('should apply class as String', () => {
    render(<div class='foo' />, scratch)
    expect(scratch.childNodes[0].className).toBe('foo')
  })

  it('should alias className to class', () => {
    render(<div className='bar' />, scratch)
    expect(scratch.childNodes[0].className).toBe('bar')
  })

  it('should apply style as String', () => {
    render(<div style='top:5px; position:relative;' />, scratch)
    const cssText = scratch.childNodes[0].style.cssText
    expect(cssText).toMatch(/top\s*:\s*5px\s*/i)
    expect(cssText).toMatch(/position\s*:\s*relative\s*/i)
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
            // 'background-size': 'cover',
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
        return <div style={this.state.style}>test</div>
      }
    }
    render(<Outer />, scratch)

    const { style } = scratch.childNodes[0]
    expect(style.color).toMatch(/rgb\(255, 255, 255\)|rgb\(255,255,255\)/)
    expect(style.background).toMatch(/rgb\(255, 100, 0\)|rgb\(255,100,0\)/)
    expect(style.backgroundPosition).toBe('10px 10px')
    expect(style.padding).toBe('5px')
    expect(style.top).toBe('100px')
    expect(style.left).toBe('100%')

    doRender1()
    rerender()

    expect(style.color).toMatch(/rgb\(0, 255, 255\)|rgb\(0,255,255\)/)
    // expect(style).toHaveProperty('color')
    // expect(style.color).toBe('rgb(0, 255, 255)')
    doRender2()
    rerender()

    expect(scratch.childNodes[0].style.cssText).toContain('inline')

    // expect(scratch.childNodes[0]).to.have.nested.deep.property('style.cssText').that.equals('display: inline;')
  })

  it('should not set incorrect style value', () => {
    const div = <div style={{ width: undefined, height: NaN }} />
    render(div, scratch)
    const { style } = scratch.childNodes[0]
    expect(style.width).toBe('')
    expect(style.height).toBe('')
  })

  it('should support dangerouslySetInnerHTML', () => {
    const html = '<b>foo &amp; bar</b>'
    render(<div dangerouslySetInnerHTML={{ __html: html }} />, scratch)
    expect(scratch.firstChild.innerHTML).toEqual(normalizeHTML(html))
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>' + html + '</div>'))
    render(
      <div>
        a<strong>b</strong>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div>a<strong>b</strong></div>`)
    )
    render(<div dangerouslySetInnerHTML={{ __html: html }} />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>' + html + '</div>'))
  })

  // it('Should not dangerously set innerHTML when previous is same as new one', () => {
  //   render(<div />, scratch)
  //   expect(scratch.innerHTML).toEqual(innerHTML('<div></div>'))

  //   render(<div />, scratch)
  //   expect(scratch.innerHTML).toEqual(innerHTML('<div></div>'))

  //   render(<div dangerouslySetInnerHTML={{ __html: 'change' }} />, scratch)
  //   expect(scratch.innerHTML).toEqual(innerHTML('<div></div>'))
  // })

  it('should apply proper mutation for VNodes with dangerouslySetInnerHTML attr', () => {
    class Thing extends Component {
      constructor (props, context) {
        super(props, context)
        this.state.html = this.props.html
      }
      render () {
        return this.state.html ? (
          <div dangerouslySetInnerHTML={{ __html: this.state.html }} />
        ) : (
          <div />
        )
      }
    }

    // let thing

    render(<Thing html='<b><i>test</i></b>' />, scratch)

    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><b><i>test</i></b></div>')
    )

    // thing.setState({ html: false })
    // thing.forceUpdate()

    // expect(scratch.innerHTML).toEqual('<div></div>')

    // thing.setState({ html: '<foo><bar>test</bar></foo>' })
    // thing.forceUpdate()

    // expect(scratch.innerHTML).toEqual('<div><foo><bar>test</bar></foo></div>')
  })

  it('should hydrate with dangerouslySetInnerHTML', () => {
    const html = '<b>foo &amp; bar</b>'
    render(<div dangerouslySetInnerHTML={{ __html: html }} />, scratch)
    expect(scratch.firstChild.innerHTML).toEqual(
      normalizeHTML('<b>foo &amp; bar</b>')
    )
    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div>${html}</div>`))
  })

  it('should reconcile mutated DOM attributes', () => {
    const check = p => {
      render(<input type='checkbox' checked={p} />, scratch)
    }
    const value = () => scratch.lastChild.checked
    // const setValue = p => (scratch.lastChild.checked = p)
    check(true)
    expect(value()).toEqual(true)
    check(false)
    expect(value()).toEqual(false)
    check(true)
    expect(value()).toEqual(true)
    // setValue(true)
    check(false)
    expect(value()).toEqual(false)
    // setValue(false)
    check(true)
    expect(value()).toEqual(true)
  })

  it('should ignore props.children if children are manually specified', () => {
    expect(
      <div a children={['a', 'b']}>
        c
      </div>
    ).toEqual(<div a>c</div>)
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
        return this.state.first ? (
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
      }
    }
    let outer
    render(<Outer ref={c => (outer = c)} />, scratch)

    const a = scratch.firstChild.firstChild
    const b = scratch.firstChild.lastChild

    expect(a.nodeName).toEqual('A')
    expect(b.nodeName).toEqual('B')

    outer.setState({
      first: false
    })
    outer.forceUpdate()
    expect(scratch.firstChild.firstChild.nodeName).toEqual('B')
    expect(scratch.firstChild.lastChild.nodeName).toEqual('A')
  })

  it('should skip non-nerv elements', () => {
    class Foo extends Component {
      render () {
        const alt = this.props.alt || this.state.alt || this.alt
        const c = [<a>foo</a>, <b>{alt ? 'alt' : 'bar'}</b>]
        if (alt) c.reverse()
        return <div>{c}</div>
      }
    }

    let comp
    render(<Foo ref={c => (comp = c)} />, scratch)

    const c = document.createElement('c')
    c.textContent = 'baz'
    findDOMNode(comp).appendChild(c)

    const b = document.createElement('b')
    b.textContent = 'bat'
    findDOMNode(comp).appendChild(b)

    expect(scratch.firstChild.children.length).toBe(4)

    comp.forceUpdate()

    expect(scratch.firstChild.children.length).toBe(4)
    expect(normalizeHTML(scratch.innerHTML)).toEqual(
      normalizeHTML(`<div><a>foo</a><b>bar</b><c>baz</c><b>bat</b></div>`)
    )

    comp.alt = true
    comp.forceUpdate()

    expect(scratch.firstChild.children.length).toBe(4)
    expect(normalizeHTML(scratch.innerHTML)).toEqual(
      normalizeHTML(`<div><b>alt</b><a>foo</a><c>baz</c><b>bat</b></div>`)
    )

    comp.alt = false
    comp.forceUpdate()

    expect(scratch.firstChild.children.length).toBe(4)
    expect(normalizeHTML(scratch.innerHTML)).toEqual(
      normalizeHTML(`<div><a>foo</a><b>bar</b><c>baz</c><b>bat</b></div>`)
    )

    comp.alt = true
    comp.forceUpdate()

    expect(scratch.firstChild.children.length).toBe(4)
    expect(normalizeHTML(scratch.innerHTML)).toEqual(
      normalizeHTML(`<div><b>alt</b><a>foo</a><c>baz</c><b>bat</b></div>`)
    )
  })

  it('should not execute append operation when child is at last', async () => {
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
            {todos.map(todo => <div>{todo.text}</div>)}
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
    // IE8 activeElement would be document itself
    if (document.documentMode === 8) {
      return
    }
    expect(document.activeElement).toEqual(input)
    await delay(100)
    expect(/1/.test(scratch.innerHTML)).toEqual(true)
  })

  it('Should have correct value on initial render', () => {
    class TestInputRange extends Component {
      shouldComponentUpdate () {
        return false
      }

      render () {
        return <input name='test' defaultValue={260} />
      }
    }
    render(<TestInputRange />, scratch)

    expect(scratch.firstChild.value).toEqual('260')
  })

  it('should handle onDoubleClick and onTouchTap', () => {
    const C = () => <input onDoubleClick={null} onTouchTap={null} id='input' />
    render(<C />, scratch)
    const input = scratch.firstChild
    expect(input['ondblclick']).toBeFalsy()
    expect(input['onclick']).toBeFalsy()
  })
})
