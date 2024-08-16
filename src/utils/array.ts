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

export const sortBy = <T, K>(array: T[], getKey: (item: T) => K, sort: K[]) =>
  array.sort((a, b) => {
    const aKey = getKey(a);
    const bKey = getKey(b);
    let aKeyIndex = sort.indexOf(aKey);
    let bKeyIndex = sort.indexOf(bKey);
    if (aKeyIndex === -1) aKeyIndex = array.length;
    if (bKeyIndex === -1) bKeyIndex = array.length;
    return aKeyIndex - bKeyIndex;
  });
