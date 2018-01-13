'use strict'

var Nerv = require('nervjs')

function TableCell (_ref) {
  var text = _ref.text

  return Nerv.createElement(
    'td',
    { className: 'TableCell', onClick: onClick(text) },
    text
  )
}

function onClick (text) {
  return function (e) {
    console.log('Clicked' + text)
    e.stopPropagation()
  }
}

function shouldCellUpdate (p, c) {
  return p.text !== c.text
}

function TableRow (_ref2) {
  var data = _ref2.data

  var classes = data.active ? 'TableRow active' : 'TableRow'

  var cells = data.props

  var children = []
  for (var i = 0; i < cells.length; i++) {
    // Key is used because Nerv prints warnings that there should be a key, libraries that can detect that children
    // shape isn't changing should render cells without keys.
    children.push(
      Nerv.createElement(TableCell, {
        key: i,
        text: cells[i],
        onShouldComponentUpdate: shouldCellUpdate
      })
    )
  }

  return Nerv.createElement(
    'tr',
    { className: classes, 'data-id': data.id },
    Nerv.createElement(TableCell, {
      text: '#' + data.id,
      onShouldComponentUpdate: isDataChanged
    }),
    children
  )
}

function isDataChanged (p, c) {
  return p.data !== c.data
}

function Table (_ref3) {
  var data = _ref3.data

  var items = data.items

  var children = []
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    children.push(
      Nerv.createElement(TableRow, {
        key: item.id,
        data: item,
        onShouldComponentUpdate: isDataChanged
      })
    )
  }

  return Nerv.createElement(
    'table',
    { className: 'Table' },
    Nerv.createElement('tbody', null, children)
  )
}

function AnimBox (_ref4) {
  var data = _ref4.data

  var time = data.time
  var style = {
    borderRadius: (time % 10).toString() + 'px',
    background: 'rgba(0,0,0,' + (0.5 + (time % 10) / 10).toString() + ')'
  }

  return Nerv.createElement('div', {
    className: 'AnimBox',
    'data-id': data.id,
    style: style
  })
}

function Anim (_ref5) {
  var data = _ref5.data

  var items = data.items

  var children = []
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    children.push(
      Nerv.createElement(AnimBox, {
        key: item.id,
        data: item,
        onShouldComponentUpdate: isDataChanged
      })
    )
  }

  return Nerv.createElement('div', { className: 'Anim' }, children)
}

function TreeLeaf (_ref6) {
  var data = _ref6.data

  return Nerv.createElement('li', { className: 'TreeLeaf' }, data.id)
}

function TreeNode (_ref7) {
  var data = _ref7.data

  var children = []

  for (var i = 0; i < data.children.length; i++) {
    var n = data.children[i]
    if (n.container) {
      children.push(
        Nerv.createElement(TreeNode, {
          key: n.id,
          data: n,
          onShouldComponentUpdate: isDataChanged
        })
      )
    } else {
      children.push(
        Nerv.createElement(TreeLeaf, {
          key: n.id,
          data: n,
          onShouldComponentUpdate: isDataChanged
        })
      )
    }
  }

  return Nerv.createElement('ul', { className: 'TreeNode' }, children)
}

function Tree (_ref8) {
  var data = _ref8.data

  return Nerv.createElement(
    'div',
    { className: 'Tree' },
    Nerv.createElement(TreeNode, {
      data: data.root,
      onShouldComponentUpdate: isDataChanged
    })
  )
}

class Main extends Nerv.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return this.props.data !== nextProps.data
  }

  render () {
    const { data } = this.props
    const location = data.location

    var section
    if (location === 'table') {
      section = Nerv.createElement(Table, { data: data.table })
    } else if (location === 'anim') {
      section = Nerv.createElement(Anim, { data: data.anim })
    } else if (location === 'tree') {
      section = Nerv.createElement(Tree, { data: data.tree })
    }

    return Nerv.createElement('div', { className: 'Main' }, section)
  }
}

uibench.init('Nerv', '1.2.4')

document.addEventListener('DOMContentLoaded', function (e) {
  var container = document.querySelector('#App')

  uibench.run(
    function (state) {
      Nerv.render(
        Nerv.createElement(Main, {
          data: state
        }),
        container
      )
    },
    function (samples) {
      Nerv.render(
        Nerv.createElement('pre', null, JSON.stringify(samples, null, ' ')),
        container
      )
    }
  )
})
