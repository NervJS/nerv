/** @jsx createElement */
import { Component, createElement, render } from '../../src'

import { getAttributes, sortAttributes } from '../util'

describe('render()', () => {
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

    let c = scratch.childNodes[0].childNodes
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
    let root = render((
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
})
