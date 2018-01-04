import { VType } from 'nerv-shared'
import { doc } from 'nerv-utils'
export function createVoid () {
  const dom = doc.createTextNode('')
  return {
    dom,
    vtype: VType.Void
  }
}
