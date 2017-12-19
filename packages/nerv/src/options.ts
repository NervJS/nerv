import { noop, CompositeComponent, StatelessComponent } from 'nerv-shared'

type optionsHook = (vnode: CompositeComponent | StatelessComponent) => void

const options: {
  afterMount: optionsHook
  afterUpdate: optionsHook
  beforeUnmount: optionsHook
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
