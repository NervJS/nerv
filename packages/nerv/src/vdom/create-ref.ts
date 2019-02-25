import { VirtualNode, RefObject, VType} from 'nerv-shared'
export function createRef (children: VirtualNode): RefObject {
    const refObject = {
      current: null,
    }
    return refObject
}
export function forwardRef(render: Function) {
  console.log('render function', render)
  return {
    vtype: VType.ForwardRefComponent,
    render
  }
}
