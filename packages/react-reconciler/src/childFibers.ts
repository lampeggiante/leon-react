import { ReactElementType } from "shared/types/ReactTypes"
import { createFiberFromElement, FiberNode } from "./fiber"
import { REACT_ELEMENT_TYPE } from "shared/types/ReactSymbols"
import { HostText } from "./workTag"
import { Placement } from "./fiberFlags"

function childReconciler(shouldTrachEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType
  ) {
    /** 根据 element 创建 fiber */
    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number
  ) {
    const fiber = new FiberNode(HostText, { content }, null)
    fiber.return = returnFiber
    return fiber
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrachEffects && !fiber.alternate) {
      /** 首屏渲染 */
      fiber.flags |= Placement
    }
    return fiber
  }

  return function reconcileChilFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElementType
  ) {
    if (typeof newChild === "object" && newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          )
        default:
          if (__DEV__) {
            console.warn("未实现的reconcile类型", newChild)
          }
          break
      }
    }
    /** HostText */
    if (typeof newChild === "string" || typeof newChild === "number") {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild)
      )
    }

    if (__DEV__) {
      console.warn("未实现的reconcile类型", newChild)
    }
    return null
  }
}

export const reconcileChildFibers = childReconciler(true)
export const mountChildFibers = childReconciler(false)
