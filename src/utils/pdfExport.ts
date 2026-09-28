import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, Category, Account } from '../types/finance';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate?: number;
  name?: string;
}

export interface StatementPDFData {
  userName: string;
  startDate: string;
  endDate: string;
  periodIncome: number;
  periodExpenses: number;
  netSavings: number;
  savingsRate: number;
  currency: CurrencyConfig;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  periodLeaksSum: number;
  periodLeaksCount: number;
}

export function generateStatementPDF(data: StatementPDFData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper for formatting KSh
  const fmt = (num: number) => {
    return `${data.currency.code} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Emerald Top Stripe
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FLOWGUARD', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text('ENTERPRISE FINANCIAL INTELLIGENCE & AUDIT STATEMENT', 14, 26);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, 34);

  // Client badge on right
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - 75, 12, 61, 24, 2, 2, 'F');
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text('ACCOUNT HOLDER:', pageWidth - 70, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(data.userName || 'Benard Cheruiyot', pageWidth - 70, 24);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(52, 211, 153);
  doc.text(`Period: ${data.startDate} to ${data.endDate}`, pageWidth - 70, 31);

  // 2. Executive Summary Box (Key Metrics)
  let currentY = 48;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTIVE SUMMARY & CASHFLOW AUDIT', 14, currentY);

  currentY += 4;
  const boxWidth = (pageWidth - 28 - 9) / 4;
  const boxHeight = 22;

  // Box 1: Total Inflows
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208); // emerald-200
  doc.roundedRect(14, currentY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('TOTAL INFLOWS', 17, currentY + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(data.periodIncome), 17, currentY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('4 Business Streams', 17, currentY + 19);

  // Box 2: Total Outflows
  doc.setFillColor(254, 242, 242); // rose-50
  doc.setDrawColor(254, 202, 202); // rose-200
  doc.roundedRect(14 + boxWidth + 3, currentY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text('TOTAL EXPENSES', 17 + boxWidth + 3, currentY + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(data.periodExpenses), 17 + boxWidth + 3, currentY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Cost Centers & Ops', 17 + boxWidth + 3, currentY + 19);

  // Box 3: Net Savings
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(14 + (boxWidth + 3) * 2, currentY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text('NET SURPLUS / SAVINGS', 17 + (boxWidth + 3) * 2, currentY + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(data.netSavings), 17 + (boxWidth + 3) * 2, currentY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${data.savingsRate}% Savings Rate`, 17 + (boxWidth + 3) * 2, currentY + 19);

  // Box 4: Leaks & Waste
  doc.setFillColor(255, 251, 235); // amber-50
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.roundedRect(14 + (boxWidth + 3) * 3, currentY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('LEAKRADAR™ WASTE', 17 + (boxWidth + 3) * 3, currentY + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(data.periodLeaksSum), 17 + (boxWidth + 3) * 3, currentY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${data.periodLeaksCount} Leaks Flagged`, 17 + (boxWidth + 3) * 3, currentY + 19);

  currentY += boxHeight + 8;

  // 3. Category Breakdown Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. EXPENSE CENTER ALLOCATIONS', 14, currentY);

  currentY += 4;
  const expenseCatRows: string[][] = [];
  const categoryTotals: Record<string, number> = {};
  data.transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
  });

  const sortedCategories = data.categories
    .map(c => ({
      name: c.name,
      spend: categoryTotals[c.id] || 0,
      budget: c.monthlyBudget || 0
    }))
    .filter(c => c.spend > 0)
    .sort((a, b) => b.spend - a.spend);

  sortedCategories.forEach(cat => {
    const pct = data.periodExpenses > 0 ? ((cat.spend / data.periodExpenses) * 100).toFixed(1) + '%' : '0%';
    const variance = cat.budget > 0 ? fmt(cat.budget - cat.spend) : 'N/A';
    expenseCatRows.push([
      cat.name,
      fmt(cat.spend),
      pct,
      cat.budget > 0 ? fmt(cat.budget) : 'Uncapped',
      variance
    ]);
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Expense Category / Department', 'Amount Spent', '% of Outflows', 'Monthly Budget', 'Budget Variance']],
    body: expenseCatRows.length > 0 ? expenseCatRows : [['No expenses recorded in this period', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // 4. Itemized Transactions Ledger
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`3. DETAILED FINANCIAL TRANSACTIONS LEDGER (${data.transactions.length} ITEMS)`, 14, currentY);

  currentY += 4;
  const ledgerRows = data.transactions.map(t => {
    const cat = data.categories.find(c => c.id === t.categoryId)?.name || 'General';
    const acc = data.accounts.find(a => a.id === t.accountId)?.name || 'Wallet';
    const typeLabel = t.type === 'income' ? '+ Inflow' : t.type === 'expense' ? '- Outflow' : '↔ Transfer';
    const flag = t.isSubscription ? 'Subscription' : t.isImpulse ? 'Impulse' : t.regretRating ? `${t.regretRating}★ Regret` : 'Normal';
    
    return [
      t.date,
      t.title,
      typeLabel,
      cat,
      acc,
      fmt(t.amount),
      flag
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Date', 'Description / Beneficiary', 'Type', 'Category', 'Account / Channel', 'Amount', 'Audit Tag']],
    body: ledgerRows.length > 0 ? ledgerRows : [['No transactions in selected period', '-', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 45 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 28 },
      5: { cellWidth: 26, fontStyle: 'bold' },
      6: { cellWidth: 18 }
    },
    margin: { left: 14, right: 14 }
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `FlowGuard Financial Intelligence • Certified Confidential Document • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
  }

  return doc;
}

export function downloadPDFStatement(data: StatementPDFData, filename?: string) {
  const doc = generateStatementPDF(data);
  const fname = filename || `FlowGuard-Statement-${data.userName.replace(/\s+/g, '_')}-${data.startDate}_to_${data.endDate}.pdf`;
  doc.save(fname);
}

export async function shareOrSavePDFStatement(data: StatementPDFData, filename?: string): Promise<{ success: boolean; method: string }> {
  const doc = generateStatementPDF(data);
  const fname = filename || `FlowGuard-Statement-${data.userName.replace(/\s+/g, '_')}-${data.startDate}_to_${data.endDate}.pdf`;
  const blob = doc.output('blob');
  const file = new File([blob], fname, { type: 'application/pdf' });

  // 1. Try Native Web Share API (On Android & iOS, this opens the share sheet where user can tap "Save to Drive")
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'FlowGuard Financial Statement',
        text: `FlowGuard Financial Audit Statement for ${data.userName} (${data.startDate} to ${data.endDate})`
      });
      return { success: true, method: 'share_sheet' };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share failed, falling back to direct download:', err);
      }
    }
  }

  // 2. Fallback to direct PDF download
  downloadPDFStatement(data, fname);
  return { success: true, method: 'download' };
}

export function openGoogleDriveUpload(data: StatementPDFData) {
  // First download the PDF file so user has it ready
  downloadPDFStatement(data);

  // Open Google Drive in new tab
  const driveUrl = 'https://drive.google.com/drive/my-drive';
  window.open(driveUrl, '_blank', 'noopener,noreferrer');
}
