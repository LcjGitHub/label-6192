import type { Craft, CraftCategory, CraftFilterParams } from '../types/craft';
import craftsData from '../mock/crafts.json';

const crafts = craftsData as Craft[];

/**
 * 获取全部技艺列表
 */
export function getAllCrafts(): Craft[] {
  return crafts;
}

/**
 * 根据 id 获取技艺详情
 */
export function getCraftById(id: string): Craft | undefined {
  return crafts.find((craft) => craft.id === id);
}

/**
 * 获取所有分类列表（去重）
 */
export function getAllCategories(): CraftCategory[] {
  const categories = new Set(crafts.map((craft) => craft.category));
  return Array.from(categories).sort();
}

/**
 * 根据关键词和分类筛选技艺
 * @param params 筛选参数
 * @param params.keyword 关键词，按名称和简介模糊匹配
 * @param params.category 分类，'all' 表示全部分类
 */
export function filterCrafts(params: CraftFilterParams): Craft[] {
  const { keyword = '', category = 'all' } = params;
  const trimmedKeyword = keyword.trim().toLowerCase();

  return crafts.filter((craft) => {
    const matchesCategory = category === 'all' || craft.category === category;

    if (!trimmedKeyword) {
      return matchesCategory;
    }

    const matchesKeyword =
      craft.name.toLowerCase().includes(trimmedKeyword) ||
      craft.summary.toLowerCase().includes(trimmedKeyword);

    return matchesCategory && matchesKeyword;
  });
}
