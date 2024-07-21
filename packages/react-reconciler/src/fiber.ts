import { Props, Key, Ref, ReactElementType } from "shared/types/ReactTypes"
import { FunctionComponent, HostComponent, WorkTag } from "./workTag"
import { Flags, NoFlags } from "./fiberFlags"
import { Container } from "hostConfig"

export class FiberNode {
  type: any
  tag: WorkTag
  pendingProps: Props
  key: Key
  stateNode: any
  return: FiberNode | null
  silbing: FiberNode | null
  child: FiberNode | null
  index: number
  ref: Ref | null
  memorizedProps: Props | null
  memorizedState: any
  alternate: FiberNode | null
  flags: Flags
  subTreeFlags: Flags
  updateQueue: unknown

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag
    this.key = key
    this.stateNode = null
    this.type = null
    /** 指向父FiberNode的指针 */
    this.return = null
    /** 指向兄弟节点 */
    this.silbing = null
    /** 指向子节点 */
    this.child = null
    /** 兄弟节点中的序号 */
    this.index = 0
    this.ref = null

    /** 作为工作单元 */
    this.pendingProps = pendingProps
    this.memorizedProps = null
    this.memorizedState = null
    /** 双缓存技术中指向对方的指针 */
    this.alternate = null
    this.flags = NoFlags
    this.subTreeFlags = NoFlags
    this.updateQueue = null
  }
}

export class FiberRootNode {
  container: Container
  current: FiberNode
  finishedWork: FiberNode | null
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.stateNode = this
    this.finishedWork = null
  }
}

export function createWorkInProgress(
  current: FiberNode,
  pendingProps: Props
): FiberNode {
  let wip = current.alternate
  if (!wip) {
    /** 此时为首屏渲染 mount */
    wip = new FiberNode(current.tag, pendingProps, current.key)
  } else {
    wip.pendingProps = pendingProps
    wip.flags = NoFlags
    wip.subTreeFlags = NoFlags
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memorizedProps = current.memorizedProps
  wip.memorizedState = current.memorizedState

  return wip
}

export function createFiberFromElement(element: ReactElementType): FiberNode {
  const { type, key, props } = element
  let fiberTag: WorkTag = FunctionComponent
  if (typeof type === "string") {
    /** 此时为hostComponent */
    fiberTag = HostComponent
  } else if (typeof type === "function" && __DEV__) {
    console.warn("未定义的type类型", element)
  }
  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}
