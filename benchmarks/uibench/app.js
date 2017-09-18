
class TableCell extends Nerv.PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    console.log('Clicked' + this.props.text);
    e.stopPropagation();
  }

  render() {
    return Nerv.createElement(
      'td',
      { className: 'TableCell', onClick: this.onClick },
      this.props.text
    );
  }
}

class TableRow extends Nerv.PureComponent {
  render() {
    const { data } = this.props;

    // Interned strings
    const classes = data.active ? 'TableRow active' : 'TableRow';

    const cells = data.props;

    const children = [];
    for (let i = 0; i < cells.length; i++) {
      // Key is used because Nerv prints warnings that there should be a key, libraries that can detect that children
      // shape isn't changing should render cells without keys.
      children.push(Nerv.createElement(TableCell, { key: i, text: cells[i] }));
    }

    // First table cell is inserted this way to prevent Nerv from printing warning that it doesn't have key property
    return Nerv.createElement(
      'tr',
      { className: classes, 'data-id': data.id },
      Nerv.createElement(TableCell, { text: '#' + data.id }),
      children
    );
  }
}

class Table extends Nerv.PureComponent {
  render() {
    const items = this.props.data.items;

    const children = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      children.push(Nerv.createElement(TableRow, { key: item.id, data: item }));
    }

    return Nerv.createElement(
      'table',
      { className: 'Table' },
      Nerv.createElement(
        'tbody',
        null,
        children
      )
    );
  }
}

class AnimBox extends Nerv.PureComponent {
  render() {
    const { data } = this.props;
    const time = data.time;
    const style = {
      'borderRadius': (time % 10).toString() + 'px',
      'background': 'rgba(0,0,0,' + (0.5 + time % 10 / 10).toString() + ')'
    };

    return Nerv.createElement('div', { className: 'AnimBox', 'data-id': data.id, style: style });
  }
}

class Anim extends Nerv.PureComponent {
  render() {
    const items = this.props.data.items;

    const children = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      children.push(Nerv.createElement(AnimBox, { key: item.id, data: item }));
    }

    return Nerv.createElement(
      'div',
      { className: 'Anim' },
      children
    );
  }
}

class TreeLeaf extends Nerv.PureComponent {
  render() {
    return Nerv.createElement(
      'li',
      { className: 'TreeLeaf' },
      this.props.data.id
    );
  }
}

class TreeNode extends Nerv.PureComponent {
  render() {
    const { data } = this.props;
    const children = [];

    for (let i = 0; i < data.children.length; i++) {
      const n = data.children[i];
      if (n.container) {
        children.push(Nerv.createElement(TreeNode, { key: n.id, data: n }));
      } else {
        children.push(Nerv.createElement(TreeLeaf, { key: n.id, data: n }));
      }
    }

    return Nerv.createElement(
      'ul',
      { className: 'TreeNode' },
      children
    );
  }
}

class Tree extends Nerv.PureComponent {
  render() {
    return Nerv.createElement(
      'div',
      { className: 'Tree' },
      Nerv.createElement(TreeNode, { data: this.props.data.root })
    );
  }
}

class Main extends Nerv.PureComponent {
  render() {
    const { data } = this.props;
    const location = data.location;

    var section;
    if (location === 'table') {
      section = Nerv.createElement(Table, { data: data.table });
    } else if (location === 'anim') {
      section = Nerv.createElement(Anim, { data: data.anim });
    } else if (location === 'tree') {
      section = Nerv.createElement(Tree, { data: data.tree });
    }

    return Nerv.createElement(
      'div',
      { className: 'Main' },
      section
    );
  }
}

uibench.init('Nerv[PC]', Nerv.version);

document.addEventListener('DOMContentLoaded', function (e) {
  const container = document.querySelector('#App');

  uibench.run(function (state) {
    Nerv.render(Nerv.createElement(Main, { data: state }), container);
  }, function (samples) {
    Nerv.render(Nerv.createElement(
      'pre',
      null,
      JSON.stringify(samples, null, ' ')
    ), container);
  });
});