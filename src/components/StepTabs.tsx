import { useCallback } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';
import { CheckIcon } from '@heroicons/react/24/outline';
import type { CraftStep } from '../types/craft';
import StepPlaceholder from './StepPlaceholder';
import { useProgress } from '../hooks/useProgress';

interface StepTabsProps {
  steps: CraftStep[];
  accentColor: string;
  selectedIndex: number;
  craftId: string;
  onChange: (index: number) => void;
  progress?: number;
}

/**
 * 步骤 Headless UI Tab 分步浏览
 */
export default function StepTabs({ steps, accentColor, selectedIndex, craftId, onChange, progress = 0 }: StepTabsProps) {
  const { setViewPosition, updateProgress } = useProgress();

  const handleTabChange = useCallback((index: number) => {
    const stepOrder = index + 1;
    setViewPosition(craftId, stepOrder);
    updateProgress(craftId, stepOrder);
    onChange(index);
  }, [craftId, onChange, setViewPosition, updateProgress]);

  return (
    <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
      <TabList className="flex flex-wrap gap-2 rounded-xl bg-heritage-100 p-2">
        {steps.map((step) => {
          const isCompleted = step.order <= progress;
          return (
            <Tab
              key={step.id}
              className={({ selected }) =>
                [
                  'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium outline-none transition',
                  'focus-visible:ring-2 focus-visible:ring-heritage-400 focus-visible:ring-offset-2',
                  selected
                    ? 'bg-white text-heritage-800 shadow-sm'
                    : isCompleted
                      ? 'text-heritage-600 hover:bg-white/60 hover:text-heritage-800'
                      : 'text-heritage-600 hover:bg-white/60 hover:text-heritage-800',
                ].join(' ')
              }
            >
              {isCompleted && (
                <CheckIcon className="h-4 w-4 text-green-600" />
              )}
              第 {step.order} 步
            </Tab>
          );
        })}
      </TabList>

      <TabPanels className="mt-6">
        {steps.map((step) => {
          const isCompleted = step.order <= progress;
          return (
            <TabPanel key={step.id} className="outline-none">
              <article className="overflow-hidden rounded-xl border border-heritage-200 bg-white shadow-sm">
                <StepPlaceholder step={step} accentColor={accentColor} />
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: isCompleted ? '#16a34a' : accentColor }}
                    >
                      {isCompleted ? <CheckSolidIcon className="h-4 w-4" /> : step.order}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-heritage-900">{step.title}</h3>
                    {isCompleted && (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        <CheckIcon className="h-3 w-3" />
                        已学习
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </article>
            </TabPanel>
          );
        })}
      </TabPanels>
    </TabGroup>
  );
}
