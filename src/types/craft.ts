/**
 * 技艺分类
 */
export type CraftCategory = '剪纸类' | '染织类' | '陶瓷类' | '木作类' | '刺绣类' | '编织类';

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
