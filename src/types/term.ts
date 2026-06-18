/**
 * 非遗术语
 */
export interface Term {
  id: string;
  name: string;
  definition: string;
  relatedCraftIds: string[];
  relatedCraftNames: string[];
}

/**
 * 术语筛选参数
 */
export interface TermFilterParams {
  keyword?: string;
}
