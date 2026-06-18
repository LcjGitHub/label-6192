import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Craft } from '../types/craft';

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
 * 技艺列表卡片
 */
export default function CraftCard({ craft }: CraftCardProps) {
  const badgeColor = categoryBadgeColors[craft.category] || 'bg-gray-100 text-gray-700';

  return (
    <Link
      to={`/craft/${craft.id}`}
      className="group block overflow-hidden rounded-xl border border-heritage-200 bg-white shadow-sm transition hover:border-heritage-300 hover:shadow-md"
    >
      <div
        className="flex h-32 items-center justify-center"
        style={{ backgroundColor: craft.coverColor }}
      >
        <span className="font-serif text-3xl font-bold text-white/95">{craft.name}</span>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
            {craft.category}
          </span>
        </div>
        <h2 className="font-serif text-lg font-semibold text-heritage-900">{craft.name}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{craft.summary}</p>
        <div className="mt-4 flex items-center text-sm font-medium text-heritage-600 group-hover:text-heritage-700">
          <span>{craft.steps.length} 个步骤</span>
          <ChevronRightIcon className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
