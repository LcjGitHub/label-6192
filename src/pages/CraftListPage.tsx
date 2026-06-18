import { getAllCrafts } from '../data/crafts';
import CraftCard from '../components/CraftCard';

/**
 * 技艺列表页
 */
export default function CraftListPage() {
  const crafts = getAllCrafts();

  return (
    <div>
      <section className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-heritage-900 sm:text-4xl">
          非遗技艺流程分步浏览
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          选择一门传统技艺，按步骤了解其制作流程与工艺要点。
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {crafts.map((craft) => (
          <CraftCard key={craft.id} craft={craft} />
        ))}
      </div>
    </div>
  );
}
