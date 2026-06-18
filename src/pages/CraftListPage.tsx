import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { filterCrafts, getAllCategories } from '../data/crafts';
import CraftCard from '../components/CraftCard';
import type { CraftCategory } from '../types/craft';

/**
 * 技艺列表页
 */
export default function CraftListPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CraftCategory | 'all'>('all');
  const categories = useMemo(() => getAllCategories(), []);

  const filteredCrafts = useMemo(() => {
    return filterCrafts({ keyword, category: selectedCategory });
  }, [keyword, selectedCategory]);

  const hasActiveFilter = keyword.trim() !== '' || selectedCategory !== 'all';

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
  };

  return (
    <div>
      <section className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-heritage-900 sm:text-4xl">
          非遗技艺流程分步浏览
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          选择一门传统技艺，按步骤了解其制作流程与工艺要点。
        </p>
      </section>

      <section className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索技艺名称或简介..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-heritage-500 focus:outline-none focus:ring-2 focus:ring-heritage-500/20"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="清除搜索"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <FunnelIcon className="h-5 w-5 shrink-0 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CraftCategory | 'all')}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-heritage-500 focus:outline-none focus:ring-2 focus:ring-heritage-500/20 sm:w-auto"
            >
              <option value="all">全部分类</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilter && (
          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex-1 break-words">
              找到 <span className="font-medium text-heritage-600">{filteredCrafts.length}</span> 个结果
              {keyword && (
                <span>
                  ，关键词：<span className="font-medium text-heritage-600">「{keyword}」</span>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span>
                  ，分类：<span className="font-medium text-heritage-600">「{selectedCategory}」</span>
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="self-end text-heritage-600 hover:text-heritage-700 hover:underline sm:self-auto"
            >
              清除筛选
            </button>
          </div>
        )}
      </section>

      {filteredCrafts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredCrafts.map((craft) => (
            <CraftCard key={craft.id} craft={craft} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">暂无匹配结果</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            {hasActiveFilter
              ? '没有找到符合条件的技艺，请尝试调整搜索关键词或更换分类筛选条件。'
              : '暂无技艺数据，请稍后再试。'}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center rounded-lg bg-heritage-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-heritage-700"
            >
              清除筛选条件
            </button>
          )}
        </div>
      )}
    </div>
  );
}
