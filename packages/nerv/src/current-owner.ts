import Component from './component'

const Current: {
  current: null | Component<any, any>,
  index: number
} = {
  current: null,
  index: 0
}

export default Current
