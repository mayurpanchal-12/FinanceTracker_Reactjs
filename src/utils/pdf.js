
export async function downloadPDF(filtered, filters) {
  if (!filtered.length) return false;
  try {
    const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });
    const pageW = doc.internal.pageSize.getWidth();
    const colWidths = [18, 22, 22, 50, 22, 28, 30];
    const headers = ['#', 'Date', 'Amount', 'Description', 'Type', 'Category', 'Balance'];
    let y = 15;

    doc.setFontSize(14);
    doc.text('Finance Tracker – Transactions', 14, y);
    y += 8;
    doc.setFontSize(10);

    doc.setFillColor(0, 121, 107);
    doc.setTextColor(255, 255, 255);
    doc.rect(14, y, pageW - 28, 8, 'F');
    let x = 14;
    headers.forEach((h, i) => {
      doc.text(h, x + 2, y + 5.5);
      x += colWidths[i];
    });
    y += 10;
    doc.setTextColor(0, 0, 0);

    filtered.forEach((tx, index) => {
      if (y > 190) {
        doc.addPage('landscape');
        y = 15;
      }
      const row = [
        String(index + 1),
        tx.date,
        String(tx.amount),
        (tx.info || '').slice(0, 30),
        tx.type,
        tx.category || '',
        String(tx.balance ?? ''),
      ];
      x = 14;
      row.forEach((cell, i) => {
        doc.text(String(cell), x + 2, y + 5);
        x += colWidths[i];
      });
      y += 7;
    });

    y += 10;
    const balance = filtered.reduce(
      (sum, tx) => sum + (tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount)),
      0
    );
    doc.setFont(undefined, 'bold');
    doc.text(`Filtered balance: ₹${balance}`, 14, y);

    const name = filters.month ? `finance_${filters.month}.pdf` : 'finance_filtered.pdf';
    doc.save(name);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
