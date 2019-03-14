type SetStateAction<S> = S | ((prevState: S) => S)

type Dispatch<A> = (value: A) => void

type EffectCallback = () => (void | (() => void))

type Inputs = ReadonlyArray<unknown>

type Reducer<S, A> = (prevState: S, action: A) => S

export function useState<S> (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  return []
}

export function useReducer<S, A> (reducer: Reducer<S, A>, initialState: S): [S, (action: A) => void] {
  return []
}

export function useEffect (effect: EffectCallback, inputs?: Inputs): void {

}

export function useLayoutEffect (effect: EffectCallback, inputs?: Inputs): void {

}
