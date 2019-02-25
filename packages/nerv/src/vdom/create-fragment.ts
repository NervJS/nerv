import { VirtualNode, VType, Fragment} from 'nerv-shared'

export function createFragment (children: VirtualNode): Fragment {
  return {
    vtype: VType.Fragment,
    children,
    dom: null
  }
}
