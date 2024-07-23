import type { FiberNode } from "./fiber"
import { MutationMask, NoFlags, Placement } from "./fiberFlags"

let nextEffect: FiberNode | null = null
export function commitMutationEffects(finishedWork: FiberNode) {
  nextEffect = finishedWork

  while (nextEffect) {
    const child: FiberNode | null = nextEffect.child
    if ((nextEffect.subTreeFlags & MutationMask) !== NoFlags && child) {
      /** 需要继续向下操作 */
      nextEffect = child
    } else {
      /** 向上遍历 */
      up: while (nextEffect) {
        commitMutationEffectsOnFiber(nextEffect)
        const sibling: FiberNode | null = nextEffect.sibling

        if (sibling) {
          nextEffect = sibling
          break up
        }
        nextEffect = nextEffect.return
      }
    }
  }
}

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
  const { flags } = finishedWork
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork)
    finishedWork.flags &= ~Placement
  }
}

function commitPlacement(finishedWork: FiberNode) {}
