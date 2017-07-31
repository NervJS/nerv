import { Events } from '../../src'

describe('Events', () => {
  it('evnets props', () => {
    const events = new Events()
    expect(events).to.have.property('off').that.is.a('function')
    expect(events).to.have.property('on').that.is.a('function')
    expect(events).to.have.property('trigger').that.is.a('function')
  })

  it('on events', () => {
    const events = new Events()
    const func1 = () => {}
    const func2 = () => {}
    events.on('test_event1 test_event2', func1)
    expect(events.callbacks).to.have.property('test_event1').that.is.a('object')
    expect(events.callbacks).to.have.property('test_event2').that.is.a('object')
    expect(events.callbacks).to.have.nested.property('test_event1.next.callback', func1)
    events.on('test_event1', func2)
    expect(events.callbacks).to.have.nested.property('test_event1.next.next.callback', func2)
  })

  it('trigger events', () => {
    const events = new Events()
    let i = 0
    events.on('test_event', () => {
      i++
    })
    events.trigger('test_event')
    events.trigger('test_event')
    events.trigger('test_event')

    expect(i).to.be.equal(3)

    events.on('test_event1', (arg) => {
      i = arg
    })

    events.trigger('test_event1', 888)

    expect(i).to.be.equal(888)
  })

  it('off events', () => {
    const events = new Events()
    const func1 = () => {}
    const func2 = () => {}
    events.on('test_event1 test_event2', func1)
    expect(events.callbacks).to.have.property('test_event1').that.is.a('object')
    expect(events.callbacks).to.have.property('test_event2').that.is.a('object')
    events.off('test_event1')
    expect(events.callbacks).not.to.have.property('test_event1')
    events.on('test_event1', func1)
    events.on('test_event1', func2)
    expect(events.callbacks).to.have.nested.property('test_event1.next.callback', func1)
    expect(events.callbacks).to.have.nested.property('test_event1.next.next.callback', func2)
    events.off('test_event1', func1)
    expect(events.callbacks).to.have.nested.property('test_event1.next.callback', func2)
    expect(events.callbacks).to.deep.have.nested.property('test_event1.next.next', {})
  })
})
