class VText {
  constructor (text) {
    this.text = text || ''
  }
}

VText.prototype.type = 'VirtualText'

module.exports = VText