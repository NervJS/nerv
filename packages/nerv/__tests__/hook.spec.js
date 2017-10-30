import AttributeHook from '../src/hooks/attribute-hook'
import HtmlHook from '../src/hooks/html-hook'
import { createElement, Component, render } from '../src'
import { normalizeHTML } from './util'

describe('Hooks', () => {
  let scratch

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
  describe('HTMLhook', () => {
    it('sets and removes html', () => {
      let doRender = null
      const html = '<b>foo &amp; bar</b>'
      const hook1 = new HtmlHook({ __html: html })
      const hook2 = new HtmlHook({ __html: '123' })
      const first = createElement('div', { dangerouslySetInnerHTML: hook1 })
      const second = createElement('div', { dangerouslySetInnerHTML: hook2 })
      const third = createElement('div', { dangerouslySetInnerHTML: 456 })
      const fourth = createElement('div', { dangerouslySetInnerHTML: 456 })
      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            count: 0
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
          return [first, second, third, fourth][this.state.count]
        }
      }

      let OuterC
      render(<Outer ref={comp => (OuterC = comp)} />, scratch)
      expect(scratch.childNodes[0].innerHTML).toEqual(normalizeHTML(html))
      doRender()
      OuterC.forceUpdate()
      // await nextTick()
      expect(scratch.childNodes[0].innerHTML).toEqual('123')
      doRender()
      OuterC.forceUpdate()
      // await nextTick()
      expect(scratch.childNodes[0].innerHTML).toEqual('')
    })

    it('Should not dangerously set innerHTML when previous is same as new one', () => {
      let doRender = null
      const html = '<b>foo &amp; bar</b>'
      const hook1 = new HtmlHook({ __html: html })
      const hook2 = new HtmlHook({ __html: html })
      const first = createElement('div', { dangerouslySetInnerHTML: hook1 })
      const second = createElement('div', { dangerouslySetInnerHTML: hook2 })
      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            count: 0
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
          return [first, second][this.state.count]
        }
      }

      let OuterC
      render(
        <Outer
          ref={c => {
            OuterC = c
          }}
        />,
        scratch
      )
      expect(scratch.childNodes[0].innerHTML).toEqual(normalizeHTML(html))
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].innerHTML).toEqual(normalizeHTML(html))
    })
  })
  describe('AttributeHook', () => {
    it('sets and removes namespaced attribute', () => {
      if (document.documentMode === 8) {
        return
      }
      let doRender = null
      const namespace = 'http://ns.com/my'
      const hook1 = new AttributeHook(namespace, 'first value')
      const hook2 = new AttributeHook(namespace, 'first value')
      const hook3 = new AttributeHook(namespace, 'second value')
      const first = <div myns={hook1} />
      const second = <div myns={hook2} />
      const third = <div myns={hook3} />
      const fourth = createElement('div')
      let OuterC
      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            count: 0
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
          return [first, second, third, fourth][this.state.count]
        }
      }

      render(
        <Outer
          ref={c => {
            OuterC = c
          }}
        />,
        scratch
      )
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).toEqual(
        'first value'
      )
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).toEqual(
        'first value'
      )
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).toEqual(
        'second value'
      )
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).toEqual(
        blankAttributeNS()
      )
    })

    it('sets the attribute if previous value was not an AttributeHook', () => {
      if (document.documentMode === 8) {
        return
      }
      let doRender = null
      var namespace = 'http://ns.com/my'

      var OtherHook = function (namespace, value) {
        this.namespace = namespace
        this.value = value
      }
      OtherHook.prototype.hook = function () {}

      var hook1 = new OtherHook(namespace, 'the value')
      var hook2 = new AttributeHook(namespace, 'the value')

      var first = createElement('div', { 'myns:myattr': hook1 })
      var second = createElement('div', { 'myns:myattr': hook2 })

      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            count: 0
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
          return [first, second][this.state.count]
        }
      }
      let OuterC
      render(
        <Outer
          ref={c => {
            OuterC = c
          }}
        />,
        scratch
      )
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        blankAttributeNS()
      )
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        'the value'
      )
    })

    it('removes the attribute if next value is not an AttributeHook', () => {
      if (document.documentMode === 8) {
        return
      }
      let doRender = null
      var namespace = 'http://ns.com/my'

      var OtherHook = function (namespace, value) {
        this.namespace = namespace
        this.value = value
        this.vhook = 3
      }
      OtherHook.prototype.hook = function () {}

      var hook1 = new AttributeHook(namespace, 'the value')
      var hook2 = new OtherHook(namespace, 'the value')

      var first = createElement('div', { 'myns:myattr': hook1 })
      var second = createElement('div', { 'myns:myattr': hook2 })
      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            count: 0
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
          return [first, second][this.state.count]
        }
      }
      let OuterC
      render(
        <Outer
          ref={c => {
            OuterC = c
          }}
        />,
        scratch
      )
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        'the value'
      )
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        blankAttributeNS()
      )
    })

    it('sets the attribute if previous value uses a different namespace', () => {
      if (document.documentMode === 8) {
        return
      }
      let doRender = null
      var namespace = 'http://ns.com/my'

      var hook1 = new AttributeHook('http://other.ns/', 'the value')
      var hook2 = new AttributeHook(namespace, 'the value')

      var first = createElement('div', { 'myns:myattr': hook1 })
      var second = createElement('div', { 'myns:myattr': hook2 })

      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            count: 0
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
          return [first, second][this.state.count]
        }
      }
      let OuterC
      render(
        <Outer
          ref={c => {
            OuterC = c
          }}
        />,
        scratch
      )
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        blankAttributeNS()
      )
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        'the value'
      )
    })

    it('removes the attribute if next value uses a different namespace', () => {
      if (document.documentMode === 8) {
        return
      }
      let doRender
      var namespace = 'http://ns.com/my'

      var hook1 = new AttributeHook(namespace, 'the value')
      var hook2 = new AttributeHook('http://other.ns/', 'the value')

      var first = createElement('div', { 'myns:myattr': hook1 })
      var second = createElement('div', { 'myns:myattr': hook2 })

      class Outer extends Component {
        constructor () {
          super(...arguments)
          this.state = {
            count: 0
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
          return [first, second][this.state.count]
        }
      }

      let OuterC
      render(
        <Outer
          ref={c => {
            OuterC = c
          }}
        />,
        scratch
      )
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        'the value'
      )
      doRender()
      OuterC.forceUpdate()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).toEqual(
        blankAttributeNS()
      )
    })
  })
})

function blankAttributeNS () {
  // Most browsers conform to the latest version of the DOM spec,
  // which requires `getAttributeNS` to return `null` when the attribute
  // doesn't exist, but some browsers (including phantomjs) implement the
  // old version of the spec and return an empty string instead, see:
  // https://developer.mozilla.org/en-US/docs/Web/API/element.getAttributeNS#Return_value
  var div = document.createElement('div')
  return div.getAttributeNS(null, 'foo')
}
