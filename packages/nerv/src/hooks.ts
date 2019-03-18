import { isFunction } from 'nerv-utils'
import Current from './current-owner'

function getHooks (index: number) {
  if (Current.current === null) {
    throw new Error(`invalid hooks call: hooks can only be called in a stateless component.`)
  }
  const hooks = Current.current.hooks
  if (index >= hooks.list.length) {
    hooks.list.push({})
  }
  return hooks.list[index]
}

type SetStateAction<S> = S | ((prevState: S) => S)

type Dispatch<A> = (value: A) => void

type EffectCallback = () => (void | (() => void))

type Inputs = ReadonlyArray<any>

type Reducer<S, A> = (prevState: S, action: A) => S

export function useState<S> (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  if (isFunction(initialState)) {
    initialState = initialState()
  }
  const hook = getHooks(Current.index++)
  if (!hook.value) {
    hook.component = Current.current!
    hook.value = [
      initialState,
      (action: Dispatch<SetStateAction<S>>) => {
        hook.value[0] = isFunction(action) ? action(hook.value[0]) : action
        hook.component._disable = false
        hook.component.setState({})
      }
    ]
  }
  return hook.value
}

export function useReducer<S, A> (reducer: Reducer<S, A>, initialState: S): [S, (action: A) => void] | any {
  return []
}

export function useEffect (effect: EffectCallback, inputs?: Inputs): void {

}

export function useLayoutEffect (effect: EffectCallback, inputs?: Inputs): void {

}
