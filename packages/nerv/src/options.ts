import { noop, CompositeComponent, StatelessComponent, VirtualNode, Component } from 'nerv-shared'

export type optionsHook = (vnode: CompositeComponent | StatelessComponent) => void

const options: {
  afterMount: optionsHook
  afterUpdate: optionsHook
  beforeUnmount: optionsHook
  beforeRender: (component: Component<any, any>) => void
  roots: VirtualNode[],
  debug: boolean
} = {
    afterMount: noop,
    afterUpdate: noop,
    beforeUnmount: noop,
    beforeRender: noop,
    roots: [],
    debug: false
  }

export default options
