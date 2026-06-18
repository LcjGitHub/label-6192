import type { Craft } from '../types/craft';
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
