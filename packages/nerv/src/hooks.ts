import { isFunction, isUndefined } from 'nerv-utils'
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

type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never

type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never

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

export function useReducer<R extends Reducer<any, any>, I> (
  reducer: R,
  initialState: I & ReducerState<R>,
  initializer?: (arg: I & ReducerState<R>) => ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  if (isFunction(initialState)) {
    initialState = initialState()
  }
  const hook = getHooks(Current.index++)
  if (!hook.value) {
    hook.component = Current.current!
    hook.value = [
      isUndefined(initializer) ? initialState : initializer(initialState),
      (action: Dispatch<ReducerAction<R>>) => {
        hook.value[0] = reducer(hook.value[0], action)
        hook.component._disable = false
        hook.component.setState({})
      }
    ]
  }
  return hook.value
}

export function useEffect (effect: EffectCallback, inputs?: Inputs): void {

}

export function useLayoutEffect (effect: EffectCallback, inputs?: Inputs): void {

}
