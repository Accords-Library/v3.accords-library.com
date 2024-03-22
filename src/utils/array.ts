export const groupBy = <K, T>(array: T[], getKey: (item: T) => K): { key: K; values: T[] }[] => {
  const map = new Map<K, T[]>();
  array.forEach((item) => {
    const key = getKey(item);
    const currentValueInMap = map.get(key) ?? [];
    currentValueInMap.push(item);
    map.set(key, currentValueInMap);
  });

  return [...map.entries()].map(([key, values]) => ({ key, values }));
};
