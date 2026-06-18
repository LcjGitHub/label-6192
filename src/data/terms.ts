import type { Term, TermFilterParams } from '../types/term';
import termsData from '../mock/terms.json';

const terms = termsData as Term[];

/**
 * 获取全部术语列表
 */
export function getAllTerms(): Term[] {
  return terms;
}

/**
 * 根据关键词搜索术语
 * 按术语名称、释义和关联技艺名称模糊匹配
 */
export function filterTerms(params: TermFilterParams): Term[] {
  const { keyword = '' } = params;
  const trimmedKeyword = keyword.trim().toLowerCase();

  if (!trimmedKeyword) {
    return terms;
  }

  return terms.filter((term) => {
    const matchesName = term.name.toLowerCase().includes(trimmedKeyword);
    const matchesDefinition = term.definition.toLowerCase().includes(trimmedKeyword);
    const matchesRelatedCraft = term.relatedCraftNames.some((craftName) =>
      craftName.toLowerCase().includes(trimmedKeyword),
    );

    return matchesName || matchesDefinition || matchesRelatedCraft;
  });
}
