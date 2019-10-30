/** @jsx createElement */
import { Component, createElement, render, Fragment } from '../src/index'
import { rerender } from '../src/render-queue'
import { span, div, ul, ol, li, section } from './util/dom'
import { normalizeHTML } from './util'

const isNode = !!(
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node
)

if (isNode) describe.skipKarma = describe

describe.skipKarma('fragments', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    ops = []
  })

  let ops = []

  class Stateful extends Component {
    componentDidUpdate () {
      ops.push('Update Stateful')
    }
    render () {
      return <div>Hello</div>
    }
  }

  it('should not render empty Fragment', () => {
    render(<Fragment />, scratch)
    expect(scratch.innerHTML).toEqual('')
  })

  it('should render a single child', () => {
    render(
      <Fragment>
        <span>foo</span>
      </Fragment>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML('<span>foo</span>'))
  })

  it('should render multiple children via noop renderer', () => {
    render(
      <Fragment>
        hello <span>world</span>
      </Fragment>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML('hello <span>world</span>'))
  })

  it('should not crash with null as last child', () => {
    const fn = () => {
      render(
        <Fragment>
          <span>world</span>
          {null}
        </Fragment>
        ,
        scratch
      )
    }
    expect(fn).not.toThrow()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<span>world</span>'))
    render(
      <Fragment>
        <span>world</span>
        <p>Hello</p>
      </Fragment>,
      scratch
    )
    expect(scratch.innerHTML).toEqual(normalizeHTML('<span>world</span><p>Hello</p>'))

    expect(fn).not.toThrow()
    expect(scratch.innerHTML).toEqual(normalizeHTML('<span>world</span>'))

    render(
      <Fragment>
        <span>world</span>
        {null}
        <span>world</span>
      </Fragment>,
      scratch
    )
    expect(scratch.innerHTML).toEqual(normalizeHTML('<span>world</span><span>world</span>'))

    render(
      <Fragment>
        <span>world</span>
        Hello
        <span>world</span>
      </Fragment>,
      scratch
    )
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<span>world</span>Hello<span>world</span>')
    )
  })

  it('should handle reordering components that return Fragments #1325', () => {
    class X extends Component {
      render () {
        return <Fragment>{this.props.children}</Fragment>
      }
    }

    class App extends Component {
      render (props) {
        if (this.props.i === 0) {
          return (
            <div>
              <X key={1}>1</X>
              <X key={2}>2</X>
            </div>
          )
        }
        return (
          <div>
            <X key={2}>2</X>
            <X key={1}>1</X>
          </div>
        )
      }
    }

    render(<App i={0} />, scratch)
    expect(scratch.textContent).toEqual('12')
    render(<App i={1} />, scratch)
    expect(scratch.textContent).toEqual('21')
  })

  it('should patch empty fragment', () => {
    class X extends Component {
      render () {
        return <Fragment>{this.props.children}</Fragment>
      }
    }

    render(<X />, scratch)
    expect(scratch.textContent).toEqual('')
    render(<div>21</div>, scratch)
    expect(scratch.textContent).toEqual('21')
    render(<Fragment />, scratch)
    expect(scratch.textContent).toEqual('')
  })

  it('should handle changing node type within a Component that returns a Fragment #1326', () => {
    class X extends Component {
      render () {
        return this.props.children
      }
    }

    /** @type {(newState: any) => void} */
    let setState
    class App extends Component {
      constructor (props, context) {
        super(props, context)

        this.state = { i: 0 }
        setState = this.setState.bind(this)
      }

      render () {
        if (this.state.i === 0) {
          return (
            <div>
              <X>
                <span>1</span>
              </X>
              <X>
                <span>2</span>
                <span>2</span>
              </X>
            </div>
          )
        }

        return (
          <div>
            <X>
              <div>1</div>
            </X>
            <X>
              <span>2</span>
              <span>2</span>
            </X>
          </div>
        )
      }
    }

    render(<App />, scratch)
    expect(scratch.innerHTML).toEqual(
      div([span(1), span(2), span(2)].join(''))
    )

    setState({ i: 1 })

    rerender()

    expect(scratch.innerHTML).toEqual(normalizeHTML(div([div(1), span(2), span(2)].join(''))))
  })

  it('should preserve state of children with 1 level nesting', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Stateful key='a' />
      ) : (
        <Fragment>
          <Stateful key='a' />
          <div key='b'>World</div>
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div><div>World</div>'))

    render(<Foo condition />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should preserve state between top-level fragments', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Fragment>
          <Stateful />
        </Fragment>
      ) : (
        <Fragment>
          <Stateful />
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)

    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual(['Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual(['Update Stateful', 'Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should preserve state of children nested at same level', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Fragment>
          <Stateful key='a' />
        </Fragment>
      ) : (
        <Fragment>
          <div />
          <Stateful key='a' />
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)

    render(<Foo condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML('<div></div><div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should not preserve state in non-top-level fragment nesting', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Fragment>
          <Fragment>
            <Stateful key='a' />
          </Fragment>
        </Fragment>
      ) : (
        <Fragment>
          <Stateful key='a' />
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)

    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should not preserve state of children if nested 2 levels without siblings', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Stateful key='a' />
      ) : (
        <Fragment>
          <Fragment>
            <Stateful key='a' />
          </Fragment>
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)

    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should just render children for fragments', () => {
    class Comp extends Component {
      render () {
        return (
          <Fragment>
            <div>Child1</div>
            <div>Child2</div>
          </Fragment>
        )
      }
    }

    render(<Comp />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Child1</div><div>Child2</div>'))
  })

  it.skip('should not preserve state of children if nested 2 levels with siblings', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Stateful key='a' />
      ) : (
        <Fragment>
          <Fragment>
            <Stateful key='a' />
          </Fragment>
          <div />
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div><div></div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should preserve state between array nested in fragment and fragment', () => {
    // In this test case, the children of the Fragment in Foo end up being the same when flatened.
    //
    // When condition == true, the children of the Fragment are a Stateful VNode.
    // When condition == false, the children of the Fragment are an Array containing a single
    // Stateful VNode.
    //
    // However, when each of these are flattened (in flattenChildren), they both become
    // an Array containing a single Stateful VNode. So when diff'ed they are compared together
    // and the state of Stateful is preserved

    function Foo ({ condition }) {
      return condition ? (
        <Fragment>
          <Stateful key='a' />
        </Fragment>
      ) : (
        <Fragment>{[<Stateful key='a' />]}</Fragment>
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    // expect(ops).toEqual(['Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    // expect(ops).toEqual(['Update Stateful', 'Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML(('<div>Hello</div>')))
  })

  it('should preserve state between top level fragment and array', () => {
    function Foo ({ condition }) {
      return condition ? (
        [<Stateful key='a' />]
      ) : (
        <Fragment>
          <Stateful key='a' />
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    // expect(ops).toEqual(['Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    // expect(ops).toEqual(['Update Stateful', 'Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should not preserve state between array nested in fragment and double nested fragment', () => {
    // In this test case, the children of the Fragment in Foo end up being the different when flatened.
    //
    // When condition == true, the children of the Fragment are an Array of Stateful VNode.
    // When condition == false, the children of the Fragment are another Fragment whose children are
    // a single Stateful VNode.
    //
    // When each of these are flattened (in flattenChildren), the first Fragment stays the same
    // (Fragment -> [Stateful]). The second Fragment also doesn't change (flatenning doesn't erase
    // Fragments) so it remains Fragment -> Fragment -> Stateful. Therefore when diff'ed these Fragments
    // separate the two Stateful VNodes into different trees and state is not preserved between them.

    function Foo ({ condition }) {
      return condition ? (
        <Fragment>{[<Stateful key='a' />]}</Fragment>
      ) : (
        <Fragment>
          <Fragment>
            <Stateful key='a' />
          </Fragment>
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it.skip('should not preserve state between array nested in fragment and double nested array', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Fragment>{[<Stateful key='a' />]}</Fragment>
      ) : (
        [[<Stateful key='a' />]]
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it.skip('should preserve state between double nested fragment and double nested array', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Fragment>
          <Fragment>
            <Stateful key='a' />
          </Fragment>
        </Fragment>
      ) : (
        [[<Stateful key='a' />]]
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual(['Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual(['Update Stateful', 'Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should not preserve state of children when the keys are different', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Fragment key='a'>
          <Stateful />
        </Fragment>
      ) : (
        <Fragment key='b'>
          <Stateful />
          <span>World</span>
        </Fragment>
      )
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div><span>World</span>'))
    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should not preserve state between unkeyed and keyed fragment', () => {
    function Foo ({ condition }) {
      return condition ? (
        <Fragment key='a'>
          <Stateful />
        </Fragment>
      ) : (
        <Fragment>
          <Stateful />
        </Fragment>
      )
    }

    // React & Preact: has the same behavior for components
    // https://codesandbox.io/s/57prmy5mx
    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<div>Hello</div>'))
  })

  it('should preserve state with reordering in multiple levels', () => {
    function Foo ({ condition }) {
      return condition ? (
        <div>
          <Fragment key='c'>
            <div>foo</div>
            <div key='b'>
              <Stateful key='a' />
            </div>
          </Fragment>
          <div>boop</div>
        </div>
      ) : (
        <div>
          <div>beep</div>
          <Fragment key='c'>
            <div key='b'>
              <Stateful key='a' />
            </div>
            <div>bar</div>
          </Fragment>
        </div>
      )
    }

    const htmlForTrue = div(
      [div('foo'), div(div('Hello')), div('boop')].join('')
    )

    const htmlForFalse = div(
      [div('beep'), div(div('Hello')), div('bar')].join('')
    )

    render(<Foo condition />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML(htmlForTrue))

    render(<Foo condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML(htmlForFalse))

    render(<Foo condition />, scratch)

    // expect(ops).toEqual(['Update Stateful', 'Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML(htmlForTrue))
  })

  it('should not preserve state when switching to a keyed fragment to an array', () => {
    function Foo ({ condition }) {
      return condition ? (
        <div>
          {
            <Fragment key='foo'>
              <span>1</span>
              <Stateful />
            </Fragment>
          }
          <span>2</span>
        </div>
      ) : (
        <div>
          {[<span>1</span>, <Stateful />]}
          <span>2</span>
        </div>
      )
    }

    const html = div([span('1'), div('Hello'), span('2')].join(''))

    render(<Foo condition />, scratch)

    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML(html))

    render(<Foo condition />, scratch)

    expect(ops).toEqual([])
    expect(scratch.innerHTML).toEqual(normalizeHTML(html))
  })

  it('should preserve state when it does not change positions', () => {
    function Foo ({ condition }) {
      return condition
        ? [
          <span />,
          <Fragment>
            <Stateful />
          </Fragment>
        ]
        : [
          <span />,
          <Fragment>
            <Stateful />
          </Fragment>
        ]
    }

    render(<Foo condition />, scratch)
    render(<Foo condition={false} />, scratch)

    expect(ops).toEqual(['Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<span></span><div>Hello</div>'))

    render(<Foo condition />, scratch)

    expect(ops).toEqual(['Update Stateful', 'Update Stateful'])
    expect(scratch.innerHTML).toEqual(normalizeHTML('<span></span><div>Hello</div>'))
  })

  it('should render nested Fragments', () => {
    render(
      <Fragment>
        spam
        <Fragment>foo</Fragment>
        <Fragment />
        bar
      </Fragment>,
      scratch
    )

    expect(scratch.innerHTML).toEqual('spamfoobar')

    render(
      <Fragment>
        <Fragment>foo</Fragment>
        <Fragment>bar</Fragment>
      </Fragment>,
      scratch
    )

    expect(scratch.innerHTML).toEqual('foobar')
  })

  it('should render nested Fragments with siblings', () => {
    render(
      <div>
        <div>0</div>
        <div>1</div>
        <Fragment>
          <Fragment>
            <div>2</div>
            <div>3</div>
          </Fragment>
        </Fragment>
        <div>4</div>
        <div>5</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(div([div(0), div(1), div(2), div(3), div(4), div(5)].join('')))
    )
  })

  it('should respect keyed Fragments', () => {
    /** @type {() => void} */
    let update

    class Comp extends Component {
      constructor () {
        super()
        this.state = { key: 'foo' }
        update = () => this.setState({ key: 'bar' })
      }

      render () {
        return <Fragment key={this.state.key}>foo</Fragment>
      }
    }
    render(<Comp />, scratch)
    expect(scratch.innerHTML).toEqual('foo')

    update()
    rerender()

    expect(scratch.innerHTML).toEqual('foo')
  })

  it('should support conditionally rendered children', () => {
    /** @type {() => void} */
    let update

    class Comp extends Component {
      constructor () {
        super()
        this.state = { value: true }
        update = () => this.setState({ value: !this.state.value })
      }

      render () {
        return (
          <Fragment>
            <span>0</span>
            {this.state.value && 'foo'}
            <span>1</span>
          </Fragment>
        )
      }
    }

    const html = contents => span('0') + contents + span('1')

    render(<Comp />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(html('foo')))

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(normalizeHTML(html('')))

    update()
    rerender()
    expect(scratch.innerHTML).toEqual(normalizeHTML(html('foo')))
  })

  it('can modify the children of a Fragment', () => {
    /** @type {() => void} */
    let push

    class List extends Component {
      constructor () {
        super()
        this.state = { values: [0, 1, 2] }
        push = () =>
          this.setState({
            values: [...this.state.values, this.state.values.length]
          })
      }

      render () {
        return (
          <Fragment>
            {this.state.values.map(value => (
              <div>{value}</div>
            ))}
          </Fragment>
        )
      }
    }

    render(<List />, scratch)
    expect(scratch.textContent).toEqual('012')

    push()
    rerender()

    expect(scratch.textContent).toEqual('0123')

    push()
    rerender()

    expect(scratch.textContent).toEqual('01234')
  })

  it('should render sibling array children', () => {
    const Group = ({ title, values }) => (
      <Fragment>
        <li>{title}</li>
        {values.map(value => (
          <li>{value}</li>
        ))}
      </Fragment>
    )

    const Todo = () => (
      <ul>
        <Group title={'A header'} values={['a', 'b']} />
        <Group title={'A divider'} values={['c', 'd']} />
        <li>A footer</li>
      </ul>
    )

    render(<Todo />, scratch)

    expect(scratch.innerHTML).toEqual(
      ul(
        [
          li('A header'),
          li('a'),
          li('b'),
          li('A divider'),
          li('c'),
          li('d'),
          li('A footer')
        ].join('')
      )
    )
  })

  it('should reorder Fragment children', () => {
    let updateState

    class App extends Component {
      constructor () {
        super()
        this.state = { active: false }
        updateState = () => this.setState(prev => ({ active: !prev.active }))
      }

      render () {
        return (
          <div>
            <h1>Heading</h1>
            {!this.state.active ? (
              <Fragment>
                foobar
                <Fragment>
                  Hello World
                  <h2>yo</h2>
                </Fragment>
                <input type='text' />
              </Fragment>
            ) : (
              <Fragment>
                <Fragment>
                  Hello World
                  <h2>yo</h2>
                </Fragment>
                foobar
                <input type='text' />
              </Fragment>
            )}
          </div>
        )
      }
    }

    render(<App />, scratch)

    expect(scratch.innerHTML).toEqual(
      '<div><h1>Heading</h1>foobarHello World<h2>yo</h2><input type="text"></div>'
    )

    updateState()

    // See "should preserve state between top level fragment and array"
    // Perhaps rename test to "should reorder **keyed** Fragment children"

    rerender()
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><h1>Heading</h1>Hello World<h2>yo</h2>foobar<input type="text"></div>')
    )
  })

  it('should render sibling fragments with multiple children in the correct order', () => {
    render(
      <ol>
        <li>0</li>
        <Fragment>
          <li>1</li>
          <li>2</li>
        </Fragment>
        <li>3</li>
        <li>4</li>
        <Fragment>
          <li>5</li>
          <li>6</li>
        </Fragment>
        <li>7</li>
      </ol>,
      scratch
    )

    expect(scratch.textContent).toEqual('01234567')
  })

  it('should support HOCs that return children', () => {
    const text =
      "Don't forget to tell these special people in your life just how special they are to you."

    class BobRossProvider extends Component {
      getChildContext () {
        return { text }
      }

      render () {
        return this.props.children
      }
    }

    function BobRossConsumer (props, context) {
      return props.children(context.text)
    }

    const Say = props => <div>{props.text}</div>

    const Speak = () => (
      <Fragment>
        <span>the top</span>
        <BobRossProvider>
          <span>a span</span>
          <BobRossConsumer>
            {text => [<Say text={text} />, <Say text={text} />]}
          </BobRossConsumer>
          <span>another span</span>
        </BobRossProvider>
        <span>a final span</span>
      </Fragment>
    )

    render(<Speak />, scratch)

    expect(scratch.innerHTML).toEqual(
      normalizeHTML([
        span('the top'),
        span('a span'),
        div(text),
        div(text),
        span('another span'),
        span('a final span')
      ].join(''))
    )
  })

  it('should support conditionally rendered Fragment', () => {
    const Foo = ({ condition }) => (
      <ol>
        <li>0</li>
        {condition ? (
          <Fragment>
            <li>1</li>
            <li>2</li>
          </Fragment>
        ) : (
          [<li>1</li>, <li>2</li>]
        )}
        <li>3</li>
      </ol>
    )

    const html = ol([li('0'), li('1'), li('2'), li('3')].join(''))

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(html), 'initial render of true')
    render(<Foo condition={false} />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(html), 'rendering from true to false')

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(html), 'rendering from false to true')
  })

  it('should support conditionally rendered Fragment or null', () => {
    const Foo = ({ condition }) => (
      <ol>
        <li>0</li>
        {condition ? (
          <Fragment>
            <li>1</li>
            <li>2</li>
          </Fragment>
        ) : null}
        <li>3</li>
        <li>4</li>
      </ol>
    )

    const htmlForTrue = ol(
      [li('0'), li('1'), li('2'), li('3'), li('4')].join('')
    )

    const htmlForFalse = ol([li('0'), li('3'), li('4')].join(''))

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(htmlForTrue), 'initial render of true')

    render(<Foo condition={false} />, scratch)
    expect(scratch.innerHTML).toEqual(
      normalizeHTML(htmlForFalse),
      'rendering from true to false'
    )

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(
      normalizeHTML(htmlForTrue),
      'rendering from false to true'
    )
  })

  it('should support moving Fragments between beginning and end', () => {
    const Foo = ({ condition }) => (
      <ol>
        {condition
          ? [
            <li>0</li>,
            <li>1</li>,
            <li>2</li>,
            <li>3</li>,
            <Fragment>
              <li>4</li>
              <li>5</li>
            </Fragment>
          ]
          : [
            <Fragment>
              <li>4</li>
              <li>5</li>
            </Fragment>,
            <li>0</li>,
            <li>1</li>,
            <li>2</li>,
            <li>3</li>
          ]}
      </ol>
    )

    const htmlForTrue = normalizeHTML(ol(
      [li('0'), li('1'), li('2'), li('3'), li('4'), li('5')].join('')
    ))

    const htmlForFalse = normalizeHTML(ol(
      [li('4'), li('5'), li('0'), li('1'), li('2'), li('3')].join('')
    ))

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(htmlForTrue, 'initial render of true')

    render(<Foo condition={false} />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForFalse,
      'rendering from true to false'
    )
    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForTrue,
      'rendering from false to true'
    )
  })

  it('should support conditional beginning and end Fragments', () => {
    const Foo = ({ condition }) => (
      <ol>
        {condition ? (
          <Fragment>
            <li>0</li>
            <li>1</li>
          </Fragment>
        ) : null}
        <li>2</li>
        <li>2</li>
        {condition ? null : (
          <Fragment>
            <li>3</li>
            <li>4</li>
          </Fragment>
        )}
      </ol>
    )

    const htmlForTrue = normalizeHTML(ol([li(0), li(1), li(2), li(2)].join('')))

    const htmlForFalse = normalizeHTML(ol([li(2), li(2), li(3), li(4)].join('')))

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(htmlForTrue, 'initial render of true')

    render(<Foo condition={false} />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForFalse,
      'rendering from true to false'
    )
    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForTrue,
      'rendering from false to true'
    )
  })

  it('should support nested conditional beginning and end Fragments', () => {
    const Foo = ({ condition }) => (
      <ol>
        {condition ? (
          <Fragment>
            <Fragment>
              <Fragment>
                <li>0</li>
                <li>1</li>
              </Fragment>
            </Fragment>
          </Fragment>
        ) : null}
        <li>2</li>
        <li>3</li>
        {condition ? null : (
          <Fragment>
            <Fragment>
              <Fragment>
                <li>4</li>
                <li>5</li>
              </Fragment>
            </Fragment>
          </Fragment>
        )}
      </ol>
    )

    const htmlForTrue = normalizeHTML(ol([li(0), li(1), li(2), li(3)].join('')))

    const htmlForFalse = normalizeHTML(ol([li(2), li(3), li(4), li(5)].join('')))

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(htmlForTrue, 'initial render of true')

    render(<Foo condition={false} />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForFalse,
      'rendering from true to false'
    )

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForTrue,
      'rendering from false to true'
    )
  })

  it('should preserve state with reordering in multiple levels with mixed # of Fragment siblings', () => {
    // Also fails if the # of divs outside the Fragment equals or exceeds
    // the # inside the Fragment for both conditions
    function Foo ({ condition }) {
      return condition ? (
        <div>
          <Fragment key='c'>
            <div>foo</div>
            <div key='b'>
              <Stateful key='a' />
            </div>
          </Fragment>
          <div>boop</div>
          <div>boop</div>
        </div>
      ) : (
        <div>
          <div>beep</div>
          <Fragment key='c'>
            <div key='b'>
              <Stateful key='a' />
            </div>
            <div>bar</div>
          </Fragment>
        </div>
      )
    }

    const htmlForTrue = normalizeHTML(div(
      [div('foo'), div(div('Hello')), div('boop'), div('boop')].join('')
    ))

    const htmlForFalse = normalizeHTML(div(
      [div('beep'), div(div('Hello')), div('bar')].join('')
    ))

    render(<Foo condition />, scratch)

    expect(scratch.innerHTML).toEqual(
      htmlForTrue,
      'rendering from false to true'
    )

    render(<Foo condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(
      htmlForFalse,
      'rendering from true to false'
    )

    render(<Foo condition />, scratch)

    expect(scratch.innerHTML).toEqual(
      htmlForTrue,
      'rendering from false to true'
    )
  })

  it('should preserve state with reordering in multiple levels with lots of Fragment siblings', () => {
    // Also fails if the # of divs outside the Fragment equals or exceeds
    // the # inside the Fragment for both conditions
    function Foo ({ condition }) {
      return condition ? (
        <div>
          <Fragment key='c'>
            <div>foo</div>
            <div key='b'>
              <Stateful key='a' />
            </div>
          </Fragment>
          <div>boop</div>
          <div>boop</div>
          <div>boop</div>
        </div>
      ) : (
        <div>
          <div>beep</div>
          <div>beep</div>
          <div>beep</div>
          <Fragment key='c'>
            <div key='b'>
              <Stateful key='a' />
            </div>
            <div>bar</div>
          </Fragment>
        </div>
      )
    }

    const htmlForTrue = normalizeHTML(div(
      [
        div('foo'),
        div(div('Hello')),
        div('boop'),
        div('boop'),
        div('boop')
      ].join('')
    ))

    const htmlForFalse = normalizeHTML(div(
      [
        div('beep'),
        div('beep'),
        div('beep'),
        div(div('Hello')),
        div('bar')
      ].join('')
    ))

    render(<Foo condition />, scratch)

    render(<Foo condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(
      htmlForFalse,
      'rendering from true to false'
    )

    render(<Foo condition />, scratch)

    // expect(ops).toEqual(['Update Stateful', 'Update Stateful'])
    expect(scratch.innerHTML).toEqual(
      htmlForTrue,
      'rendering from false to true'
    )
  })

  it('should correctly append children with siblings', () => {
    /**
     * @type {(props: { values: Array<string | number>}) => JSX.Element}
     */
    const Foo = ({ values }) => (
      <ol>
        <li>a</li>
        <Fragment>
          {values.map(value => (
            <li>{value}</li>
          ))}
        </Fragment>
        <li>b</li>
      </ol>
    )

    const getHtml = values =>
      normalizeHTML(ol([li('a'), ...values.map(value => li(value)), li('b')].join('')))

    const values = [0, 1, 2]
    render(<Foo values={values} />, scratch)
    expect(scratch.innerHTML).toEqual(
      getHtml(values),
      `original list: [${values.join(',')}]`
    )

    values.push(3)
    render(<Foo values={values} />, scratch)
    expect(scratch.innerHTML).toEqual(
      getHtml(values),
      `push 3: [${values.join(',')}]`
    )

    values.push(4)

    render(<Foo values={values} />, scratch)
    expect(scratch.innerHTML).toEqual(
      getHtml(values),
      `push 4: [${values.join(',')}]`
    )
  })

  it('should render components that conditionally return Fragments', () => {
    const Foo = ({ condition }) =>
      condition ? (
        <Fragment>
          <div>1</div>
          <div>2</div>
        </Fragment>
      ) : (
        <div>
          <div>3</div>
          <div>4</div>
        </div>
      )

    const htmlForTrue = normalizeHTML([div(1), div(2)].join(''))

    const htmlForFalse = normalizeHTML(div([div(3), div(4)].join('')))

    render(<Foo condition />, scratch)

    expect(scratch.innerHTML).toEqual(htmlForTrue)

    render(<Foo condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(htmlForFalse)

    render(<Foo condition />, scratch)

    expect(scratch.innerHTML).toEqual(htmlForTrue)
  })

  it('should clear empty Fragments', () => {
    function Foo (props) {
      if (props.condition) {
        return <Fragment>foo</Fragment>
      }
      return <Fragment />
    }

    render(<Foo condition />, scratch)
    expect(scratch.textContent).toEqual('foo')

    render(<Foo condition={false} />, scratch)
    expect(scratch.textContent).toEqual('')
  })

  it('should support conditionally rendered nested Fragments or null with siblings', () => {
    const Foo = ({ condition }) => (
      <ol>
        <li>0</li>
        <Fragment>
          <li>1</li>
          {condition ? (
            <Fragment>
              <li>2</li>
              <li>3</li>
            </Fragment>
          ) : null}
          <li>4</li>
        </Fragment>
        <li>5</li>
      </ol>
    )

    const htmlForTrue = normalizeHTML(ol(
      [li('0'), li('1'), li('2'), li('3'), li('4'), li('5')].join('')
    ))

    const htmlForFalse = normalizeHTML(ol([li('0'), li('1'), li('4'), li('5')].join('')))

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(htmlForTrue, 'initial render of true')

    render(<Foo condition={false} />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForFalse,
      'rendering from true to false'
    )

    render(<Foo condition />, scratch)
    expect(scratch.innerHTML).toEqual(
      htmlForTrue,
      'rendering from false to true'
    )
  })

  it('should render first child Fragment that wrap null components', () => {
    const Empty = () => null
    const Foo = () => (
      <ol>
        <Fragment>
          <Empty />
        </Fragment>
        <li>1</li>
      </ol>
    )

    render(<Foo />, scratch)
    expect(scratch.innerHTML).toEqual(normalizeHTML(ol([li(1)].join(''))))
  })

  it('should properly render Components that return Fragments and use shouldComponentUpdate #1415', () => {
    class SubList extends Component {
      shouldComponentUpdate (nextProps) {
        return nextProps.prop1 !== this.props.prop1
      }
      render () {
        return (
          <Fragment>
            <div>2</div>
            <div>3</div>
          </Fragment>
        )
      }
    }

    /** @type {(update: any) => void} */
    let setState
    class App extends Component {
      constructor () {
        super()
        setState = update => this.setState(update)

        this.state = { error: false }
      }

      render () {
        return (
          <div>
            {this.state.error ? (
              <div>Error!</div>
            ) : (
              <div>
                <div>1</div>
                <SubList prop1={this.state.error} />
              </div>
            )}
          </div>
        )
      }
    }

    const successHtml = normalizeHTML(div(div([div(1), div(2), div(3)].join(''))))

    const errorHtml = normalizeHTML(div(div('Error!')))

    render(<App />, scratch)
    expect(scratch.innerHTML).toEqual(successHtml)

    setState({}) // Trigger sCU
    rerender()
    expect(scratch.innerHTML).toEqual(successHtml)

    setState({ error: true })

    rerender()
    expect(scratch.innerHTML).toEqual(errorHtml)

    setState({ error: false })
    rerender()
    expect(scratch.innerHTML).toEqual(successHtml)

    setState({}) // Trigger sCU again
    rerender()
    expect(scratch.innerHTML).toEqual(successHtml)
  })

  it('should use the last dom node for _lastDomChild', () => {
    const Noop = () => null
    let update
    class App extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ items: ['A', 'B', 'C'] })
        this.state = {
          items: null
        }
      }

      render () {
        return (
          <div>
            {this.state.items && (
              <Fragment>
                {this.state.items.map(v => (
                  <div>{v}</div>
                ))}
                <Noop />
              </Fragment>
            )}
          </div>
        )
      }
    }

    render(<App />, scratch)
    expect(scratch.textContent).toEqual('')

    update()
    rerender()

    expect(scratch.textContent).toEqual('ABC')
  })

  it('should replace node in-between children', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? <section>B2</section> : <div>B1</div>
      }
    }

    render(
      <div>
        <div>A</div>
        <SetState />
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B1</div><div>C</div></div>`)
    )

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><section>B2</section><div>C</div></div>`)
    )
  })

  it('should replace Fragment in-between children', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? (
          <Fragment>
            <section>B3</section>
            <section>B4</section>
          </Fragment>
        ) : (
          <Fragment>
            <div>B1</div>
            <div>B2</div>
          </Fragment>
        )
      }
    }

    render(
      <div>
        <div>A</div>
        <SetState />
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(div([div('A'), div('B1'), div('B2'), div('C')].join('')))
    )

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(div([div('A'), section('B3'), section('B4'), div('C')].join('')))
    )
  })

  it('should insert in-between children', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? <div>B</div> : null
      }
    }

    render(
      <div>
        <div>A</div>
        <SetState />
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><div>A</div><div>C</div></div>`))

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B</div><div>C</div></div>`)
    )
  })

  it('should insert in-between Fragments', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? [<div>B1</div>, <div>B2</div>] : null
      }
    }

    render(
      <div>
        <div>A</div>
        <SetState />
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><div>A</div><div>C</div></div>`))

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B1</div><div>B2</div><div>C</div></div>`)
    )
  })

  it('should insert in-between null children', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? <div>B</div> : null
      }
    }

    render(
      <div>
        <div>A</div>
        {null}
        <SetState />
        {null}
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><div>A</div><div>C</div></div>`))

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B</div><div>C</div></div>`)
    )
  })

  it('should insert Fragment in-between null children', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? (
          <Fragment>
            <div>B1</div>
            <div>B2</div>
          </Fragment>
        ) : null
      }
    }

    render(
      <div>
        <div>A</div>
        {null}
        <SetState />
        {null}
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><div>A</div><div>C</div></div>`))

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B1</div><div>B2</div><div>C</div></div>`)
    )
  })

  it('should insert in-between nested null children', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? <div>B</div> : null
      }
    }

    function Outer () {
      return <SetState />
    }

    render(
      <div>
        <div>A</div>
        {null}
        <Outer />
        {null}
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><div>A</div><div>C</div></div>`))

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B</div><div>C</div></div>`)
    )
  })

  it('should insert Fragment in-between nested null children', () => {
    let update
    class SetState extends Component {
      constructor (props) {
        super(props)
        update = () => this.setState({ active: true })
      }

      render () {
        return this.state.active ? (
          <Fragment>
            <div>B1</div>
            <div>B2</div>
          </Fragment>
        ) : null
      }
    }

    function Outer () {
      return <SetState />
    }

    render(
      <div>
        <div>A</div>
        {null}
        <Outer />
        {null}
        <div>C</div>
      </div>,
      scratch
    )

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><div>A</div><div>C</div></div>`))

    update()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B1</div><div>B2</div><div>C</div></div>`)
    )
  })

  it('should update at correct place', () => {
    let updateA
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { active: true }
        updateA = () => this.setState(prev => ({ active: !prev.active }))
      }

      render () {
        return this.state.active ? <div>A</div> : <span>A2</span>
      }
    }

    function B () {
      return <div>B</div>
    }

    function X (props) {
      return props.children
    }

    function App (props) {
      const b = props.condition ? <B /> : null
      return (
        <div>
          <X>
            <A />
          </X>
          <X>
            {b}
            <div>C</div>
          </X>
        </div>
      )
    }

    render(<App condition />, scratch)

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A</div><div>B</div><div>C</div></div>`)
    )

    render(<App condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><div>A</div><div>C</div></div>`))

    updateA()
    rerender()

    expect(scratch.innerHTML).toEqual(normalizeHTML(`<div><span>A2</span><div>C</div></div>`))
  })

  it('should update Fragment at correct place', () => {
    let updateA
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { active: true }
        updateA = () => this.setState(prev => ({ active: !prev.active }))
      }

      render () {
        return this.state.active
          ? [<div>A1</div>, <div>A2</div>]
          : [<span>A3</span>, <span>A4</span>]
      }
    }

    function B () {
      return <div>B</div>
    }

    function X (props) {
      return props.children
    }

    function App (props) {
      const b = props.condition ? <B /> : null
      return (
        <div>
          <X>
            <A />
          </X>
          <X>
            {b}
            <div>C</div>
          </X>
        </div>
      )
    }

    render(<App condition />, scratch)

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A1</div><div>A2</div><div>B</div><div>C</div></div>`)
    )

    render(<App condition={false} />, scratch)

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><div>A1</div><div>A2</div><div>C</div></div>`)
    )

    updateA()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(`<div><span>A3</span><span>A4</span><div>C</div></div>`)
    )
  })

  it('should insert children correctly if sibling component DOM changes', () => {
    /** @type {() => void} */
    let updateA
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { active: true }
        updateA = () => this.setState(prev => ({ active: !prev.active }))
      }

      render () {
        return this.state.active ? <div>A</div> : <span>A2</span>
      }
    }

    /** @type {() => void} */
    let updateB
    class B extends Component {
      constructor (props) {
        super(props)
        this.state = { active: false }
        updateB = () => this.setState(prev => ({ active: !prev.active }))
      }
      render () {
        return this.state.active ? <div>B</div> : null
      }
    }

    function X (props) {
      return props.children
    }

    function App () {
      return (
        <div>
          <X>
            <A />
          </X>
          <X>
            <B />
            <div>C</div>
          </X>
        </div>
      )
    }

    render(<App />, scratch)

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(div([div('A'), div('C')].join(''))),
      'initial'
    )

    updateB()
    rerender()

    expect(scratch.innerHTML).toEqual(
      normalizeHTML(div([div('A'), div('B'), div('C')].join(''))),
      'updateB'
    )
    updateA()
    rerender()

    expect(scratch.innerHTML).toEqual(
      div([span('A2'), div('B'), div('C')].join('')),
      'updateA'
    )
  })

  it('should correctly append children if last child changes DOM', () => {
    /** @type {() => void} */
    let updateA
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { active: true }
        updateA = () => this.setState(prev => ({ active: !prev.active }))
      }

      render () {
        return this.state.active
          ? [<div>A1</div>, <div>A2</div>]
          : [<span>A3</span>, <span>A4</span>]
      }
    }

    /** @type {() => void} */
    let updateB
    class B extends Component {
      constructor (props) {
        super(props)
        this.state = { active: false }
        updateB = () => this.setState(prev => ({ active: !prev.active }))
      }
      render () {
        return (
          <Fragment>
            <A />
            {this.state.active ? <div>B</div> : null}
          </Fragment>
        )
      }
    }

    render(<B />, scratch)

    expect(scratch.innerHTML).toEqual([div('A1'), div('A2')].join(''), 'initial')

    updateA()
    rerender()

    expect(scratch.innerHTML).toEqual(
      [span('A3'), span('A4')].join(''),
      'updateA'
    )

    updateB()

    rerender()

    expect(scratch.innerHTML).toEqual(
      [span('A3'), span('A4'), div('B')].join(''),
      'updateB'
    )
  })

  it('should correctly append children #0', () => {
    let inst
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { arr: ['a', 'b', 'c'] }
        inst = this
      }

      render () {
        const { arr } = this.state
        return <main>
          <span>test</span>
          {
            arr.length ? arr.map(a => <li key={a}>{a}</li>) : null
          }
        </main>
      }
    }

    render(<A />, scratch)
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<main><span>test</span><li>a</li><li>b</li><li>c</li></main>`)
    )
    inst.setState({
      arr: []
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<main><span>test</span></main>`)
    )
  })

  it('should correctly append children #1', () => {
    let inst
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { arr: ['a', 'b', 'c'] }
        inst = this
      }

      render () {
        const { arr } = this.state
        return <Fragment>
          <span>test</span>
          {
            arr.length ? arr.map(a => <li key={a}>{a}</li>) : null
          }
        </Fragment>
      }
    }

    render(<A />, scratch)
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<span>test</span><li>a</li><li>b</li><li>c</li>`)
    )
    inst.setState({
      arr: []
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<span>test</span>`)
    )
  })

  it('should correctly append children #2', () => {
    let inst
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { arr: ['a', 'b', 'c'] }
        inst = this
      }

      render () {
        const { arr } = this.state
        return <Fragment>
          <span>test</span>
          {
            arr.length ? arr.map(a => <li key={a}>{a}</li>) : null
          }
          <span>test2</span>
        </Fragment>
      }
    }

    render(<A />, scratch)
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<span>test</span><li>a</li><li>b</li><li>c</li><span>test2</span>`)
    )
    inst.setState({
      arr: []
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<span>test</span><span>test2</span>`)
    )
  })

  it('should correctly append children #3', () => {
    let inst
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { arr: ['a', 'b', 'c'] }
        inst = this
      }

      render () {
        const { arr } = this.state
        return <main>
          <span>test</span>
          {
            arr.length ? arr.map(a => <li key={a}>{a}</li>) : null
          }
          <span>test2</span>
        </main>
      }
    }

    render(<A />, scratch)
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<main><span>test</span><li>a</li><li>b</li><li>c</li><span>test2</span></main>`)
    )
    inst.setState({
      arr: []
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<main><span>test</span><span>test2</span></main>`)
    )
  })

  it('should correctly append children #4', () => {
    let inst
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { arr: ['a', 'b', 'c'] }
        inst = this
      }

      render () {
        const { arr } = this.state
        return <Fragment>
          {
            arr.length ? arr.map(a => <li key={a}>{a}</li>) : null
          }
          <span>test2</span>
        </Fragment>
      }
    }

    render(<A />, scratch)
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<li>a</li><li>b</li><li>c</li><span>test2</span>`)
    )
    inst.setState({
      arr: []
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<span>test2</span>`)
    )
  })

  it('should correctly append children #5', () => {
    let inst
    class A extends Component {
      constructor (props) {
        super(props)
        this.state = { arr: ['a', 'b', 'c'] }
        inst = this
      }

      render () {
        const { arr } = this.state
        return <main>
          {
            arr.length ? arr.map(a => <li key={a}>{a}</li>) : null
          }
          <span>test2</span>
        </main>
      }
    }

    render(<A />, scratch)
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<main><li>a</li><li>b</li><li>c</li><span>test2</span></main>`)
    )
    inst.setState({
      arr: []
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toBe(
      normalizeHTML(`<main><span>test2</span></main>`)
    )
  })
})
