import { noop, CompositeComponent, StatelessComponent, VirtualNode, Component } from 'nerv-shared'

export type optionsHook = (vnode: CompositeComponent | StatelessComponent) => void

const options: {
  afterMount: optionsHook
  afterUpdate: optionsHook
  beforeUpdate: optionsHook
  beforeUnmount: optionsHook
  beforeMount: optionsHook
  afterCreate: optionsHook
  beforeRender: (component: Component<any, any>) => void
  roots: VirtualNode[],
  debug: boolean
} = {
    afterMount: noop,
    afterUpdate: noop,
    beforeUpdate: noop,
    beforeUnmount: noop,
    beforeRender: noop,
    beforeMount: noop,
    afterCreate: noop,
    roots: [],
    debug: false
  }

export default options
