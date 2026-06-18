import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, ScaleIcon as ScaleOutline } from '@heroicons/react/24/outline';
import { ScaleIcon as ScaleSolid } from '@heroicons/react/24/solid';
import type { Craft } from '../types/craft';
import FavoriteButton from './FavoriteButton';
import { useProgress } from '../hooks/useProgress';
import { useCompare } from '../hooks/useCompare';

interface CraftCardProps {
  craft: Craft;
}

const categoryBadgeColors: Record<string, string> = {
  '剪纸类': 'bg-red-100 text-red-700',
  '染织类': 'bg-blue-100 text-blue-700',
  '陶瓷类': 'bg-indigo-100 text-indigo-700',
  '木作类': 'bg-amber-100 text-amber-700',
  '刺绣类': 'bg-pink-100 text-pink-700',
  '编织类': 'bg-green-100 text-green-700',
};

/**
 * 对比按钮（右上角小图标版）
 */
function CompareIconButton({ craftId }: { craftId: string }) {
  const { isInCompare, isFull, toggleCompare, count, maxCount } = useCompare();
  const inCompare = isInCompare(craftId);
  const disabled = !inCompare && isFull;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    toggleCompare(craftId);
  };

  const titleText = inCompare
    ? '移出对比'
    : isFull
    ? `对比已满（${count}/${maxCount}），请先移出其他技艺`
    : '加入对比';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={titleText}
      title={titleText}
      className={[
        'inline-flex items-center justify-center rounded-full p-1.5 transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-400',
        inCompare
          ? 'bg-white text-heritage-600 hover:bg-heritage-50 hover:text-heritage-700 shadow-sm'
          : disabled
          ? 'bg-white/20 text-white/50 cursor-not-allowed'
          : 'bg-white/20 text-white hover:bg-white hover:text-heritage-600',
      ].join(' ')}
    >
      {inCompare ? (
        <ScaleSolid className="h-5 w-5" />
      ) : (
        <ScaleOutline className="h-5 w-5" />
      )}
    </button>
  );
}

/**
 * 技艺列表卡片
 */
export default function CraftCard({ craft }: CraftCardProps) {
  const badgeColor = categoryBadgeColors[craft.category] || 'bg-gray-100 text-gray-700';
  const location = useLocation();
  const { getProgress } = useProgress();
  const { isInCompare, isFull, toggleCompare, count, maxCount } = useCompare();

  const detailState = { from: location.pathname + location.search };

  const totalSteps = craft.steps.length;
  const learnedSteps = getProgress(craft.id);
  const progressPercent = totalSteps > 0 ? Math.min((learnedSteps / totalSteps) * 100, 100) : 0;
  const hasProgress = learnedSteps > 0;

  const inCompare = isInCompare(craft.id);
  const compareDisabled = !inCompare && isFull;
  const compareButtonText = inCompare
    ? '移出对比'
    : compareDisabled
    ? `对比已满（${count}/${maxCount}）`
    : '加入对比';

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compareDisabled) return;
    toggleCompare(craft.id);
  };

  return (
    <div className="group block overflow-hidden rounded-xl border border-heritage-200 bg-white shadow-sm transition hover:border-heritage-300 hover:shadow-md">
      <Link
        to={{ pathname: `/craft/${craft.id}` }}
        state={detailState}
        className="block"
      >
        <div
          className="relative flex h-32 items-center justify-center"
          style={{ backgroundColor: craft.coverColor }}
        >
          <span className="font-serif text-3xl font-bold text-white/95">{craft.name}</span>
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <CompareIconButton craftId={craft.id} />
            <FavoriteButton craftId={craft.id} size="md" className="p-1.5 bg-white/20 hover:bg-white/30 text-white hover:text-white" />
          </div>
          {inCompare && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-heritage-700 shadow-sm">
              <ScaleSolid className="h-3.5 w-3.5" />
              <span>对比中</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
              {craft.category}
            </span>
          </div>
          <h2 className="font-serif text-lg font-semibold text-heritage-900">{craft.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{craft.summary}</p>
          {hasProgress && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-heritage-700">已学 {learnedSteps} / {totalSteps} 步</span>
                <span className="text-gray-500">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%`, backgroundColor: craft.coverColor }}
                />
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-heritage-600 group-hover:text-heritage-700">
            <span className="flex items-center">
              {hasProgress ? '继续学习' : `${craft.steps.length} 个步骤`}
              <ChevronRightIcon className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>

      <div className="border-t border-heritage-100 bg-heritage-50/50 px-5 py-3">
        <button
          type="button"
          onClick={handleCompareClick}
          disabled={compareDisabled}
          className={[
            'inline-flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-400',
            inCompare
              ? 'bg-heritage-600 text-white hover:bg-heritage-700'
              : compareDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-heritage-700 border border-heritage-200 hover:bg-heritage-600 hover:text-white hover:border-heritage-600',
          ].join(' ')}
        >
          {inCompare ? (
            <ScaleSolid className="h-4 w-4" />
          ) : (
            <ScaleOutline className="h-4 w-4" />
          )}
          {compareButtonText}
        </button>
      </div>
    </div>
  );
}
