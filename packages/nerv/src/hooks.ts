import { isFunction, isUndefined, nextTick, isArray, objectIs } from 'nerv-utils'
import Current from './current-owner'
import { isNullOrUndef } from 'nerv-shared'
import Component from './component'
import { RefObject } from './create-ref'
import { Context } from './create-context'
import { enqueueRender } from './render-queue'

function getHooks (index: number): Hook {
  if (Current.current === null) {
    throw new Error(`invalid hooks call: hooks can only be called in a stateless component.`)
  }
  const hooks = Current.current.hooks
  if (index >= hooks.length) {
    hooks.push({} as any)
  }
  return hooks[index]
}

type SetStateAction<S> = S | ((prevState: S) => S)

type Dispatch<A> = (value: A) => void

type EffectCallback = () => (void | (() => void))

type DependencyList = ReadonlyArray<any>

type Reducer<S, A> = (prevState: S, action: A) => S

type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never

type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never

export interface HookEffect {
  deps?: DependencyList
  effect: EffectCallback
  cleanup?: Function
}

export interface HookState<S> {
  component: Component<any, any>
  state: [S, Dispatch<SetStateAction<S>>]
}

export interface HookRef<T> {
  ref?: RefObject<T>
}

export interface HookReducer<R extends Reducer<any, any>, I> {
  component: Component<any, any>
  state: [ReducerState<R>, Dispatch<ReducerAction<R>>]
}

export interface HookCallback<T> {
  deps?: DependencyList
  callback: Function
  value: T
}

export interface HookContext {
  context?: true
}

// tslint:disable-next-line:max-line-length
export type Hook = HookEffect & HookState<unknown> & HookReducer<any, unknown> & HookRef<unknown> & HookCallback<any> & HookContext

export function useState<S> (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  if (isFunction(initialState)) {
    initialState = initialState()
  }
  const hook = getHooks(Current.index++) as HookState<S>
  if (!hook.state) {
    hook.component = Current.current!
    hook.state = [
      initialState,
      (action) => {
        hook.state[0] = isFunction(action) ? action(hook.state[0]) : action
        hook.component._disable = false
        hook.component.setState({})
      }
    ]
  }
  return hook.state
}

export function useReducer<R extends Reducer<any, any>, I> (
  reducer: R,
  initialState: I & ReducerState<R>,
  initializer?: (arg: I & ReducerState<R>) => ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  if (isFunction(initialState)) {
    initialState = initialState()
  }
  const hook = getHooks(Current.index++) as HookReducer<R, I>
  if (!hook.state) {
    hook.component = Current.current!
    hook.state = [
      isUndefined(initializer) ? initialState : initializer(initialState),
      (action) => {
        hook.state[0] = reducer(hook.state[0], action)
        hook.component._disable = false
        hook.component.setState({})
      }
    ]
  }
  return hook.state
}

function areDepsChanged (prevDeps?: DependencyList, deps?: DependencyList) {
  if (isNullOrUndef(prevDeps) || isNullOrUndef(deps)) {
    return true
  }
  return deps.some((d, i) => !objectIs(d, prevDeps[i]))
}

export function invokeEffects (component: Component<any, any>, delay: boolean = false) {
  const effects = delay ? component.effects : component.layoutEffects
  effects.forEach((hook) => {
    if (isFunction(hook.cleanup)) {
      hook.cleanup()
    }
    const result = hook.effect()
    if (isFunction(result)) {
      hook.cleanup = result
    }
  })

  if (delay) {
    component.effects = []
  } else {
    component.layoutEffects = []
  }
}

let scheduleEffectComponents: Array<Component<any, any>> = []

function invokeScheduleEffects (component: Component) {
  if (!component._afterScheduleEffect) {
    component._afterScheduleEffect = true
    scheduleEffectComponents.push(component)
    if (scheduleEffectComponents.length === 1) {
      nextTick(() => {
        setTimeout(() => {
          scheduleEffectComponents.forEach((c) => {
            c._afterScheduleEffect = false
            invokeEffects(c, true)
          })
          scheduleEffectComponents = []
        }, 0)
      })
    }
  }
}

function useEffectImpl (effect: EffectCallback, deps?: DependencyList, delay: boolean = false) {
  const hook = getHooks(Current.index++)
  if (areDepsChanged(hook.deps, deps)) {
    hook.effect = effect
    hook.deps = deps

    if (delay) {
      Current.current!.effects = Current.current!.effects.concat(hook)
      invokeScheduleEffects(Current.current!)
    } else {
      Current.current!.layoutEffects = Current.current!.layoutEffects.concat(hook)
    }
  }
}

export function useEffect (effect: EffectCallback, deps?: DependencyList): void {
  useEffectImpl(effect, deps, true)
}

export function useLayoutEffect (effect: EffectCallback, deps?: DependencyList): void {
  useEffectImpl(effect, deps)
}

export function useRef<T> (initialValue?: T): RefObject<T> {
  const hook = getHooks(Current.index++) as HookRef<T>
  if (!hook.ref) {
    hook.ref = {
      current: initialValue
    }
  }
  return hook.ref
}

export function useMemo<T> (factory: () => T, deps?: DependencyList): T {
  const hook = getHooks(Current.index++)
  if (areDepsChanged(hook.deps, deps)) {
    hook.deps = deps
    hook.callback = factory
    hook.value = factory()
  }
  return hook.value
}

export function useCallback<T extends (...args: never[]) => unknown> (callback: T, deps: DependencyList): T {
  return useMemo(() => callback, deps)
}

export function useContext<T> (context: Context<T>): T {
  const provider = Current.current!.context[context._id]
  if (isUndefined(provider)) {
    return context._defaultValue
  }
  const hook = getHooks(Current.index++)
  // should update when value changes with shouldComponentUpdate:false Component on top
  if (isUndefined(hook.context)) {
    hook.context = true
    const c = Current.current!
    provider.on(() => enqueueRender(c))
  }
  return provider.value
}

export function useImperativeHandle<T, R extends T> (
  ref: RefObject<T> | undefined,
  init: () => R,
  deps?: DependencyList
): void {
  useLayoutEffect(() => {
    if (isFunction(ref)) {
      ref(init())
      return () => ref(null)
    } else if (!isUndefined(ref)) {
      ref.current = init()
      return () => {
        delete ref.current
      }
    }
  }, isArray(deps) ? deps.concat([ref]) : undefined)
}
