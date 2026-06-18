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
  steps: CraftStep[];
}
