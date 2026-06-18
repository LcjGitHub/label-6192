import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import type { CraftStep } from '../types/craft';
import StepPlaceholder from './StepPlaceholder';

interface StepTabsProps {
  steps: CraftStep[];
  accentColor: string;
  selectedIndex: number;
  onChange: (index: number) => void;
}

/**
 * 步骤 Headless UI Tab 分步浏览
 */
export default function StepTabs({ steps, accentColor, selectedIndex, onChange }: StepTabsProps) {
  return (
    <TabGroup selectedIndex={selectedIndex} onChange={onChange}>
      <TabList className="flex flex-wrap gap-2 rounded-xl bg-heritage-100 p-2">
        {steps.map((step) => (
          <Tab
            key={step.id}
            className={({ selected }) =>
              [
                'rounded-lg px-4 py-2 text-sm font-medium outline-none transition',
                'focus-visible:ring-2 focus-visible:ring-heritage-400 focus-visible:ring-offset-2',
                selected
                  ? 'bg-white text-heritage-800 shadow-sm'
                  : 'text-heritage-600 hover:bg-white/60 hover:text-heritage-800',
              ].join(' ')
            }
          >
            第 {step.order} 步
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-6">
        {steps.map((step) => (
          <TabPanel key={step.id} className="outline-none">
            <article className="overflow-hidden rounded-xl border border-heritage-200 bg-white shadow-sm">
              <StepPlaceholder step={step} accentColor={accentColor} />
              <div className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {step.order}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-heritage-900">{step.title}</h3>
                </div>
                <p className="leading-relaxed text-gray-600">{step.description}</p>
              </div>
            </article>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
