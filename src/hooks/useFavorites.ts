import { useState, useEffect, useCallback } from 'react';
import {
  getFavoriteIds,
  isFavorite as checkFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite as toggleFav,
  subscribe,
} from '../utils/favorites';

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => getFavoriteIds());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setIds(getFavoriteIds());
    });
    return unsubscribe;
  }, []);

  const isFavorite = useCallback((id: string) => checkFavorite(id), []);
  const add = useCallback((id: string) => addFavorite(id), []);
  const remove = useCallback((id: string) => removeFavorite(id), []);
  const toggle = useCallback((id: string) => toggleFav(id), []);

  return {
    ids,
    isFavorite,
    addFavorite: add,
    removeFavorite: remove,
    toggleFavorite: toggle,
  };
}
