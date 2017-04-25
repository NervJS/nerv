import test from 'ava'
import h from '#/h'
import { Component, ComponentDom } from '@/index.js'

global.document = require('global/document')

class List extends Component {
  onItemClick (x) {
    alert('itemclick' + x)
  }
  render () {
    const items = [1, 2, 3, 4, 5].map(item => <ListItem itemValue={item} onItemClick={this.onItemClick}></ListItem>)
    return (
      <ul className="list">
        { items }
      </ul>
    )
  }
}

class ListItem extends Component {
  _onclick () {
    this.props.onItemClick(this.props.itemValue)
  }
  render () {
    return (
      <li className="list_item" onClick={this._onclick}>{ this.props.itemValue }</li>
    )
  }
}

ComponentDom.render(<List className="ttt" listName="xxx"></List>, document.getElementById('test'))