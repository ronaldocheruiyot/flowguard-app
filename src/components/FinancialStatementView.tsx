import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Share2, 
  Copy, 
  ChevronDown,
  Cloud,
  FileCheck
} from 'lucide-react';
import { DynamicIcon } from '../utils/iconMap';
import { downloadPDFStatement, shareOrSavePDFStatement, openGoogleDriveUpload } from '../utils/pdfExport';

export const FinancialStatementView: React.FC = () => {
  const { 
    transactions, 
    categories, 
    accounts, 
    formatMoney, 
    currency, 
    user 
  } = useFinance();

  const [periodPreset, setPeriodPreset] = useState<'week' | 'month' | 'last_month' | 'year' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1); // 1st of current month
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [copied, setCopied] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Compute date range according to selected preset
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  if (periodPreset === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (periodPreset === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (periodPreset === 'last_month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0);
  } else if (periodPreset === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear(), 11, 31);
  } else if (periodPreset === 'custom') {
    startDate = new Date(customStartDate);
    endDate = new Date(customEndDate);
  }

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  // Filter transactions within range
  const filteredTxs = transactions.filter(t => {
    return t.date >= startStr && t.date <= endStr;
  });

  let periodIncome = 0;
  let periodExpenses = 0;
  let periodTransfers = 0;

  filteredTxs.forEach(t => {
    if (t.type === 'income') periodIncome += t.amount;
    else if (t.type === 'expense') periodExpenses += t.amount;
    else if (t.type === 'transfer') periodTransfers += t.amount;
  });

  const netSavings = periodIncome - periodExpenses;
  const savingsRate = periodIncome > 0 ? Math.max(0, Math.round((netSavings / periodIncome) * 100)) : 0;

  // Category breakdown for this period
  const categoryTotals: Record<string, number> = {};
  filteredTxs.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
  });

  const periodCategories = categories
    .map(c => ({
      ...c,
      periodSpend: categoryTotals[c.id] || 0
    }))
    .filter(c => c.periodSpend > 0)
    .sort((a, b) => b.periodSpend - a.periodSpend);

  // Leaks in this period
  const periodLeaks = filteredTxs.filter(t => 
    (t.leakFlags && t.leakFlags.length > 0) || (t.regretRating && t.regretRating >= 4) || t.isImpulse
  );
  const periodLeakSum = periodLeaks.reduce((sum, t) => sum + t.amount, 0);

  const getStatementData = () => ({
    userName: user?.name || 'Benard Cheruiyot',
    startDate: startStr,
    endDate: endStr,
    periodIncome,
    periodExpenses,
    netSavings,
    savingsRate,
    currency,
    transactions: filteredTxs,
    categories,
    accounts,
    periodLeaksSum: periodLeakSum,
    periodLeaksCount: periodLeaks.length
  });

  const handleDownloadPDF = () => {
    downloadPDFStatement(getStatementData());
    setExportNotice('✓ Official PDF Statement Downloaded!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleSaveToGoogleDrive = () => {
    openGoogleDriveUpload(getStatementData());
    setExportNotice('☁️ PDF Generated & Google Drive Opened in New Tab!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleShareStatement = async () => {
    const res = await shareOrSavePDFStatement(getStatementData());
    if (res.method === 'share_sheet') {
      setExportNotice('📤 Shared via Device Sheet (Select "Save to Drive" or WhatsApp)');
    } else {
      setExportNotice('✓ Statement Downloaded!');
    }
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportStatementCSV = () => {
    const headers = ['Date', 'Type', 'Description / Merchant', 'Category', 'Account', 'Amount', 'Currency', 'Notes / Leak Flags'];
    const rows = filteredTxs.map(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || 'General';
      const acc = accounts.find(a => a.id === t.accountId)?.name || 'Account';
      const flags = [
        t.isSubscription ? 'Subscription' : '',
        t.isImpulse ? 'Impulse' : '',
        t.regretRating ? `Regret ${t.regretRating}★` : ''
      ].filter(Boolean).join(' | ');

      return [
        t.date,
        t.type,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${cat}"`,
        `"${acc}"`,
        t.amount,
        currency.code,
        `"${flags} ${t.note ? '- ' + t.note.replace(/"/g, '""') : ''}"`
      ];
    });

    const csvContent = [
      `"FlowGuard Financial Statement"`,
      `"Period: ${startStr} to ${endStr}"`,
      `"Total Income: ${periodIncome} ${currency.code}"`,
      `"Total Expenses: ${periodExpenses} ${currency.code}"`,
      `"Net Surplus: ${netSavings} ${currency.code}"`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowguard-statement-${startStr}-to-${endStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportNotice('✓ Excel / CSV Statement Exported!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleCopySummary = () => {
    const summaryText = `📊 FlowGuard Financial Statement (${startStr} to ${endStr})
💰 Total Income: ${formatMoney(periodIncome)}
💸 Total Expenses: ${formatMoney(periodExpenses)}
📈 Net Surplus/Savings: ${formatMoney(netSavings)} (${savingsRate}% Saved)
🚨 Identified Money Leaks: ${formatMoney(periodLeakSum)} (${periodLeaks.length} items)
Generated via FlowGuard App.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      
      {/* Top Banner (hidden during print) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-2xl print:hidden space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Financial Statement & Cloud Export
              </h2>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Bank-ready PDF, Excel & Google Drive Sync
              </p>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 hover:scale-102 active:scale-98"
              title="Download Official PDF Statement"
            >
              <FileCheck size={15} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleSaveToGoogleDrive}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition"
              title="Save directly to Google Drive"
            >
              <Cloud size={15} />
              <span>Google Drive</span>
            </button>
            <button
              onClick={handleShareStatement}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
              title="Share via Mobile Share Sheet"
            >
              <Share2 size={15} />
            </button>
            <button
              onClick={handleExportStatementCSV}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
              title="Export CSV / Excel"
            >
              <Download size={15} />
              <span className="text-[10px]">Excel</span>
            </button>
          </div>
        </div>

        {/* Live Notification Feedback Toast */}
        {exportNotice && (
          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <span>{exportNotice}</span>
            <button onClick={() => setExportNotice(null)} className="text-emerald-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* Period Selector Tabs */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Statement Duration:
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <button
              onClick={() => setPeriodPreset('week')}
              className={`py-1.5 px-2 rounded-xl font-bold transition text-[11px] ${
                periodPreset === 'week' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriodPreset('month')}
              className={`py-1.5 px-2 rounded-xl font-bold transition text-[11px] ${
                periodPreset === 'month' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriodPreset('last_month')}
              className={`py-1.5 px-2 rounded-xl font-bold transition text-[11px] ${
                periodPreset === 'last_month' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setPeriodPreset('year')}
              className={`py-1.5 px-2 rounded-xl font-bold transition text-[11px] ${
                periodPreset === 'year' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              Full Year
            </button>
          </div>

          {/* Custom Date Pickers */}
          <div className="pt-1 flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[9px] text-slate-400 block uppercase">From Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  setPeriodPreset('custom');
                }}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-slate-400 block uppercase">To Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => {
                  setCustomEndDate(e.target.value);
                  setPeriodPreset('custom');
                }}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= OFFICIAL PRINTABLE STATEMENT CARD ================= */}
      <div 
        id="printable-statement" 
        className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
      >
        {/* Statement Header */}
        <div className="border-b border-slate-800 pb-4 print:border-gray-300">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm print:bg-black print:text-white">
                  FG
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white print:text-black">
                  FLOWGUARD FINANCIAL STATEMENT
                </h1>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Personal & Business Cash Flow Ledger
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider print:text-emerald-700">
                Official Statement
              </div>
              <div className="text-xs font-semibold text-slate-300 print:text-gray-700 mt-0.5">
                Ref: FG-{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 print:border-gray-200 text-xs">
            <div>
              <span className="text-slate-400 print:text-gray-500 text-[10px] block uppercase">Statement Period</span>
              <strong className="text-white print:text-black">{startStr} to {endStr}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 text-[10px] block uppercase">Base Currency</span>
              <strong className="text-white print:text-black">{currency.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 text-[10px] block uppercase">Generated Date</span>
              <strong className="text-white print:text-black">{now.toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-[10px] text-slate-400 print:text-gray-600 font-bold uppercase block">Total Income (Inflow)</span>
            <div className="text-base font-black text-emerald-400 print:text-emerald-700 mt-0.5">
              +{formatMoney(periodIncome)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-[10px] text-slate-400 print:text-gray-600 font-bold uppercase block">Total Spent (Outflow)</span>
            <div className="text-base font-black text-rose-400 print:text-red-700 mt-0.5">
              -{formatMoney(periodExpenses)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-[10px] text-slate-400 print:text-gray-600 font-bold uppercase block">Net Savings / Surplus</span>
            <div className={`text-base font-black mt-0.5 ${netSavings >= 0 ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-red-700'}`}>
              {formatMoney(netSavings)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-[10px] text-slate-400 print:text-gray-600 font-bold uppercase block">Savings Rate</span>
            <div className="text-base font-black text-cyan-400 print:text-cyan-700 mt-0.5">
              {savingsRate}%
            </div>
          </div>
        </div>

        {/* Money Leak Audit in Statement */}
        <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 print:bg-rose-50 print:border-rose-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400 print:text-rose-800">
            <span className="flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>LeakRadar™ Period Audit</span>
            </span>
            <span>{formatMoney(periodLeakSum)} Bleed Identified</span>
          </div>
          <p className="text-[11px] text-slate-300 print:text-gray-700 leading-relaxed">
            During this statement window, <strong>{periodLeaks.length} transactions</strong> were flagged as financial friction (zombie subscriptions, impulse remorse, or platform surcharges).
          </p>
        </div>

        {/* Category Expense Breakdown Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider">
            Category Expense Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 print:border-gray-300 text-slate-400 print:text-gray-600 text-[10px] uppercase">
                  <th className="py-1.5 px-2">Category</th>
                  <th className="py-1.5 px-2">Classification</th>
                  <th className="py-1.5 px-2 text-right">Actual Spend</th>
                  <th className="py-1.5 px-2 text-right">Share (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                {periodCategories.map(cat => {
                  const sharePct = periodExpenses > 0 ? Math.round((cat.periodSpend / periodExpenses) * 100) : 0;
                  return (
                    <tr key={cat.id} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                      <td className="py-2 px-2 font-semibold text-slate-200 print:text-black flex items-center gap-1.5">
                        <DynamicIcon name={cat.icon} className="w-3.5 h-3.5 print:hidden" />
                        <span>{cat.name}</span>
                      </td>
                      <td className="py-2 px-2 uppercase text-[10px] text-slate-400 print:text-gray-600">
                        {cat.group}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-white print:text-black">
                        {formatMoney(cat.periodSpend)}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-400 print:text-gray-600">
                        {sharePct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Itemized Transactions Table */}
        <div className="space-y-2 pt-2 border-t border-slate-800 print:border-gray-300">
          <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider">
            Itemized Statement Records ({filteredTxs.length} entries)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 print:border-gray-300 text-slate-400 print:text-gray-600 text-[10px] uppercase">
                  <th className="py-1.5 px-2">Date</th>
                  <th className="py-1.5 px-2">Description</th>
                  <th className="py-1.5 px-2">Account</th>
                  <th className="py-1.5 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                {filteredTxs.map(t => {
                  const acc = accounts.find(a => a.id === t.accountId);
                  const isIncome = t.type === 'income';
                  const isExpense = t.type === 'expense';

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                      <td className="py-2 px-2 text-[10px] text-slate-400 print:text-gray-600 whitespace-nowrap">
                        {t.date}
                      </td>
                      <td className="py-2 px-2 font-medium text-slate-200 print:text-black">
                        <div>{t.title}</div>
                        {t.note && <div className="text-[10px] text-slate-500 print:text-gray-500 italic">{t.note}</div>}
                      </td>
                      <td className="py-2 px-2 text-[10px] text-slate-400 print:text-gray-600">
                        {acc?.name || 'Wallet'}
                      </td>
                      <td className={`py-2 px-2 text-right font-bold whitespace-nowrap ${
                        isIncome ? 'text-emerald-400 print:text-emerald-700' : isExpense ? 'text-white print:text-black' : 'text-cyan-400 print:text-cyan-700'
                      }`}>
                        {isIncome ? '+' : isExpense ? '-' : ''}{formatMoney(t.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statement Footer */}
        <div className="pt-4 border-t border-slate-800 print:border-gray-300 flex items-center justify-between text-[10px] text-slate-500 print:text-gray-500">
          <span>FlowGuard Automated Personal Finance & Audit System</span>
          <span>End of Statement</span>
        </div>
      </div>

      {/* Bottom Share / Copy Buttons (hidden during print) */}
      <div className="print:hidden flex items-center gap-2">
        <button
          onClick={handleCopySummary}
          className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
        >
          {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Summary Copied to Clipboard!' : 'Copy Statement Summary'}</span>
        </button>
      </div>

    </div>
  );
};
