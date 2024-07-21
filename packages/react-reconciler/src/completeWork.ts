import { createInstance, createTextInstance } from "hostConfig"
import { FiberNode } from "./fiber"
import { HostComponent, HostRoot, HostText } from "./workTag"
import { NoFlags } from "./fiberFlags"

/**
 * @summary 回到兄弟节点
 */
export function completeWork(wip: FiberNode) {
  const newProps = wip.pendingProps
  const current = wip.alternate

  switch (wip.tag) {
    case HostComponent:
      if (current && wip.stateNode) {
        /** 此时为更新 TODO */
      } else {
        const instance = createInstance(wip.type, newProps)
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostText:
      if (current && wip.stateNode) {
        /** 此时为更新 TODO */
      } else {
        const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostRoot:
      bubbleProperties(wip)
      return null
    default:
      bubbleProperties(wip)
      if (__DEV__) {
        console.warn("未处理的completeWork情况", wip)
      }
      return null
  }
}

function appendAllChildren(parent: FiberNode, wip: FiberNode) {
  let node = wip.child
  while (node) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendAllChildren(parent, node.stateNode)
    } else if (node.child) {
      node.child.return = node
      node = node.child
      continue
    }
    if (node === wip) return

    while (!node.silbing) {
      if (!node.return || node.return === wip) return
      node = node.return
    }
    node.silbing.return = node.return
    node = node.silbing
  }
}

function bubbleProperties(wip: FiberNode) {
  let subTreeFlags = NoFlags
  let child = wip.child
  while (child) {
    subTreeFlags |= child.subTreeFlags
    subTreeFlags |= child.flags
    child.return = wip
    child = child.silbing
  }
  wip.subTreeFlags |= subTreeFlags
}
