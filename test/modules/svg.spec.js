/** @jsx createElement */
import { createElement, render } from '../../src'

import { sortAttributes } from '../util'

describe('svg', () => {
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
  const rsvg = /^\[object SVG\w*Element\]$/

  it('circle', () => {
    render(
      <svg><circle cx='25' cy='25' r='20' fill='green' /></svg>, scratch)
    expect(rsvg.test(scratch.firstChild)).to.be.true
  })

  it('should render SVG to string', () => {
    render((
      <svg viewBox='0 0 360 360'>
        <path stroke='white' fill='black' d='M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z' />
      </svg>
    ), scratch)

    let html = sortAttributes(String(scratch.innerHTML).replace(' xmlns="http://www.w3.org/2000/svg"', ''))
    expect(html).to.equal(sortAttributes('<svg viewBox="0 0 360 360"><path d="M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z" fill="black" stroke="white"></path></svg>'.replace(/[\n\t]+/g, '')))
  })

  it('should render SVG to DOM', () => {
    const Demo = () => (
      <svg viewBox='0 0 360 360'>
        <path d='M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z' fill='black' stroke='white' />
      </svg>
    )
    render(<Demo />, scratch)

    let html = sortAttributes(String(scratch.innerHTML).replace(' xmlns="http://www.w3.org/2000/svg"', ''))
    expect(html).to.equal(sortAttributes('<svg viewBox="0 0 360 360"><path stroke="white" fill="black" d="M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z"></path></svg>'))
  })

  it('should render with the correct namespace URI', () => {
    render(<svg />, scratch)

    let namespace = scratch.querySelector('svg').namespaceURI

    expect(namespace).to.equal('http://www.w3.org/2000/svg')
  })

  it('should still support class attribute', () => {
    render((
      <svg viewBox='0 0 1 1' class='foo bar' />
    ), scratch)

    expect(scratch.innerHTML).to.contain(` class="foo bar"`)
  })

  it('should switch back to HTML for <foreignObject>', () => {
    render((
      <svg>
        <g>
          <foreignObject>
            <a href='#foo'>test</a>
          </foreignObject>
        </g>
      </svg>
    ), scratch)

    expect(scratch.getElementsByTagName('a'))
      .to.have.property('0')
      .that.is.a('HTMLAnchorElement')
  })

  it('shoul use got xlink attribute', () => {
    function Test () {
      return (
        <svg className='icon-twitter' width='16px' height='16px'>
          <use xlinkHref='#twitter' xlinkRole='#aaa' id='aaa' />
        </svg>
      )
    }

    render(<Test />, scratch)
    var el = scratch.getElementsByTagName('use')
    expect(el.length).to.equal(1)
    expect(el[0].getAttribute('xlink:href')).to.equal('#twitter')
    expect(el[0].getAttribute('xlink:role')).to.equal('#aaa')
  })
})
