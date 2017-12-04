/** @jsx createElement */
import { Component, createElement, render } from '../src/index'
import { normalizeHTML } from './util'
describe('keys', () => {
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

  it('should remove orphaned keyed nodes', () => {
    let inst
    class App extends Component {
      constructor () {
        super(...arguments)
        this.state = {
          type: (
            <div>
              <div>1</div>
              <li key='a'>a</li>
              <li key='b'>b</li>
            </div>
          )
        }
        inst = this
      }

      render () {
        return this.state.type
      }
    }
    render(<App />, scratch)
    inst.setState({
      type: (
        <div>
          <div>2</div>
          <li key='b'>b</li>
          <li key='c'>c</li>
        </div>
      )
    })
    inst.forceUpdate()
    expect(scratch.innerHTML).toEqual(
      normalizeHTML('<div><div>2</div><li>b</li><li>c</li></div>')
    )
  })

  it('should patch keyed children properly', () => {
    const container = document.createElement('container')
    let arr = new Array(100)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i
    }
    arr = arr.map((n) => ({ n }))
    const List = ({ n }) => <li key={n + ','}>{n + ','}</li>
    const App = ({ list }) => {
      return <ul>{list.map(List)}</ul>
    }
    render(<App list={arr} />, container)
    const arr2 = arr.filter(({ n }) => n !== 50)
    render(<App list={arr2} />, container)
    expect(container.textContent.split(',').indexOf('50') !== -1).toBe(false)
    const arr3 = arr
      .slice(0, 50)
      .concat([{ n: 101 }])
      .concat(arr.slice(50, 100))
    render(<App list={arr3} />, container)
    expect(container.textContent.split(',').indexOf('101') !== -1).toBe(true)
    const arr4 = arr.filter(({ n }) => n % 2)
    render(<App list={arr4} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr4.map(({ n }) => String(n)).concat([''])
    )
    const arr5 = arr
      .slice(0, 30)
      .concat(arr.slice(40, 50))
      .concat(arr.slice(30, 40))
      .concat(arr.slice(50, 100))
    render(<App list={arr5} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr5.map(({ n }) => String(n)).concat([''])
    )
    const arr6 = [].concat(arr.slice(2, 5)).concat(arr.slice(0, 2))
    render(<App list={arr6} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr6.map(({ n }) => String(n)).concat([''])
    )
    const arr7 = arr.slice(0, 5)
    render(<App list={arr7} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr7.map(({ n }) => String(n)).concat([''])
    )
    const arr8 = arr.slice(0, 3)
    render(<App list={arr8} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr8.map(({ n }) => String(n)).concat([''])
    )
    const arr9 = arr.slice(0, 3).reverse()
    render(<App list={arr9} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr9.map(({ n }) => String(n)).concat([''])
    )
    //
    render(<App list={arr.slice(0, 10)} />, container)
    render(<App list={arr.slice(10, 20)} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr
        .slice(10, 20)
        .map(({ n }) => String(n))
        .concat([''])
    )
    render(<App list={arr} />, container)
    render(<App list={arr4.concat([{ n: 101 }])} />, container)
    expect(container.textContent.split(',')).toEqual(
      arr4
        .concat([{ n: 101 }])
        .map(({ n }) => String(n))
        .concat([''])
    )
  })
})
