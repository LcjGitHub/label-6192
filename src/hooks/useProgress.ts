import { useState, useEffect, useCallback } from 'react';
import type { CraftProgressMap } from '../types/craft';
import {
  getAllProgress,
  updateProgress as updateProg,
  resetProgress as resetProg,
  subscribe,
  getViewPosition,
  setViewPosition,
  resetViewPosition,
} from '../utils/progress';

/**
 * 学习进度功能 React Hook
 *
 * 将底层基于 `localStorage` 的进度工具封装为响应式 Hook，
 * 供任意组件使用。Hook 会在组件挂载时自动订阅进度变更事件，
 * 在任意位置修改进度后，所有使用该 Hook 的组件都会同步刷新。
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { getProgress, updateProgress } = useProgress();
 *   const learned = getProgress('some-craft-id');
 *   return (
 *     <button onClick={() => updateProgress('some-craft-id', 3)}>
 *       已学 {learned} 步
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns 进度状态与操作方法：
 * - `progressMap`：响应式的所有进度记录对象
 * - `getProgress(craftId)`：查询某技艺的已学最高步骤数
 * - `updateProgress(craftId, stepOrder)`：更新某技艺的进度（仅前进）
 * - `resetProgress(craftId)`：重置某技艺的进度
 * - `getViewPosition(craftId)`：查询某技艺的最后浏览位置
 * - `setViewPosition(craftId, stepOrder)`：更新某技艺的浏览位置（支持后退）
 * - `resetViewPosition(craftId)`：重置某技艺的浏览位置
 */
export function useProgress() {
  const [progressMap, setProgressMap] = useState<CraftProgressMap>(() => getAllProgress());
  const [viewPositionMap, setViewPositionMap] = useState<CraftProgressMap>(() => {
    const result: CraftProgressMap = {};
    const allProgress = getAllProgress();
    for (const [key] of Object.entries(allProgress)) {
      result[key] = getViewPosition(key);
    }
    return result;
  });

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setProgressMap(getAllProgress());
      setViewPositionMap((prev) => {
        const next: CraftProgressMap = { ...prev };
        const allProgress = getAllProgress();
        for (const [key] of Object.entries(allProgress)) {
          next[key] = getViewPosition(key);
        }
        for (const [key] of Object.entries(prev)) {
          if (!(key in allProgress)) {
            next[key] = getViewPosition(key);
          }
        }
        return next;
      });
    });
    return unsubscribe;
  }, []);

  const getProg = useCallback((craftId: string): number => {
    return progressMap[craftId] ?? 0;
  }, [progressMap]);

  const update = useCallback((craftId: string, stepOrder: number): boolean => {
    return updateProg(craftId, stepOrder);
  }, []);

  const reset = useCallback((craftId: string): void => {
    resetProg(craftId);
  }, []);

  const getViewPos = useCallback((craftId: string): number => {
    return viewPositionMap[craftId] ?? getViewPosition(craftId);
  }, [viewPositionMap]);

  const setViewPos = useCallback((craftId: string, stepOrder: number): boolean => {
    const result = setViewPosition(craftId, stepOrder);
    if (result) {
      setViewPositionMap((prev) => ({ ...prev, [craftId]: stepOrder }));
    }
    return result;
  }, []);

  const resetViewPos = useCallback((craftId: string): void => {
    resetViewPosition(craftId);
  }, []);

  return {
    progressMap,
    getProgress: getProg,
    updateProgress: update,
    resetProgress: reset,
    getViewPosition: getViewPos,
    setViewPosition: setViewPos,
    resetViewPosition: resetViewPos,
  };
}
