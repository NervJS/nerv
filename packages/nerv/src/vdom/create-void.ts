import { VType, doc } from 'nerv-shared'
export function createVoid () {
  const dom = doc.createTextNode('')
  return {
    dom,
    vtype: VType.Void
  }
}
