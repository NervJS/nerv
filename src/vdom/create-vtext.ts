import VText from './vnode/vtext'

export default function createVText (text: string | number) {
  return new VText(text)
}
