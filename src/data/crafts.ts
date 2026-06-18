import type { Craft, CraftCategory, CraftFilterParams } from '../types/craft';
import { CATEGORY_ORDER } from '../types/craft';
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
 * 获取所有分类列表（按固定顺序展示）
 */
export function getAllCategories(): CraftCategory[] {
  const availableCategories = new Set(crafts.map((craft) => craft.category));
  return CATEGORY_ORDER.filter((category) => availableCategories.has(category));
}

/**
 * 根据关键词和分类筛选技艺
 * @param params 筛选参数
 * @param params.keyword 关键词，按名称和简介模糊匹配
 * @param params.category 分类，'all' 表示全部分类
 * @param source 可选，指定筛选的数据源；不传则使用完整的 crafts 列表
 */
export function filterCrafts(params: CraftFilterParams, source?: Craft[]): Craft[] {
  const { keyword = '', category = 'all' } = params;
  const trimmedKeyword = keyword.trim().toLowerCase();
  const data = source ?? crafts;

  return data.filter((craft) => {
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

/**
 * 按技艺名称和简介进行搜索（专用搜索工具函数）
 * @param keyword 搜索关键词
 * @param source 可选，指定搜索的数据源；不传则使用完整的 crafts 列表
 * @returns 匹配的技艺列表
 */
export function searchCrafts(keyword: string, source?: Craft[]): Craft[] {
  const trimmedKeyword = keyword.trim().toLowerCase();
  const data = source ?? crafts;

  if (!trimmedKeyword) {
    return data;
  }

  return data.filter((craft) => {
    return (
      craft.name.toLowerCase().includes(trimmedKeyword) ||
      craft.summary.toLowerCase().includes(trimmedKeyword)
    );
  });
}
