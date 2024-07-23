import { beginWork } from "./beginWork"
import { commitMutationEffects } from "./commitWork"
import { completeWork } from "./completeWork"
import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber"
import { MutationMask, NoFlags } from "./fiberFlags"
import { HostRoot } from "./workTag"

let workInProgress: FiberNode | null = null

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  /** 调度功能 */
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root)
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber
  let parent = node.return
  while (parent) {
    node = parent
    parent = node.return
  }
  /** 此时到了hostRootFiber */
  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {})
}

function renderRoot(root: FiberRootNode) {
  /** 初始化 */
  prepareFreshStack(root)

  while (true) {
    try {
      workLoop()
      break
    } catch (e) {
      if (__DEV__) {
        console.log("workLoop发生错误", e)
      }
      workInProgress = null
    }
  }
  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork
  /** wip fiberNode 树执行树中的具体操作 */
  commitRoot(root)
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork

  if (!finishedWork) return

  if (__DEV__) {
    console.warn("commit阶段开始", finishedWork)
  }

  root.finishedWork = null

  /** 三个子阶段是否存在三个子阶段要执行的操作 */
  const subTreeHasEffect =
    (finishedWork.subTreeFlags & MutationMask) !== NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags

  if (subTreeHasEffect || rootHasEffect) {
    /** beforeMutation */

    /** mutation Placement */
    root.current = finishedWork
    commitMutationEffects(finishedWork)

    /** layout */
  } else {
    root.current = finishedWork
  }
}

function workLoop() {
  while (workInProgress) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber)
  fiber.memorizedProps = fiber.pendingProps
  if (!next) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = next
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber
  while (node) {
    completeWork(node)
    const sibling = node.sibling
    if (sibling) {
      workInProgress = sibling
      return
    }
    node = node.return
    workInProgress = node
  }
}
