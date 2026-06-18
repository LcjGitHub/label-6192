import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { SparklesIcon, HeartIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useFavorites } from '../hooks/useFavorites';

/**
 * 全局布局：顶栏 + 主内容区
 */
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isDictionary = location.pathname === '/dictionary';
  const { ids: favoriteIds } = useFavorites();

  const goToFavorites = () => {
    navigate('/?tab=favorites');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-heritage-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-heritage-800 transition hover:text-heritage-600">
            <SparklesIcon className="h-7 w-7" aria-hidden="true" />
            <span className="font-serif text-xl font-semibold">非遗技艺</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/dictionary"
              className={[
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition',
                isDictionary
                  ? 'bg-heritage-100 text-heritage-800'
                  : 'text-heritage-700 hover:bg-heritage-50 hover:text-heritage-900',
              ].join(' ')}
              title="非遗术语词典"
            >
              <BookOpenIcon className="h-4 w-4" />
              <span>术语词典</span>
            </Link>
            <button
              type="button"
              onClick={goToFavorites}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-heritage-700 transition hover:bg-heritage-50 hover:text-heritage-900"
              title="我的收藏"
            >
              <HeartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">我的收藏</span>
              {favoriteIds.length > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {favoriteIds.length}
                </span>
              )}
            </button>
            {!isHome && (
              <Link
                to="/"
                className="text-sm text-heritage-600 underline-offset-2 transition hover:text-heritage-800 hover:underline"
              >
                返回列表
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
