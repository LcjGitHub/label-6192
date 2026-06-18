const STORAGE_KEY = 'heritage-craft-favorites';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return new Set(arr.filter((id) => typeof id === 'string'));
    }
    return new Set();
  } catch {
    return new Set();
  }
}

function writeFavorites(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore storage errors
  }
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function getFavoriteIds(): string[] {
  return Array.from(readFavorites());
}

export function isFavorite(id: string): boolean {
  return readFavorites().has(id);
}

export function addFavorite(id: string): void {
  const set = readFavorites();
  if (!set.has(id)) {
    set.add(id);
    writeFavorites(set);
    notify();
  }
}

export function removeFavorite(id: string): void {
  const set = readFavorites();
  if (set.has(id)) {
    set.delete(id);
    writeFavorites(set);
    notify();
  }
}

export function toggleFavorite(id: string): boolean {
  const set = readFavorites();
  const next = !set.has(id);
  if (next) {
    set.add(id);
  } else {
    set.delete(id);
  }
  writeFavorites(set);
  notify();
  return next;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
