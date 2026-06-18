import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getCraftById } from '../data/crafts';
import StepSwiper from '../components/StepSwiper';
import StepTabs from '../components/StepTabs';
import FavoriteButton from '../components/FavoriteButton';

type ViewMode = 'swiper' | 'tabs';

/**
 * 技艺步骤详情页
 */
export default function CraftDetailPage() {
  const { id } = useParams<{ id: string }>();
  const craft = id ? getCraftById(id) : undefined;

  const [viewMode, setViewMode] = useState<ViewMode>('swiper');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!craft) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600">未找到该技艺</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-heritage-600 hover:underline">
          <ArrowLeftIcon className="h-4 w-4" />
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-heritage-600 transition hover:text-heritage-800"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        全部技艺
      </Link>

      <header className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="inline-block rounded-lg px-4 py-1.5 font-serif text-2xl font-bold text-white"
            style={{ backgroundColor: craft.coverColor }}
          >
            {craft.name}
          </div>
          <FavoriteButton craftId={craft.id} size="lg" className="p-2 hover:bg-gray-100" />
        </div>
        <p className="max-w-2xl leading-relaxed text-gray-600">{craft.summary}</p>
      </header>

      <TabGroup
        selectedIndex={viewMode === 'swiper' ? 0 : 1}
        onChange={(index) => setViewMode(index === 0 ? 'swiper' : 'tabs')}
      >
        <TabList className="mb-6 inline-flex rounded-lg border border-heritage-200 bg-white p-1 shadow-sm">
          <Tab
            className={({ selected }) =>
              [
                'rounded-md px-4 py-2 text-sm font-medium outline-none transition',
                'focus-visible:ring-2 focus-visible:ring-heritage-400',
                selected ? 'bg-heritage-600 text-white' : 'text-gray-600 hover:text-heritage-700',
              ].join(' ')
            }
          >
            滑动浏览
          </Tab>
          <Tab
            className={({ selected }) =>
              [
                'rounded-md px-4 py-2 text-sm font-medium outline-none transition',
                'focus-visible:ring-2 focus-visible:ring-heritage-400',
                selected ? 'bg-heritage-600 text-white' : 'text-gray-600 hover:text-heritage-700',
              ].join(' ')
            }
          >
            分步 Tab
          </Tab>
        </TabList>
      </TabGroup>

      {viewMode === 'swiper' ? (
        <StepSwiper
          steps={craft.steps}
          accentColor={craft.coverColor}
          activeIndex={activeStepIndex}
          onSlideChange={setActiveStepIndex}
        />
      ) : (
        <StepTabs
          steps={craft.steps}
          accentColor={craft.coverColor}
          selectedIndex={activeStepIndex}
          onChange={setActiveStepIndex}
        />
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        当前第 {activeStepIndex + 1} / {craft.steps.length} 步
      </p>
    </div>
  );
}
