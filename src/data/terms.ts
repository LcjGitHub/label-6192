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
 * 按术语名称和释义模糊匹配
 */
export function filterTerms(params: TermFilterParams): Term[] {
  const { keyword = '' } = params;
  const trimmedKeyword = keyword.trim().toLowerCase();

  if (!trimmedKeyword) {
    return terms;
  }

  return terms.filter((term) => {
    return (
      term.name.toLowerCase().includes(trimmedKeyword) ||
      term.definition.toLowerCase().includes(trimmedKeyword)
    );
  });
}
