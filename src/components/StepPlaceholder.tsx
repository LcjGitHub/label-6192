import type { CraftStep } from '../types/craft';

interface StepPlaceholderProps {
  step: CraftStep;
  accentColor: string;
}

/**
 * 步骤占位图
 */
export default function StepPlaceholder({ step, accentColor }: StepPlaceholderProps) {
  return (
    <div
      className="step-placeholder"
      style={{
        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
      }}
      role="img"
      aria-label={`${step.title} 示意图占位`}
    >
      <span>{step.imagePlaceholder}</span>
    </div>
  );
}
