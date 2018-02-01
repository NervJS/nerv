import { VirtualNode, VType, Portal } from 'nerv-shared'

export function createPortal (children: VirtualNode, container: Element): Portal {
  return {
    type: container,
    vtype: VType.Portal,
    children,
    dom: null
  }
}
