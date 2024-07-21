import { REACT_ELEMENT_TYPE } from "shared/types/ReactSymbols"
import {
  Type,
  Key,
  Ref,
  Props,
  ReactElementType,
  ElementType
} from "shared/types/ReactTypes"

/* ReactElement */
export function ReactElement(
  type: Type,
  key: Key,
  ref: Ref,
  props: Props
): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: "leon"
  }
  return element
}

/* jsx */
export function jsx(type: ElementType, config: any, ...children: any[]) {
  let key: Key = null
  let ref: Ref = null
  const props: any = {}

  for (const prop in config) {
    const val = config[prop]
    switch (prop) {
      case "key":
        val && (key = String(val))
        break
      case "ref":
        val && (ref = val)
        break
      default:
        Object.hasOwnProperty.call(config, prop) && (props[prop] = val)
    }
  }

  const len = children.length
  if (len) {
    props.children = len === 1 ? children[0] : children
  }
  return ReactElement(type, key, ref, props)
}

export const jsxDEV = function (type: ElementType, config: any) {
  let key: Key = null
  let ref: Ref = null
  const props: any = {}

  for (const prop in config) {
    const val = config[prop]
    switch (prop) {
      case "key":
        val && (key = String(val))
        break
      case "ref":
        val && (ref = val)
        break
      default:
        Object.hasOwnProperty.call(config, prop) && (props[prop] = val)
    }
  }

  return ReactElement(type, key, ref, props)
}
