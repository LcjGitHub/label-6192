import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Transition } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronDownIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { filterTerms, getAllTerms } from '../data/terms';
import { getCraftById } from '../data/crafts';

/**
 * 非遗术语词典页面
 *
 * 以可搜索的术语列表展示非遗相关专业术语，
 * 点击某项可展开查看详细释义及关联技艺，
 * 关联技艺可直接跳转至对应技艺详情页。
 */
export default function TermDictionaryPage() {
  const [keyword, setKeyword] = useState('');
  const allTerms = useMemo(() => getAllTerms(), []);

  const filteredTerms = useMemo(() => {
    return filterTerms({ keyword });
  }, [keyword]);

  const hasKeyword = keyword.trim() !== '';

  const handleClearKeyword = () => {
    setKeyword('');
  };

  return (
    <div>
      <section className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-heritage-900 sm:text-4xl">
          非遗术语词典
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          搜索查询非遗传统工艺相关专业术语，了解其含义及关联技艺。
        </p>
      </section>

      <section className="mb-8">
        <div className="relative mx-auto max-w-2xl">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索术语名称或释义..."
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-heritage-500 focus:outline-none focus:ring-2 focus:ring-heritage-500/20"
          />
          {keyword && (
            <button
              type="button"
              onClick={handleClearKeyword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="清除搜索"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mx-auto mt-4 max-w-2xl text-center text-sm text-gray-500">
          共 <span className="font-medium text-heritage-600">{allTerms.length}</span> 个术语
          {hasKeyword && (
            <span>
              ，匹配 <span className="font-medium text-heritage-600">{filteredTerms.length}</span> 个
              <span>
                ，关键词：<span className="font-medium text-heritage-600">「{keyword}」</span></span>
            </span>
          )}
        </div>
      </section>

      {filteredTerms.length > 0 ? (
        <div className="space-y-3">
          {filteredTerms.map((term) => (
            <Disclosure key={term.id} as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="group flex w-full items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-heritage-300 hover:bg-heritage-50/50 focus:outline-none focus:ring-2 focus:ring-heritage-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-heritage-100 text-heritage-700">
                        <BookOpenIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-heritage-900 group-hover:text-heritage-700">
                          {term.name}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                          {term.definition}
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={[
                        'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200',
                        open ? 'rotate-180 text-heritage-600' : 'group-hover:text-heritage-500',
                      ].join(' ')}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="opacity-0 -translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition duration-150 ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-1"
                  >
                    <Disclosure.Panel className="mt-2 rounded-lg border border-gray-200 bg-heritage-50/30 px-5 py-4 shadow-sm">
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-700">释义</h4>
                        <p className="text-sm leading-relaxed text-gray-700">{term.definition}</p>
                      </div>

                      {term.relatedCraftIds && term.relatedCraftIds.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700">关联技艺</h4>
                          <div className="flex flex-wrap gap-2">
                            {term.relatedCraftIds.map((craftId) => {
                              const craft = getCraftById(craftId);
                              if (!craft) return null;
                              return (
                                <Link
                                  key={craftId}
                                  to={`/craft/${craft.id}`}
                                  className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm text-heritage-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-heritage-100 hover:text-heritage-900 hover:ring-heritage-300"
                                >
                                  <span
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{ backgroundColor: craft.coverColor }}
                                  />
                                  {craft.name}
                                  <ArrowRightIcon className="h-3.5 w-3.5" />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">暂无匹配结果</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            没有找到符合关键词的术语，请尝试调整搜索关键词。
          </p>
          {hasKeyword && (
            <button
              type="button"
              onClick={handleClearKeyword}
              className="mt-4 inline-flex items-center rounded-lg bg-heritage-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-heritage-700"
            >
              清除搜索关键词
            </button>
          )}
        </div>
      )}
    </div>
  );
}
