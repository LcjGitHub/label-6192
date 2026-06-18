import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useFavorites } from '../hooks/useFavorites';

interface FavoriteButtonProps {
  craftId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export default function FavoriteButton({ craftId, size = 'md', className = '' }: FavoriteButtonProps) {
  const { ids, toggleFavorite } = useFavorites();
  const favorited = ids.includes(craftId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(craftId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? '取消收藏' : '收藏'}
      title={favorited ? '取消收藏' : '收藏'}
      className={[
        'inline-flex items-center justify-center rounded-full transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-400',
        favorited
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500',
        className,
      ].join(' ')}
    >
      {favorited ? (
        <HeartSolid className={sizeMap[size]} />
      ) : (
        <HeartOutline className={sizeMap[size]} />
      )}
    </button>
  );
}
