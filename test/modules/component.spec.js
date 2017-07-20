/** @jsx createElement */
import { Component, createElement, render, cloneElement } from '../../src'

const Empty = () => null
describe('Component', function () {
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

  it('should remove children when root changes to text node', () => {
    let comp
    class Comp extends Component {
      render () {
        return this.state.alt ? 'asdf' : <div>test</div>
      }
    }

    render(<Comp ref={c => { comp = c }} />, scratch)

    comp.setState({ alt: true })
    comp.forceUpdate()
    expect(scratch.innerHTML, 'switching to textnode').to.equal('asdf')
    comp.setState({ alt: false })
    comp.forceUpdate()
    expect(scratch.innerHTML, 'switching to element').to.equal('<div>test</div>')

    comp.setState({ alt: true })
    comp.forceUpdate()
    expect(scratch.innerHTML, 'switching to textnode 2').to.equal('asdf')
  })

  it('should not recycle common class children with different keys', () => {
    let idx = 0
    let msgs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    let sideEffect = sinon.spy()

    class Comp extends Component {
      componentWillMount () {
        this.innerMsg = msgs[(idx++ % 8)]
        sideEffect()
      }

      render () {
        return <div>{this.innerMsg}</div>
      }
    }
    sinon.spy(Comp.prototype, 'componentWillMount')

    class GoodContainer extends Component {
      constructor () {
        super(...arguments)
        this.state.alt = false
      }

      render () {
        const { alt } = this.state
        return (
          <div>
            {alt ? null : (<Comp key={1} alt={alt} />)}
            {alt ? null : (<Comp key={2} alt={alt} />)}
            {alt ? (<Comp key={3} alt={alt} />) : null}
          </div>
        )
      }
    }

    class BadContainer extends Component {
      constructor () {
        super(...arguments)
        this.state.alt = false
      }

      render () {
        const { alt } = this.state
        return (
          <div>
            {alt ? null : (<Comp alt={alt} />)}
            {alt ? null : (<Comp alt={alt} />)}
            {alt ? (<Comp alt={alt} />) : null}
          </div>
        )
      }
    }

    let good
    let bad
    render(<GoodContainer ref={c => (good = c)} />, scratch)
    expect(scratch.textContent, 'new component with key present').to.equal('AB')
    expect(Comp.prototype.componentWillMount).to.have.been.calledTwice
    expect(sideEffect).to.have.been.calledTwice

    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    good.setState({ alt: true })
    good.forceUpdate()
    expect(scratch.textContent, 'new component with key present re-rendered').to.equal('C')
    // we are recycling the first 2 components already rendered, just need a new one
    expect(Comp.prototype.componentWillMount).to.have.been.calledOnce
    expect(sideEffect).to.have.been.calledOnce

    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    scratch.innerHTML = ''
    render(<BadContainer ref={c => (bad = c)} />, scratch)
    expect(scratch.textContent, 'new component without key').to.equal('DE')
    expect(Comp.prototype.componentWillMount).to.have.been.calledTwice
    expect(sideEffect).to.have.been.calledTwice
    sideEffect.reset()
    Comp.prototype.componentWillMount.reset()
    bad.setState({ alt: true })
    bad.forceUpdate()
    expect(scratch.textContent, 'new component without key re-rendered').to.equal('D')
    expect(Comp.prototype.componentWillMount).to.not.have.been.called
    expect(sideEffect).to.not.have.been.called
  })

  describe('props.children', () => {
    it('should support passing children as a prop', () => {
      const Foo = props => <div {...props} />

      render(
        <Foo a='b' children={[
          <span class='bar'>bar</span>,
          '123',
          456
        ]} />, scratch)

      expect(scratch.innerHTML).to.equal('<div a="b"><span class="bar">bar</span>123456</div>')
    })

    it('should be ignored when explicit children exist', () => {
      const Foo = props => <div {...props}>a</div>
      render(<Foo children={'b'} />, scratch)
      expect(scratch.innerHTML).to.equal('<div>a</div>')
    })
  })

  describe('High-Order Components', () => {
    it('should render nested functional components', () => {
      const PROPS = { foo: 'bar', onBaz: () => {} }

      const Outer = sinon.spy(
        props => <Inner {...props} />
      )

      const Inner = sinon.spy(
        props => <div {...props}>inner</div>
      )

      render(<Outer {...PROPS} />, scratch)

      expect(Outer)
      .to.have.been.calledOnce
      .and.to.have.been.calledWithMatch(PROPS)
      .and.to.have.returned(sinon.match({
        ComponentType: Inner
      }))

      expect(Inner)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithMatch(PROPS)
        .and.to.have.returned(sinon.match({
          tagName: 'div',
          children: ['inner']
        }))

      expect(scratch.innerHTML).to.equal('<div foo="bar">inner</div>')
    })
  })
})
