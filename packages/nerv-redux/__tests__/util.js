import { Component, render } from 'nervjs'

export class Wrapper extends Component {
  render () {
    return this.props.children
  }

  repaint () {
    return new Promise(resolve => this.setState({}, resolve))
  }
}

export function renderIntoDocument (input) {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  return render(input, parent)
}
