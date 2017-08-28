
class TableCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    console.log('Clicked' + this.props.text);
    e.stopPropagation();
  }

  render() {
    return React.createElement(
      'td',
      { className: 'TableCell', onClick: this.onClick },
      this.props.text
    );
  }
}

class TableRow extends React.PureComponent {
  render() {
    const { data } = this.props;

    // Interned strings
    const classes = data.active ? 'TableRow active' : 'TableRow';

    const cells = data.props;

    const children = [];
    for (let i = 0; i < cells.length; i++) {
      // Key is used because React prints warnings that there should be a key, libraries that can detect that children
      // shape isn't changing should render cells without keys.
      children.push(React.createElement(TableCell, { key: i, text: cells[i] }));
    }

    // First table cell is inserted this way to prevent react from printing warning that it doesn't have key property
    return React.createElement(
      'tr',
      { className: classes, 'data-id': data.id },
      React.createElement(TableCell, { text: '#' + data.id }),
      children
    );
  }
}

class Table extends React.PureComponent {
  render() {
    const items = this.props.data.items;

    const children = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      children.push(React.createElement(TableRow, { key: item.id, data: item }));
    }

    return React.createElement(
      'table',
      { className: 'Table' },
      React.createElement(
        'tbody',
        null,
        children
      )
    );
  }
}

class AnimBox extends React.PureComponent {
  render() {
    const { data } = this.props;
    const time = data.time;
    const style = {
      'borderRadius': (time % 10).toString() + 'px',
      'background': 'rgba(0,0,0,' + (0.5 + time % 10 / 10).toString() + ')'
    };

    return React.createElement('div', { className: 'AnimBox', 'data-id': data.id, style: style });
  }
}

class Anim extends React.PureComponent {
  render() {
    const items = this.props.data.items;

    const children = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      children.push(React.createElement(AnimBox, { key: item.id, data: item }));
    }

    return React.createElement(
      'div',
      { className: 'Anim' },
      children
    );
  }
}

class TreeLeaf extends React.PureComponent {
  render() {
    return React.createElement(
      'li',
      { className: 'TreeLeaf' },
      this.props.data.id
    );
  }
}

class TreeNode extends React.PureComponent {
  render() {
    const { data } = this.props;
    const children = [];

    for (let i = 0; i < data.children.length; i++) {
      const n = data.children[i];
      if (n.container) {
        children.push(React.createElement(TreeNode, { key: n.id, data: n }));
      } else {
        children.push(React.createElement(TreeLeaf, { key: n.id, data: n }));
      }
    }

    return React.createElement(
      'ul',
      { className: 'TreeNode' },
      children
    );
  }
}

class Tree extends React.PureComponent {
  render() {
    return React.createElement(
      'div',
      { className: 'Tree' },
      React.createElement(TreeNode, { data: this.props.data.root })
    );
  }
}

class Main extends React.PureComponent {
  render() {
    const { data } = this.props;
    const location = data.location;

    var section;
    if (location === 'table') {
      section = React.createElement(Table, { data: data.table });
    } else if (location === 'anim') {
      section = React.createElement(Anim, { data: data.anim });
    } else if (location === 'tree') {
      section = React.createElement(Tree, { data: data.tree });
    }

    return React.createElement(
      'div',
      { className: 'Main' },
      section
    );
  }
}

uibench.init('React[PC]', React.version);

document.addEventListener('DOMContentLoaded', function (e) {
  const container = document.querySelector('#App');

  uibench.run(function (state) {
    ReactDOM.render(React.createElement(Main, { data: state }), container);
  }, function (samples) {
    ReactDOM.render(React.createElement(
      'pre',
      null,
      JSON.stringify(samples, null, ' ')
    ), container);
  });
});