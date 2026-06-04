
export function applyFilters(transactions, filters) {
  if (!filters) return transactions;
  let result = transactions;
  if (filters.month) {
    result = result.filter((tx) => tx.date.startsWith(filters.month));
  }
  if (filters.type) {
    result = result.filter((tx) => tx.type === filters.type);
  }
  if (filters.category) {
    result = result.filter((tx) => tx.category === filters.category);
  }
  const search = (filters.search || '').trim().toLowerCase();
  if (search) {
    result = result.filter((tx) => {
      const haystacks = [
        tx.info || '',
        tx.category || '',
        tx.type || '',
        String(tx.amount ?? ''),
        tx.date || '',
      ]
        .join(' ')
        .toLowerCase();
      return haystacks.includes(search);
    });
  }
  return result;
}
