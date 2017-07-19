/** @jsx createElement */
import { Component, createElement, render, cloneElement } from '../../src'

const Empty = () => null
describe('test Component', function () {
  this.timeout(20000)
  let scratch
  before(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(() => {
    let c = scratch.firstElementChild
    if (c) {
      render(<Empty />, scratch)
    }
    scratch.innerHTML = ''
  })

  after(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should render components', () => {
    class C extends Component {
      render () {
        return <div>C</div>
      }
    }
    sinon.spy(C.prototype, 'render')
    render(<C />, scratch)

    expect(C.prototype.render)
      .to.have.been.calledOnce
      .and.to.have.returned(sinon.match({ tagName: 'div' }))

    expect(scratch.innerHTML).to.equal('<div>C</div>')
  })

  it('should render functional components', () => {
    const props = { foo: 'bar' }
    const C = sinon.spy(options => <div {...options} />)
    render(<C {...props} />, scratch)
    expect(C)
      .to.have.been.calledOnce
      .and.to.have.been.calledWithMatch(props)
      .and.to.have.returned(sinon.match({
        tagName: 'div'
      }))
    expect(scratch.innerHTML).to.equal('<div foo="bar"></div>')
  })

  it('should render components with props', () => {
    const props = { foo: 'bar', onBaz: () => { } }
    let constructorProps
    class C extends Component {
      constructor () {
        super(...arguments)
        constructorProps = props
      }
      render () {
        return <div {...this.props}>C</div>
      }
    }
    sinon.spy(C.prototype, 'render')
    render(<C {...props} />, scratch)
    delete constructorProps.children
    delete constructorProps.owner
    expect(constructorProps).to.deep.equal(props)

    expect(C.prototype.render)
      .to.have.been.calledOnce
      .and.to.have.been.calledWithMatch()
      .and.to.have.returned(sinon.match({
        tagName: 'div'
      }))

    expect(scratch.innerHTML).to.equal('<div foo="bar">C</div>')
  })

  it('should clone components', () => {
    function Comp () { }
    let instance = <Comp />
    let clone = cloneElement(instance)
    expect(clone.prototype).to.equal(instance.prototype)
  })
})
