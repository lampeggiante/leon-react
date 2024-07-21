/** 实现 react 的渲染更新 */

import { Action } from "shared/types/ReactTypes"

/** 保留更新的 Action */
export interface Update<State> {
  action: Action<State>
}

/** 共用的更新状态 */
export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  }
}

/** 创建一个新的更新行为 */
export function createUpdate<State>(action: Action<State>): Update<State> {
  /** TODO */
  return {
    action
  }
}

/** 创建一个新的更新队列 */
export function createUpdateQueue<Action>() {
  return {
    shared: {
      pending: null
    }
  } as UpdateQueue<Action>
}

/** 将更新行为加入到更新队列中 */
export function enqueueUpdate<State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State> | null
) {
  updateQueue.shared.pending = update
}

/** 处理正在工作的更新行为 */
export function processUpdateQueue<State>(
  baseState: State,
  pendingQueue: Update<State> | null
): { memorizedState: State } {
  const ans: ReturnType<typeof processUpdateQueue<State>> = {
    memorizedState: baseState
  }

  if (pendingQueue) {
    const action = pendingQueue.action
    if (action instanceof Function) {
      ans.memorizedState = action(baseState)
    } else {
      ans.memorizedState = action
    }
  }

  return ans
}
