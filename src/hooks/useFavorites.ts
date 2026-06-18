import { useState, useEffect, useCallback } from 'react';
import {
  getFavoriteIds,
  isFavorite as checkFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite as toggleFav,
  subscribe,
} from '../utils/favorites';

/**
 * 收藏功能 React Hook
 *
 * 将底层基于 `localStorage` 的收藏工具封装为响应式 Hook，
 * 供任意组件使用。Hook 会在组件挂载时自动订阅收藏变更事件，
 * 在任意位置修改收藏后，所有使用该 Hook 的组件都会同步刷新。
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ids, isFavorite, toggleFavorite } = useFavorites();
 *   return (
 *     <button onClick={() => toggleFavorite('some-id')}>
 *       {isFavorite('some-id') ? '已收藏' : '收藏'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns 收藏状态与操作方法：
 * - `ids`：响应式的已收藏 id 数组
 * - `isFavorite(id)`：查询某个 id 是否已收藏
 * - `addFavorite(id)`：加入收藏
 * - `removeFavorite(id)`：取消收藏
 * - `toggleFavorite(id)`：切换收藏状态
 */
export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => getFavoriteIds());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setIds(getFavoriteIds());
    });
    return unsubscribe;
  }, []);

  const isFavorite = useCallback((id: string) => checkFavorite(id), []);
  const add = useCallback((id: string) => addFavorite(id), []);
  const remove = useCallback((id: string) => removeFavorite(id), []);
  const toggle = useCallback((id: string) => toggleFav(id), []);

  return {
    ids,
    isFavorite,
    addFavorite: add,
    removeFavorite: remove,
    toggleFavorite: toggle,
  };
}
