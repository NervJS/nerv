import AttributeHook from '../../src/hooks/attribute-hook'
import { createElement, Component, render, nextTick } from '../../src'

describe('Hooks', () => {
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
  describe('AttributeHook', () => {
    it('sets and removes namespaced attribute', async () => {
      let doRender = null
      const namespace = 'http://ns.com/my'
      const hook1 = new AttributeHook(namespace, 'first value')
      const hook2 = new AttributeHook(namespace, 'first value')
      const hook3 = new AttributeHook(namespace, 'second value')
      const first = <div myns={hook1} />
      const second = <div myns={hook2} />
      const third = <div myns={hook3} />
      const fourth = createElement('div')

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
          return ([
            first,
            second,
            third,
            fourth
          ][this.state.count])
        }
      }

      render(<Outer />, scratch)
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).to.eq('first value')
      doRender()
      await nextTick()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).to.eq('first value')
      doRender()
      await nextTick()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).to.eq('second value')
      doRender()
      await nextTick()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myns')).to.eq(blankAttributeNS())
    })

    it('sets the attribute if previous value was not an AttributeHook', async () => {
      let doRender = null
      var namespace = 'http://ns.com/my'

      var OtherHook = function (namespace, value) {
        this.namespace = namespace
        this.value = value
      }
      OtherHook.prototype.hook = function () { }

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
          return ([
            first,
            second
          ][this.state.count])
        }
      }

      render(<Outer />, scratch)
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq(blankAttributeNS())
      doRender()
      await nextTick()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq('the value')
    })

    it('removes the attribute if next value is not an AttributeHook', async () => {
      let doRender = null
      var namespace = 'http://ns.com/my'

      var OtherHook = function (namespace, value) {
        this.namespace = namespace
        this.value = value
      }
      OtherHook.prototype.hook = function () { }

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
          return ([
            first,
            second
          ][this.state.count])
        }
      }

      render(<Outer />, scratch)
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq('the value')
      doRender()
      await nextTick()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq(blankAttributeNS())
    })

    it('sets the attribute if previous value uses a different namespace', async () => {
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
          return ([
            first,
            second
          ][this.state.count])
        }
      }

      render(<Outer />, scratch)
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq(blankAttributeNS())
      doRender()
      await nextTick()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq('the value')
    })

    it('removes the attribute if next value uses a different namespace', async () => {
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
          return ([
            first,
            second
          ][this.state.count])
        }
      }

      render(<Outer />, scratch)
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq('the value')
      doRender()
      await nextTick()
      expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq(blankAttributeNS())
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
