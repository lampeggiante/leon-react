import { ReactElementType } from "shared/types/ReactTypes"
import { FiberNode } from "./fiber"
import { processUpdateQueue, UpdateQueue } from "./updateQueue"
import { HostComponent, HostRoot, HostText } from "./workTag"
import { mountChildFibers, reconcileChildFibers } from "./childFibers"

/**
 * @summary 查找子节点
 */
export function beginWork(wip: FiberNode) {
  switch (wip.type) {
    case HostRoot:
      return updateHostRoot(wip)
    case HostComponent:
      return updateHostComponent(wip)
    case HostText:
      return null
    default:
      if (__DEV__) {
        console.warn("beginWork未实现的类型")
      }
      return null
  }
}

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memorizedState
  const updateQueue = wip.updateQueue as UpdateQueue<Element>
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null
  const { memorizedState } = processUpdateQueue(baseState, pending)
  wip.memorizedState = memorizedState
  const nextChildren = wip.memorizedState
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate
  if (current) {
    /** update流程 */
    wip.child = reconcileChildFibers(wip, current.child, children)
  } else {
    /** mount */
    wip.child = mountChildFibers(wip, null, children)
  }
}
