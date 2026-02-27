type Getter<T, V> = (item: T) => V;

/** Compare by string field (ascending, locale-aware). */
export function byString<T>(get: Getter<T, string | undefined | null>) {
  return (a: T, b: T) => (get(a) || '').localeCompare(get(b) || '');
}

/** Compare by date field (newest first). */
export function byDateDesc<T>(
  get: Getter<T, string | Date | undefined | null>
) {
  return (a: T, b: T) => {
    const da = get(a) ? new Date(get(a)!).getTime() : 0;
    const db = get(b) ? new Date(get(b)!).getTime() : 0;
    return db - da;
  };
}

/** Compare by date field (oldest first). */
export function byDateAsc<T>(get: Getter<T, string | Date | undefined | null>) {
  return (a: T, b: T) => {
    const da = get(a) ? new Date(get(a)!).getTime() : 0;
    const db = get(b) ? new Date(get(b)!).getTime() : 0;
    return da - db;
  };
}

/** Compare by numeric field (highest first). */
export function byNumberDesc<T>(get: Getter<T, number | undefined | null>) {
  return (a: T, b: T) => (get(b) || 0) - (get(a) || 0);
}

/** Compare by numeric rank from a lookup map (highest rank first). */
export function byRankDesc<T>(
  get: Getter<T, string>,
  rankMap: Record<string, number>
) {
  return (a: T, b: T) => (rankMap[get(b)] ?? 0) - (rankMap[get(a)] ?? 0);
}

/** Compare by numeric rank from a lookup map (lowest rank first). */
export function byRankAsc<T>(
  get: Getter<T, string>,
  rankMap: Record<string, number>
) {
  return (a: T, b: T) => (rankMap[get(a)] ?? 0) - (rankMap[get(b)] ?? 0);
}
