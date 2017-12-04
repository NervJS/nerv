import { noop } from 'nerv-shared'
const options: {
  afterMount: Function
  afterUpdate: Function
  beforeUnmount: Function
  roots: Object,
  debug: boolean
} = {
    afterMount: noop,
    afterUpdate: noop,
    beforeUnmount: noop,
    roots: {},
    debug: false
  }

export default options
