
export function buildCSV(filtered, filters) {
  if (!filtered.length) return null;
  let csv = 'Date,Amount,Type,Category,Description,Running Balance\n';
  filtered.forEach((tx) => {
    csv += `${tx.date},${tx.amount},${tx.type},${tx.category},${tx.info || ''},${tx.balance ?? ''}\n`;
  });
  const balance = filtered.reduce(
    (sum, tx) => sum + (tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount)),
    0
  );
  csv += `\nFiltered Balance,₹${balance}\n`;
  return csv;
}

export function downloadCSV(filtered, filters) {
  const csv = buildCSV(filtered, filters);
  if (!csv) return false;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filters.month ? `finance_${filters.month}.csv` : 'finance_filtered.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}
