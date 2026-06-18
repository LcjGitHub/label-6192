import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ScaleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { getCraftById } from '../data/crafts';
import { useCompare } from '../hooks/useCompare';
import type { Craft, CraftStep } from '../types/craft';

/**
 * 从描述中截取摘要（前 N 个字符）
 */
function getDescriptionSummary(description: string, maxLength = 60): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + '…';
}

/**
 * 对比卡片头部（技艺概览）
 */
function CompareCraftHeader({
  craft,
  onRemove,
}: {
  craft: Craft;
  slotIndex?: number;
  onRemove: () => void;
}) {

  return (
    <div className="relative overflow-hidden rounded-xl border border-heritage-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
        aria-label="移出对比"
        title="移出对比"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>

      <div
        className="flex h-28 items-center justify-center"
        style={{ backgroundColor: craft.coverColor }}
      >
        <span className="font-serif text-2xl font-bold text-white/95 sm:text-3xl">{craft.name}</span>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: craft.coverColor + '15',
              color: craft.coverColor,
            }}
          >
            {craft.category}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{craft.summary}</p>

        <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <ListBulletIcon className="h-4 w-4" />
            <span>
              共 <span className="font-semibold text-heritage-700">{craft.steps.length}</span> 个步骤
            </span>
          </div>
          <Link
            to={`/craft/${craft.id}`}
            className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-heritage-600 transition hover:text-heritage-800"
          >
            查看详情
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * 空槽位（引导选择技艺）
 */
function EmptyCompareSlot({ slotIndex }: { slotIndex: number }) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
        <PlusIcon className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="mb-1 text-base font-medium text-gray-700">对比槽位 {slotIndex + 1}</h3>
      <p className="max-w-xs text-sm text-gray-500">
        请从技艺列表页选择一门技艺，点击卡片上的「加入对比」按钮添加到此槽位
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-heritage-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-heritage-700"
      >
        <DocumentTextIcon className="h-4 w-4" />
        前往技艺列表
      </Link>
    </div>
  );
}

/**
 * 引导提示组件（未选满或未选择时展示）
 */
function CompareGuide({ count, maxCount }: { count: number; maxCount: number }) {
  if (count === 0) {
    return (
      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <ScaleIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-base font-semibold text-amber-800">暂未选择对比技艺</h3>
            <p className="text-sm leading-relaxed text-amber-700">
              请前往技艺列表页，在你感兴趣的技艺卡片上点击「加入对比」按钮。
              最多可以同时对比 <strong>{maxCount}</strong> 门传统技艺，了解它们在制作流程上的异同。
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700 sm:shrink-0"
          >
            选择技艺
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100">
          <PlusIcon className="h-5 w-5 text-sky-600" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-base font-semibold text-sky-800">
            还需选择 {maxCount - count} 门技艺即可开始对比
          </h3>
          <p className="text-sm leading-relaxed text-sky-700">
            当前已选择 <strong>{count}</strong> / {maxCount} 门技艺。请继续从技艺列表中选择另一门技艺加入对比，
            以查看完整的流程对照表格。
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 sm:shrink-0"
        >
          继续选择
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/**
 * 步骤对照表格行
 */
function CompareStepRow({
  step1,
  step2,
  index,
  color1,
  color2,
}: {
  step1: CraftStep | null;
  step2: CraftStep | null;
  index: number;
  color1: string;
  color2: string;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="w-12 shrink-0 border-r border-gray-100 bg-gray-50/50 px-3 py-4 text-center align-top">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-heritage-100 text-xs font-semibold text-heritage-700">
          {index + 1}
        </span>
      </td>
      <td className="w-1/2 px-4 py-4 align-top">
        {step1 ? (
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color1 }}
              />
              <h4 className="text-sm font-semibold text-gray-900">{step1.title}</h4>
            </div>
            <p className="pl-4 text-xs leading-relaxed text-gray-600">
              {getDescriptionSummary(step1.description)}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 px-3 py-4 text-center">
            <span className="text-xs text-gray-400">无此步骤</span>
          </div>
        )}
      </td>
      <td className="w-1/2 border-l border-gray-100 px-4 py-4 align-top">
        {step2 ? (
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color2 }}
              />
              <h4 className="text-sm font-semibold text-gray-900">{step2.title}</h4>
            </div>
            <p className="pl-4 text-xs leading-relaxed text-gray-600">
              {getDescriptionSummary(step2.description)}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 px-3 py-4 text-center">
            <span className="text-xs text-gray-400">无此步骤</span>
          </div>
        )}
      </td>
    </tr>
  );
}

/**
 * 技艺流程对比页
 *
 * 功能：
 * - 左右并排展示两门技艺的名称、简介、步骤总数
 * - 下方以逐步对照表格列出各步标题与说明摘要
 * - 未选满两门或未选择时给出引导提示
 */
export default function CraftComparePage() {
  const { ids, count, maxCount, removeFromCompare, clearAll } = useCompare();

  const craftA = useMemo(() => (ids[0] ? getCraftById(ids[0]) : undefined), [ids]);
  const craftB = useMemo(() => (ids[1] ? getCraftById(ids[1]) : undefined), [ids]);

  const isReadyForCompare = count === maxCount && craftA && craftB;

  const maxSteps = useMemo(() => {
    if (!craftA || !craftB) return 0;
    return Math.max(craftA.steps.length, craftB.steps.length);
  }, [craftA, craftB]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-heritage-600 transition hover:text-heritage-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          返回技艺列表
        </Link>

        {count > 0 && (
          <button
            type="button"
            onClick={() => {
              clearAll();
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
            清空对比
          </button>
        )}
      </div>

      <section className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-heritage-100">
          <ScaleIcon className="h-7 w-7 text-heritage-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-heritage-900 sm:text-4xl">
          技艺流程对比
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          并排列出两门传统技艺，逐步对照它们的制作流程与工艺要点。
        </p>
      </section>

      {count < maxCount && <CompareGuide count={count} maxCount={maxCount} />}

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500">
          <span>技艺概览</span>
          <span className="text-xs text-gray-400">（{count}/{maxCount}）</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            {craftA ? (
              <CompareCraftHeader
                craft={craftA}
                slotIndex={0}
                onRemove={() => removeFromCompare(craftA.id)}
              />
            ) : (
              <EmptyCompareSlot slotIndex={0} />
            )}
          </div>
          <div>
            {craftB ? (
              <CompareCraftHeader
                craft={craftB}
                slotIndex={1}
                onRemove={() => removeFromCompare(craftB.id)}
              />
            ) : (
              <EmptyCompareSlot slotIndex={1} />
            )}
          </div>
        </div>
      </section>

      {isReadyForCompare ? (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <ListBulletIcon className="h-4 w-4" />
              <span>步骤对照表格</span>
              <span className="text-xs text-gray-400">（共 {maxSteps} 行对照）</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: craftA.coverColor }}
                />
                <span>{craftA.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: craftB.coverColor }}
                />
                <span>{craftB.name}</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="w-12 shrink-0 border-b border-gray-200 border-r border-gray-200 px-3 py-3 text-center text-xs font-semibold text-gray-500">
                    步骤
                  </th>
                  <th
                    className="w-1/2 border-b border-gray-200 px-4 py-3 text-sm font-semibold"
                    style={{ color: craftA.coverColor }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded"
                        style={{ backgroundColor: craftA.coverColor }}
                      />
                      {craftA.name}
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        ({craftA.steps.length} 步)
                      </span>
                    </div>
                  </th>
                  <th
                    className="w-1/2 border-b border-gray-200 border-l border-gray-200 px-4 py-3 text-sm font-semibold"
                    style={{ color: craftB.coverColor }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded"
                        style={{ backgroundColor: craftB.coverColor }}
                      />
                      {craftB.name}
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        ({craftB.steps.length} 步)
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxSteps }).map((_, index) => (
                  <CompareStepRow
                    key={index}
                    index={index}
                    step1={craftA.steps[index] ?? null}
                    step2={craftB.steps[index] ?? null}
                    color1={craftA.coverColor}
                    color2={craftB.coverColor}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">对比小结</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-heritage-500" />
                <span>
                  <strong>{craftA.name}</strong>（{craftA.category}）共 {craftA.steps.length} 个步骤，
                  <strong>{craftB.name}</strong>（{craftB.category}）共 {craftB.steps.length} 个步骤。
                </span>
              </li>
              {craftA.steps.length !== craftB.steps.length && (
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    两者流程长度不同，
                    {craftA.steps.length > craftB.steps.length ? craftA.name : craftB.name}
                    多出 {Math.abs(craftA.steps.length - craftB.steps.length)} 个处理步骤。
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                <span>
                  可分别点击上方「查看详情」进入各自的分步学习页面，深入了解每一步的工艺细节。
                </span>
              </li>
            </ul>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <ScaleIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">请选择两门技艺后查看对照</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            对比表格需要同时选择两门技艺才能展示。
            {count === 0
              ? '请先前往技艺列表页选择你感兴趣的技艺加入对比。'
              : `请再选择 ${maxCount - count} 门技艺以开始对比。`}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-heritage-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-heritage-700"
            >
              <DocumentTextIcon className="h-4 w-4" />
              前往技艺列表
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
