/**
 * 收藏功能底层工具模块
 *
 * 基于浏览器 `localStorage` 持久化用户对非遗技艺的收藏数据，
 * 以技艺唯一 `id` 为存储单元，提供增删查改以及跨组件订阅通知能力。
 *
 * 存储结构：`string[]` —— 已收藏技艺的 id 数组，使用 JSON 序列化存储。
 * 存储键名：`heritage-craft-favorites`，通过常量 `STORAGE_KEY` 统一管理。
 *
 * 设计要点：
 * 1. 所有读取操作均使用 try/catch 兜底，避免隐私模式或存储异常导致页面崩溃；
 * 2. 写入操作在状态真的发生变化时才会执行，并触发订阅通知；
 * 3. 订阅机制采用发布—订阅模式，便于在任意组件监听收藏变更从而刷新 UI。
 */

/** localStorage 中收藏数据的存储键 */
const STORAGE_KEY = 'heritage-craft-favorites';

/** 收藏变更监听器类型 */
type Listener = () => void;

/** 活跃的监听器集合 */
const listeners: Set<Listener> = new Set();

/**
 * 从 localStorage 读取收藏 id 集合
 * @returns 已收藏 id 的 Set；读取失败或无数据时返回空 Set
 */
function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return new Set(arr.filter((id) => typeof id === 'string'));
    }
    return new Set();
  } catch {
    return new Set();
  }
}

/**
 * 将收藏 id 集合写入 localStorage
 * @param ids 待写入的收藏 id 集合
 */
function writeFavorites(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore storage errors (quota, privacy mode, etc.)
  }
}

/**
 * 向所有订阅者广播收藏变更事件
 */
function notify(): void {
  listeners.forEach((fn) => fn());
}

/**
 * 获取所有已收藏技艺的 id 列表
 * @returns 已收藏 id 数组（按存储顺序）
 */
export function getFavoriteIds(): string[] {
  return Array.from(readFavorites());
}

/**
 * 查询指定技艺是否已收藏
 * @param id 技艺 id
 * @returns true 表示已收藏，false 表示未收藏
 */
export function isFavorite(id: string): boolean {
  return readFavorites().has(id);
}

/**
 * 将指定技艺加入收藏
 * @remarks 若已收藏则不重复写入，也不会触发变更通知
 * @param id 技艺 id
 */
export function addFavorite(id: string): void {
  const set = readFavorites();
  if (!set.has(id)) {
    set.add(id);
    writeFavorites(set);
    notify();
  }
}

/**
 * 将指定技艺从收藏中移除
 * @remarks 若未收藏则不做处理，也不会触发变更通知
 * @param id 技艺 id
 */
export function removeFavorite(id: string): void {
  const set = readFavorites();
  if (set.has(id)) {
    set.delete(id);
    writeFavorites(set);
    notify();
  }
}

/**
 * 切换指定技艺的收藏状态
 * @param id 技艺 id
 * @returns 切换后的新状态：true 表示已收藏，false 表示未收藏
 */
export function toggleFavorite(id: string): boolean {
  const set = readFavorites();
  const next = !set.has(id);
  if (next) {
    set.add(id);
  } else {
    set.delete(id);
  }
  writeFavorites(set);
  notify();
  return next;
}

/**
 * 订阅收藏变更事件
 *
 * @example
 * ```ts
 * const unsubscribe = subscribe(() => {
 *   console.log('favorites changed');
 * });
 * // 不再需要时调用取消订阅
 * unsubscribe();
 * ```
 *
 * @param listener 收藏变更时触发的回调函数
 * @returns 取消订阅函数，调用后移除该监听器
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
