const doc = {}

const isBrowser = typeof window !== 'undefined'

export const win = isBrowser ? window : {
  document: doc
}

export const document = win.document || doc
