import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, HeartIcon } from '@heroicons/react/24/outline';
import { getAllCategories, getAllCrafts, searchCrafts } from '../data/crafts';
import CraftCard from './CraftCard';
import { useFavorites } from '../hooks/useFavorites';
import type { CraftCategory } from '../types/craft';

interface FavoriteListProps {
  keyword: string;
}

/**
 * 独立的收藏列表展示组件
 *
 * 展示当前用户已收藏的全部技艺，接收外部传入的搜索关键词，
 * 内置分类筛选，筛选范围限定在已收藏数据内；无收藏时给出引导性空状态。
 *
 * 设计要点：
 * 1. 搜索关键词由父组件传入，与全部技艺 Tab 共享搜索状态；
 * 2. 分类筛选独立维护，在 favorites 内做二次过滤；
 * 3. 空状态使用统一的样式规范，与全部列表无结果态保持视觉一致；
 * 4. 通过 useFavorites Hook 订阅收藏变化，任意位置取消收藏会实时反映。
 */
export default function FavoriteList({ keyword }: FavoriteListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CraftCategory | 'all'>('all');
  const categories = useMemo(() => getAllCategories(), []);
  const { ids: favoriteIds } = useFavorites();

  const favoriteCrafts = useMemo(() => {
    const all = getAllCrafts();
    return all.filter((craft) => favoriteIds.includes(craft.id));
  }, [favoriteIds]);

  const filteredFavorites = useMemo(() => {
    const searched = searchCrafts(keyword, favoriteCrafts);
    if (selectedCategory === 'all') {
      return searched;
    }
    return searched.filter((craft) => craft.category === selectedCategory);
  }, [keyword, selectedCategory, favoriteCrafts]);

  const hasActiveFilter = keyword.trim() !== '' || selectedCategory !== 'all';

  const handleClearFilters = () => {
    setSelectedCategory('all');
  };

  if (favoriteIds.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <HeartIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">还没有收藏</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          浏览全部技艺，点击卡片或详情页的爱心图标即可收藏喜欢的技艺。
        </p>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-6">
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

        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex-1 break-words">
            共收藏 <span className="font-medium text-heritage-600">{favoriteIds.length}</span> 项
            {hasActiveFilter && (
              <>
                ，匹配 <span className="font-medium text-heritage-600">{filteredFavorites.length}</span> 项
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
              </>
            )}
          </span>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="self-end text-heritage-600 hover:text-heritage-700 hover:underline sm:self-auto"
            >
              清除分类筛选
            </button>
          )}
        </div>
      </section>

      {filteredFavorites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredFavorites.map((craft) => (
            <CraftCard key={craft.id} craft={craft} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">未找到相关技艺</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            已收藏的技艺中没有符合条件的内容，请尝试调整搜索关键词或更换分类筛选条件。
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center rounded-lg bg-heritage-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-heritage-700"
            >
              清除分类筛选
            </button>
          )}
        </div>
      )}
    </div>
  );
}
