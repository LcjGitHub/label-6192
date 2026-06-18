import { useState, useEffect, useCallback } from 'react';
import {
  getCompareIds,
  isInCompare as checkInCompare,
  addToCompare,
  removeFromCompare,
  toggleCompare as toggleCmp,
  clearCompare,
  subscribe,
  MAX_COMPARE_COUNT,
} from '../utils/compare';

/**
 * 技艺对比功能 React Hook
 *
 * 将底层基于 `localStorage` 的对比工具封装为响应式 Hook，
 * 供任意组件使用。Hook 会在组件挂载时自动订阅对比变更事件，
 * 在任意位置修改对比后，所有使用该 Hook 的组件都会同步刷新。
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ids, isInCompare, toggleCompare, isFull, count } = useCompare();
 *   return (
 *     <button
 *       onClick={() => toggleCompare('some-id')}
 *       disabled={!isInCompare('some-id') && isFull}
 *     >
 *       {isInCompare('some-id') ? '移出对比' : '加入对比'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns 对比状态与操作方法：
 * - `ids`：响应式的已选对比 id 数组（最多 2 项）
 * - `count`：已选对比数量（0 ~ 2）
 * - `isFull`：是否已达到最大对比数量
 * - `maxCount`：最大对比数量（恒为 2）
 * - `isInCompare(id)`：查询某个 id 是否已加入对比
 * - `addToCompare(id)`：加入对比（已满或重复则返回 false）
 * - `removeFromCompare(id)`：从对比中移除
 * - `toggleCompare(id)`：切换对比状态（已满时无法加入）
 * - `clearAll()`：清空所有对比选择
 */
export function useCompare() {
  const [ids, setIds] = useState<string[]>(() => getCompareIds());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setIds(getCompareIds());
    });
    return unsubscribe;
  }, []);

  const isInCompare = useCallback((id: string) => checkInCompare(id), []);
  const add = useCallback((id: string) => addToCompare(id), []);
  const remove = useCallback((id: string) => removeFromCompare(id), []);
  const toggle = useCallback((id: string) => toggleCmp(id), []);
  const clearAll = useCallback(() => clearCompare(), []);

  return {
    ids,
    count: ids.length,
    isFull: ids.length >= MAX_COMPARE_COUNT,
    maxCount: MAX_COMPARE_COUNT,
    isInCompare,
    addToCompare: add,
    removeFromCompare: remove,
    toggleCompare: toggle,
    clearAll,
  };
}
