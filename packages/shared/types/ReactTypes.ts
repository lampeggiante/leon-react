export type Type = any
export type Key = any
export type Ref = any
export type Props = any
export type ElementType = any

export interface ReactElementType {
  $$typeof: symbol | number
  type: ElementType
  key: Key | null
  props: Props
  ref: Ref | null
  __mark: string
}

export type Action<State> = State | ((prevState: State) => State)
