import { noop, CompositeComponent, StatelessComponent, VirtualNode, Suspense } from 'nerv-shared'

export type optionsHook = (vnode: CompositeComponent | StatelessComponent | Suspense ) => void

const options: {
  afterMount: optionsHook
  afterUpdate: optionsHook
  beforeUnmount: optionsHook
  roots: VirtualNode[],
  debug: boolean
} = {
    afterMount: noop,
    afterUpdate: noop,
    beforeUnmount: noop,
    roots: [],
    debug: false
  }

export default options
