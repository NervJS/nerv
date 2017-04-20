import { isVNode, isVText, isThunk } from './types'

function handleThunk (a, b) {
  let renderedA = a
  let renderedB = b

  if (isThunk(b)) {
    renderedB = renderThunk(b, a)
  }

  if (isThunk(a)) {
    renderedA = renderThunk(a, null)
  }

  return {
    a: renderedA,
    b: renderedB
  }
}

function renderThunk(thunk, previous) {
  let renderedThunk = thunk.vnode

  if (!renderedThunk) {
    renderedThunk = thunk.vnode = thunk.render(previous)
  }

  if (!(isVNode(renderedThunk) ||
      isVText(renderedThunk))) {
    throw new Error('thunk did not return a valid node')
  }

  return renderedThunk
}

export default handleThunk