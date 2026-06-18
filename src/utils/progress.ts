import type { CraftProgressMap, ProgressListener } from '../types/craft';

/**
 * 学习进度功能底层工具模块
 *
 * 基于浏览器 `localStorage` 持久化用户对非遗技艺的学习进度，
 * 以技艺唯一 `id` 为键，记录已学习的最高步骤序号。
 *
 * 存储结构：`Record<string, number>` —— 键为技艺 id，值为已学最高步骤序号（从 1 开始）
 * 存储键名：`heritage-craft-progress`，通过常量 `STORAGE_KEY` 统一管理。
 *
 * 设计要点：
 * 1. 所有读取操作均使用 try/catch 兜底，避免隐私模式或存储异常导致页面崩溃；
 * 2. 写入操作在状态真的发生变化时才会执行，并触发订阅通知；
 * 3. 订阅机制采用发布—订阅模式，便于在任意组件监听进度变更从而刷新 UI；
 * 4. 只记录「已看过的最高步骤」，即用户看到第 N 步时，前 N-1 步视为已学。
 */

/** localStorage 中进度数据的存储键 */
const STORAGE_KEY = 'heritage-craft-progress';
/** localStorage 中浏览位置数据的存储键 */
const VIEW_POSITION_KEY = 'heritage-craft-view-position';

/** 进度变更监听器类型 */
type Listener = ProgressListener;

/** 活跃的监听器集合 */
const listeners: Set<Listener> = new Set();

/**
 * 从 localStorage 读取进度数据
 * @returns 进度记录对象；读取失败或无数据时返回空对象
 */
function readProgress(): CraftProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      const result: CraftProgressMap = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'number' && value >= 0) {
          result[key] = value;
        }
      }
      return result;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * 将进度数据写入 localStorage
 * @param progress 待写入的进度对象
 */
function writeProgress(progress: CraftProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage errors (quota, privacy mode, etc.)
  }
}

/**
 * 向所有订阅者广播进度变更事件
 */
function notify(): void {
  listeners.forEach((fn) => fn());
}

/**
 * 获取指定技艺的学习进度
 * @param craftId 技艺 id
 * @returns 已学习的最高步骤序号（从 1 开始），未学习过返回 0
 */
export function getProgress(craftId: string): number {
  const progress = readProgress();
  return progress[craftId] ?? 0;
}

/**
 * 获取所有技艺的学习进度
 * @returns 所有进度记录对象
 */
export function getAllProgress(): CraftProgressMap {
  return readProgress();
}

/**
 * 更新指定技艺的学习进度
 * @remarks 仅当新步骤序号大于已记录的最高序号时才更新，确保进度不会倒退
 * @param craftId 技艺 id
 * @param stepOrder 当前浏览的步骤序号（从 1 开始）
 * @returns 是否真的更新了进度
 */
export function updateProgress(craftId: string, stepOrder: number): boolean {
  const progress = readProgress();
  const current = progress[craftId] ?? 0;
  if (stepOrder > current) {
    progress[craftId] = stepOrder;
    writeProgress(progress);
    notify();
    return true;
  }
  return false;
}

/**
 * 重置指定技艺的学习进度
 * @param craftId 技艺 id
 */
export function resetProgress(craftId: string): void {
  const progress = readProgress();
  if (progress[craftId] !== undefined) {
    delete progress[craftId];
    writeProgress(progress);
    notify();
  }
}

/**
 * 清空所有学习进度
 */
export function clearAllProgress(): void {
  const progress = readProgress();
  if (Object.keys(progress).length > 0) {
    writeProgress({});
    notify();
  }
}

/**
 * 订阅进度变更事件
 *
 * @example
 * ```ts
 * const unsubscribe = subscribe(() => {
 *   console.log('progress changed');
 * });
 * // 不再需要时调用取消订阅
 * unsubscribe();
 * ```
 *
 * @param listener 进度变更时触发的回调函数
 * @returns 取消订阅函数，调用后移除该监听器
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * 从 localStorage 读取浏览位置数据
 * @returns 浏览位置记录对象；读取失败或无数据时返回空对象
 */
function readViewPosition(): CraftProgressMap {
  try {
    const raw = localStorage.getItem(VIEW_POSITION_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      const result: CraftProgressMap = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'number' && value >= 0) {
          result[key] = value;
        }
      }
      return result;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * 将浏览位置数据写入 localStorage
 * @param viewPosition 待写入的浏览位置对象
 */
function writeViewPosition(viewPosition: CraftProgressMap): void {
  try {
    localStorage.setItem(VIEW_POSITION_KEY, JSON.stringify(viewPosition));
  } catch {
    // ignore storage errors (quota, privacy mode, etc.)
  }
}

/**
 * 获取指定技艺的浏览位置
 * @param craftId 技艺 id
 * @returns 最后浏览的步骤序号（从 1 开始），未浏览过返回 0
 */
export function getViewPosition(craftId: string): number {
  const viewPosition = readViewPosition();
  return viewPosition[craftId] ?? 0;
}

/**
 * 获取所有技艺的浏览位置
 * @returns 所有浏览位置记录对象
 */
export function getAllViewPosition(): CraftProgressMap {
  return readViewPosition();
}

/**
 * 设置指定技艺的浏览位置
 * @remarks 与学习进度不同，浏览位置支持后退，记录用户最后看到的步骤
 * @param craftId 技艺 id
 * @param stepOrder 当前浏览的步骤序号（从 1 开始）
 * @returns 是否真的更新了浏览位置
 */
export function setViewPosition(craftId: string, stepOrder: number): boolean {
  const viewPosition = readViewPosition();
  const current = viewPosition[craftId] ?? 0;
  if (stepOrder !== current) {
    viewPosition[craftId] = stepOrder;
    writeViewPosition(viewPosition);
    notify();
    return true;
  }
  return false;
}

/**
 * 重置指定技艺的浏览位置
 * @param craftId 技艺 id
 */
export function resetViewPosition(craftId: string): void {
  const viewPosition = readViewPosition();
  if (viewPosition[craftId] !== undefined) {
    delete viewPosition[craftId];
    writeViewPosition(viewPosition);
    notify();
  }
}

/**
 * 清空所有浏览位置
 */
export function clearAllViewPosition(): void {
  const viewPosition = readViewPosition();
  if (Object.keys(viewPosition).length > 0) {
    writeViewPosition({});
    notify();
  }
}
