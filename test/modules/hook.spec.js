import AttributeHook from '../../src/hooks/attribute-hook'
import { createElement, Component, render } from '../../src'

describe.only('Hook', () => {
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
  it('AttributeHook', () => {
    let doRender = null
    const namespace = 'http://ns.com/my'
    const hook1 = new AttributeHook('http://other.ns/', 'the value')
    const hook2 = new AttributeHook(namespace, 'first value')
    const hook3 = new AttributeHook(namespace, 'second value')
    const first = createElement('div', { 'myns:myattr': hook1 })
    const second = createElement('div', { 'myns:myattr': hook2 })
    const third = createElement('div', { 'myns:myattr': hook3 })

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
          first,
          second,
          third
        ][this.state.count])
      }
    }

    render(<Outer />, scratch)
    doRender()
    console.log(scratch.childNodes[0])
    expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq(blankAttributeNS())
    doRender()
    console.log(scratch.childNodes[0])
    expect(scratch.childNodes[0].getAttributeNS(namespace, 'myattr')).to.eq(blankAttributeNS())
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
