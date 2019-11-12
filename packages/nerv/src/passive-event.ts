const defaultOptions = {
  passive: false,
  capture: false
}

const eventListenerOptionsSupported = () => {
  let supported = false

  try {
    const opts = Object.defineProperty({}, 'passive', {
      get () {
        supported = true
      }
    })
    window.addEventListener('test', null as any, opts)
    window.removeEventListener('test', null as any, opts)
  } catch (e) {
    supported = false
  }

  return supported
}

function getDefaultPassiveOption () {
  const passiveOption = !eventListenerOptionsSupported() ? false : defaultOptions
  return () => {
    return passiveOption
  }
}

const getPassiveOption = getDefaultPassiveOption()

export const supportedPassiveEventMap = {
  scroll: getPassiveOption(),
  wheel: getPassiveOption(),
  touchstart: getPassiveOption(),
  touchmove: getPassiveOption(),
  touchenter: getPassiveOption(),
  touchend: getPassiveOption(),
  touchleave: getPassiveOption(),
  mouseout: getPassiveOption(),
  mouseleave: getPassiveOption(),
  mouseup: getPassiveOption(),
  mousedown: getPassiveOption(),
  mousemove: getPassiveOption(),
  mouseenter: getPassiveOption(),
  mousewheel: getPassiveOption(),
  mouseover: getPassiveOption()
}
