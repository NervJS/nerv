import { VType } from 'nerv-shared'
class VText {
  vtype = VType.Text
  text: string | number
  constructor (text: string | number) {
    this.text = text || ''
  }
}

export default VText
