import { VType } from 'nerv-shared'
export function createVoid () {
  const dom = document.createTextNode('')
  return {
    dom,
    vtype: VType.Void
  }
}
