import { Emiter } from './emiter'
import Component from './component'
import { isUndefined } from 'nerv-utils'

export let uid = 0

function onlyChild (children) {
  return Array.isArray(children) ? children[0] : children
}

export interface ProviderProps<T> {
  value: T
}

export interface ConsumerProps {
  children: Function
}

export interface ConsumerState<T> {
  value: T
}

export type IProvider<T> = Component<ProviderProps<T>>
export type IConsumer<T> = Component<ConsumerProps, ConsumerState<T>>

export interface Context<T> {
  Provider: IProvider<T>
  Consumer: IConsumer<T>
}

export function createContext<T> (defaultValue: T): Context<T> {
  const contextProp = '__context_' + uid++ + '__'

  class Provider extends Component<ProviderProps<T>> {
    emiter = new Emiter(this.props.value)

    getChildContext () {
      return {
        [contextProp]: this.emiter
      }
    }

    componentWillReceiveProps (nextProps: ProviderProps<T>) {
      if (this.props.value !== nextProps.value) {
        this.emiter.set(nextProps.value)
      }
    }

    render () {
      return this.props.children
    }
  }

  // tslint:disable-next-line: max-classes-per-file
  class Consumer extends Component<ConsumerProps, ConsumerState<T>> {
    state = {
      value: this.getContextValue()
    }

    context: {
      [contextProp: string]: Emiter<T> | undefined
    }

    componentWillMount () {
      const emiter = this.context[contextProp]
      if (emiter) {
        emiter.off(this.onUpdate)
      }
    }

    componentDidMount () {
      const emiter = this.context[contextProp]
      if (emiter) {
        emiter.on(this.onUpdate)
      }
    }

    onUpdate = (value: T) => {
      if (value !== this.state.value) {
        this.setState({
          value: this.getContextValue()
        })
      }
    }

    getContextValue (): T {
      const emiter = this.context[contextProp]
      return isUndefined(emiter) ? defaultValue : emiter.value
    }

    render () {
      return onlyChild(this.props.children)(this.state.value)
    }
  }

  return {
    Provider,
    Consumer
  } as any
}
