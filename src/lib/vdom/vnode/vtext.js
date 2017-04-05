class VText {
  constructor (text) {
    this.text = text || '';
  }
}

VText.prototype.type = 'vtext';

module.exports = VText;