import test from 'ava';
import h from '#/h';
import { Widget } from '@/index.js';
import { WidgetDom } from '@/index.js';

global.document = require('global/document');

class List extends Widget {
  render () {
    const items = [1, 2, 3, 4, 5].map(item => <ListItem itemValue={item}></ListItem>);
    return (
      <ul className="list">
        { items }
      </ul>
    );
  }
}

class ListItem extends Widget {
  render () {
    return (
      <li className="list_item">{ this.props.itemValue }</li>
    );
  }
}

WidgetDom.render(<List className="ttt" listName="xxx"></List>, document.getElementById('test'));