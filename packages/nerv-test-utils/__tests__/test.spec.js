import React from 'nervjs'
import { renderToString } from 'nerv-server'
import ReactTestUtils from '../src'
// eslint-disable-next-line
const { createElement } = React

function getTestDocument (markup) {
  const doc = document.implementation.createHTMLDocument('')
  doc.open()
  doc.write(
    markup || '<!doctype html><html><meta charset=utf-8><title>test doc</title>'
  )
  doc.close()
  return doc
}

const isNode = !!(
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node
)

if (isNode) it.skipKarma = it

describe('ReactTestUtils', () => {
  it.skipKarma('Simulate should have locally attached media events', () => {
    expect(Object.keys(ReactTestUtils.Simulate).sort()).toMatchSnapshot()
  })

  it.skipKarma(
    'gives Jest mocks a passthrough implementation with mockComponent()',
    () => {
      class MockedComponent extends React.Component {
        render () {
          throw new Error('Should not get here.')
        }
      }
      // This is close enough to what a Jest mock would give us.
      MockedComponent.prototype.render = jest.fn()

      // Patch it up so it returns its children.
      ReactTestUtils.mockComponent(MockedComponent)

      const container = document.createElement('div')
      React.render(<MockedComponent>Hello</MockedComponent>, container)
      expect(container.textContent).toBe('Hello')
    }
  )

  it('can scryRenderedComponentsWithType', () => {
    class Child extends React.Component {
      render () {
        return null
      }
    }
    class Wrapper extends React.Component {
      render () {
        return (
          <div>
            <Child />
          </div>
        )
      }
    }

    const renderedComponent = ReactTestUtils.renderIntoDocument(<Wrapper />)
    const scryResults = ReactTestUtils.scryRenderedComponentsWithType(
      renderedComponent,
      Child
    )
    expect(scryResults.length).toBe(1)
  })

  it('can scryRenderedDOMComponentsWithClass with TextComponent', () => {
    class Wrapper extends React.Component {
      render () {
        return (
          <div>
            Hello <span>Jim</span>
          </div>
        )
      }
    }

    const renderedComponent = ReactTestUtils.renderIntoDocument(<Wrapper />)
    // debugger
    const scryResults = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      'NonExistentClass'
    )
    expect(scryResults.length).toBe(0)
  })

  it('can scryRenderedDOMComponentsWithClass with className contains \\n', () => {
    class Wrapper extends React.Component {
      render () {
        return (
          <div>
            Hello <span className={'x\ny'}>Jim</span>
          </div>
        )
      }
    }

    const renderedComponent = ReactTestUtils.renderIntoDocument(<Wrapper />)
    const scryResults = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      'x'
    )
    expect(scryResults.length).toBe(1)
  })

  it('can scryRenderedDOMComponentsWithClass with multiple classes', () => {
    class Wrapper extends React.Component {
      render () {
        return (
          <div>
            Hello <span className={'x y z'}>Jim</span>
          </div>
        )
      }
    }

    const renderedComponent = ReactTestUtils.renderIntoDocument(<Wrapper />)
    const scryResults1 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      'x y'
    )
    expect(scryResults1.length).toBe(1)

    const scryResults2 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      'x z'
    )
    expect(scryResults2.length).toBe(1)

    const scryResults3 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      ['x', 'y']
    )
    expect(scryResults3.length).toBe(1)

    expect(scryResults1[0]).toBe(scryResults2[0])
    expect(scryResults1[0]).toBe(scryResults3[0])

    const scryResults4 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      ['x', 'a']
    )
    expect(scryResults4.length).toBe(0)

    const scryResults5 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      ['x a']
    )
    expect(scryResults5.length).toBe(0)
  })

  it('traverses children in the correct order', () => {
    class Wrapper extends React.Component {
      render () {
        return <div>{this.props.children}</div>
      }
    }

    const container = document.createElement('div')
    React.render(
      <Wrapper>
        {null}
        <div>purple</div>
      </Wrapper>,
      container
    )
    const tree = React.render(
      <Wrapper>
        <div>orange</div>
        <div>purple</div>
      </Wrapper>,
      container
    )

    const log = []
    ReactTestUtils.findAllInRenderedTree(tree, function (child) {
      if (ReactTestUtils.isDOMComponent(child)) {
        log.push(React.findDOMNode(child).textContent)
      }
    })

    // Should be document order, not mount order (which would be purple, orange)
    expect(log).toEqual(['orangepurple', 'orange', 'purple'])
  })

  it.skipKarma('should support injected wrapper components as DOM components', () => {
    const injectedDOMComponents = [
      'button',
      'form',
      'iframe',
      'img',
      'input',
      'option',
      'select',
      'textarea'
    ]

    injectedDOMComponents.forEach(function (type) {
      const testComponent = ReactTestUtils.renderIntoDocument(
        React.createElement(type)
      )
      expect(testComponent.tagName).toBe(type.toUpperCase())
      expect(ReactTestUtils.isDOMComponent(testComponent)).toBe(true)
    })

    // Full-page components (html, head, body) can't be rendered into a div
    // directly...
    class Root extends React.Component {
      render () {
        return (
          <html ref='html'>
            <head ref='head'>
              <title>hello</title>
            </head>
            <body ref='body'>hello, world</body>
          </html>
        )
      }
    }

    const markup = renderToString(<Root />)
    const testDocument = getTestDocument(markup)
    const component = React.hydrate(<Root />, testDocument)

    expect(component.refs.html.tagName).toBe('HTML')
    expect(component.refs.head.tagName).toBe('HEAD')
    expect(component.refs.body.tagName).toBe('BODY')
    expect(ReactTestUtils.isDOMComponent(component.refs.html)).toBe(true)
    expect(ReactTestUtils.isDOMComponent(component.refs.head)).toBe(true)
    expect(ReactTestUtils.isDOMComponent(component.refs.body)).toBe(true)
  })

  it.skip('can scry with stateless components involved', () => {
    const Stateless = () => (
      <div>
        <hr />
      </div>
    )

    class SomeComponent extends React.Component {
      render () {
        return (
          <div>
            <Stateless />
            <hr />
          </div>
        )
      }
    }

    const inst = ReactTestUtils.renderIntoDocument(<SomeComponent />)
    const hrs = ReactTestUtils.scryRenderedDOMComponentsWithTag(inst, 'hr')
    expect(hrs.length).toBe(2)
  })

  it('scryRenderedComponentsWithType should works with multiple instances', () => {
    class Button extends React.Component {
      render () {
        return <button>{this.props.children}</button>
      }
    }

    function Counter () {
      return (
        <div>
          <Button>+1</Button>
          <span>{1}</span>
          <Button>-1</Button>
        </div>
      )
    }

    const inst = ReactTestUtils.renderIntoDocument(<Counter />)
    const btns = ReactTestUtils.scryRenderedComponentsWithType(inst, Button)

    expect(btns.length).toBe(2)
  })
})
