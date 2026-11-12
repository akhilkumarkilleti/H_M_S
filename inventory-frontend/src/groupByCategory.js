// Groups a list into [[categoryName, items[]], ...], sorted by category name.
export function groupByCategory(list) {
  const map = new Map();
  list.forEach((x) => {
    const k = x.category || 'Uncategorized';
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(x);
  });
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}