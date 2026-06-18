/**
 * 技艺对比功能底层工具模块
 *
 * 基于浏览器 `localStorage` 持久化用户选择的对比技艺数据，
 * 最多支持同时对比 2 门技艺，以技艺唯一 `id` 为存储单元，
 * 提供增删查改以及跨组件订阅通知能力。
 *
 * 存储结构：`string[]` —— 已选对比技艺的 id 数组（最多 2 项），使用 JSON 序列化存储。
 * 存储键名：`heritage-craft-compare`，通过常量 `STORAGE_KEY` 统一管理。
 *
 * 设计要点（与 favorites 保持一致的设计风格）：
 * 1. 所有读取操作均使用 try/catch 兜底，避免隐私模式或存储异常导致页面崩溃；
 * 2. 写入操作在状态真的发生变化时才会执行，并触发订阅通知；
 * 3. 订阅机制采用发布—订阅模式，便于在任意组件监听对比变更从而刷新 UI；
 * 4. 强制约束最多只能选择 2 门技艺进行对比。
 */

/** localStorage 中对比数据的存储键 */
const STORAGE_KEY = 'heritage-craft-compare';

/** 最大对比数量 */
export const MAX_COMPARE_COUNT = 2;

/** 对比变更监听器类型 */
type Listener = () => void;

/** 活跃的监听器集合 */
const listeners: Set<Listener> = new Set();

/**
 * 从 localStorage 读取对比 id 列表
 * @returns 已选对比 id 数组（有序，最多 2 项）；读取失败或无数据时返回空数组
 */
function readCompareIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return arr.filter((id) => typeof id === 'string').slice(0, MAX_COMPARE_COUNT);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * 将对比 id 列表写入 localStorage
 * @param ids 待写入的对比 id 数组（会自动截断至最多 2 项）
 */
function writeCompareIds(ids: string[]): void {
  try {
    const trimmed = ids.slice(0, MAX_COMPARE_COUNT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore storage errors (quota, privacy mode, etc.)
  }
}

/**
 * 向所有订阅者广播对比变更事件
 */
function notify(): void {
  listeners.forEach((fn) => fn());
}

/**
 * 获取所有已选对比技艺的 id 列表
 * @returns 已选对比 id 数组（按加入顺序，最多 2 项）
 */
export function getCompareIds(): string[] {
  return readCompareIds();
}

/**
 * 查询指定技艺是否已加入对比
 * @param id 技艺 id
 * @returns true 表示已加入对比，false 表示未加入
 */
export function isInCompare(id: string): boolean {
  return readCompareIds().includes(id);
}

/**
 * 获取当前已选对比数量
 * @returns 已选对比数量（0 ~ 2）
 */
export function getCompareCount(): number {
  return readCompareIds().length;
}

/**
 * 是否已达到最大对比数量
 * @returns true 表示已满（2 项），false 表示还可以添加
 */
export function isCompareFull(): boolean {
  return getCompareCount() >= MAX_COMPARE_COUNT;
}

/**
 * 将指定技艺加入对比
 * @remarks
 * - 若已加入对比则不重复写入，也不会触发变更通知；
 * - 若对比数量已达上限（2 项），则不执行任何操作，返回 false；
 * @param id 技艺 id
 * @returns true 表示成功加入，false 表示加入失败（已满或重复）
 */
export function addToCompare(id: string): boolean {
  const ids = readCompareIds();
  if (ids.includes(id)) return false;
  if (ids.length >= MAX_COMPARE_COUNT) return false;
  ids.push(id);
  writeCompareIds(ids);
  notify();
  return true;
}

/**
 * 将指定技艺从对比中移除
 * @remarks 若未加入对比则不做处理，也不会触发变更通知
 * @param id 技艺 id
 */
export function removeFromCompare(id: string): void {
  const ids = readCompareIds();
  const index = ids.indexOf(id);
  if (index !== -1) {
    ids.splice(index, 1);
    writeCompareIds(ids);
    notify();
  }
}

/**
 * 清空所有对比选择
 */
export function clearCompare(): void {
  const ids = readCompareIds();
  if (ids.length > 0) {
    writeCompareIds([]);
    notify();
  }
}

/**
 * 切换指定技艺的对比状态
 * @remarks
 * - 若已加入对比则移除；
 * - 若未加入且未满则加入；
 * - 若未加入但已满则不做处理
 * @param id 技艺 id
 * @returns 操作后的新状态：true 表示已加入对比，false 表示未加入或已满无法加入
 */
export function toggleCompare(id: string): boolean {
  const ids = readCompareIds();
  const index = ids.indexOf(id);
  if (index !== -1) {
    ids.splice(index, 1);
    writeCompareIds(ids);
    notify();
    return false;
  } else {
    if (ids.length >= MAX_COMPARE_COUNT) return false;
    ids.push(id);
    writeCompareIds(ids);
    notify();
    return true;
  }
}

/**
 * 订阅对比变更事件
 *
 * @example
 * ```ts
 * const unsubscribe = subscribe(() => {
 *   console.log('compare list changed');
 * });
 * // 不再需要时调用取消订阅
 * unsubscribe();
 * ```
 *
 * @param listener 对比变更时触发的回调函数
 * @returns 取消订阅函数，调用后移除该监听器
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
