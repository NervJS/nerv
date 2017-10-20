class VText {
  type = 'VirtualText'
  text: string | number
  constructor (text: string | number) {
    this.text = text || ''
  }
}

export default VText
