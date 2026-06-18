/**
 * 技艺分类
 */
export type CraftCategory = '剪纸类' | '染织类' | '陶瓷类' | '木作类' | '刺绣类' | '编织类';

/**
 * 分类固定展示顺序
 */
export const CATEGORY_ORDER: CraftCategory[] = [
  '剪纸类',
  '染织类',
  '陶瓷类',
  '木作类',
  '刺绣类',
  '编织类',
];

/**
 * 技艺步骤
 */
export interface CraftStep {
  id: string;
  order: number;
  title: string;
  description: string;
  imagePlaceholder: string;
}

/**
 * 非遗技艺
 */
export interface Craft {
  id: string;
  name: string;
  summary: string;
  coverColor: string;
  category: CraftCategory;
  steps: CraftStep[];
}

/**
 * 筛选参数
 */
export interface CraftFilterParams {
  keyword?: string;
  category?: CraftCategory | 'all';
}

/**
 * 学习进度记录
 *
 * 以技艺 id 为键，记录已学习的最高步骤序号（从 1 开始计数）。
 * 例如 `{ 'paper-cutting': 3 }` 表示剪纸技艺已学到第 3 步。
 */
export type CraftProgressMap = Record<string, number>;

/**
 * 进度变更监听器
 */
export type ProgressListener = () => void;
