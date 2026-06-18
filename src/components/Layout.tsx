import { Outlet, Link, useLocation } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';

/**
 * 全局布局：顶栏 + 主内容区
 */
export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen">
      <header className="border-b border-heritage-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-heritage-800 transition hover:text-heritage-600">
            <SparklesIcon className="h-7 w-7" aria-hidden="true" />
            <span className="font-serif text-xl font-semibold">非遗技艺</span>
          </Link>
          {!isHome && (
            <Link
              to="/"
              className="text-sm text-heritage-600 underline-offset-2 transition hover:text-heritage-800 hover:underline"
            >
              返回列表
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
