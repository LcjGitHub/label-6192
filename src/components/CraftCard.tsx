import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Craft } from '../types/craft';

interface CraftCardProps {
  craft: Craft;
}

/**
 * 技艺列表卡片
 */
export default function CraftCard({ craft }: CraftCardProps) {
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
