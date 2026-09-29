import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Play, 
  Download, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Users, 
  Landmark, 
  ReceiptText, 
  FileSpreadsheet, 
  History, 
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const UserManualView: React.FC = () => {
  const { user, currency } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('income-windfalls');
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  interface ManualTopic {
    id: string;
    title: string;
    category: string;
    icon: React.ReactNode;
    summary: string;
    steps: string[];
    tips: string[];
  }

  const manualTopics: ManualTopic[] = [
    {
      id: 'income-windfalls',
      title: '1. Recording Income: Recurring Streams vs. Unexpected Windfalls',
      category: 'Inflow Management',
      icon: <ReceiptText size={18} className="text-emerald-400" />,
      summary: 'Differentiate between steady predictable business revenue and surprise one-off lump sums.',
      steps: [
        'Predictable Monthly Streams: Open "Income" in the sidebar to configure your monthly baselines (Security Retainer 100k, Lonjo Rentals 50k, Agency 50k, Tea Farm 20k).',
        'One-Off / Surprise Windfalls (Plot sales, sudden tenders, asset sale): Tap the center "+" button -> select "Income" tab.',
        'Enter the exact windfall amount (e.g. KSh 1,500,000), title (e.g. Kapsoit Plot Sale), category (Debtor Recovery / Other Income), and select the receiving Bank or M-PESA account.',
        'Tap Save Transaction to update your liquid balances without distorting your monthly recurring projections.'
      ],
      tips: [
        'Leave "Trigger Auto-Split" checked to immediately ring-fence windfall money into Wealth / MMF Vaults before it gets spent.',
        'View the windfall in the Transactions log, Accounts ledger, and monthly Financial Statement.'
      ]
    },
    {
      id: 'auto-split-vaults',
      title: '2. Auto-Split Envelope Budgeting & Digital Vaults',
      category: 'Budgeting & Rings',
      icon: <Layers size={18} className="text-indigo-400" />,
      summary: 'Prevent salary and business revenue from leaking by pre-allocating money into digital envelopes.',
      steps: [
        'Open "Auto-Split Vaults" from the left sidebar.',
        'Inspect your active vaults (Office & Business Ops, Household Living, Transport & Fuel, Golf & Leisure, SACCO Loans).',
        'Tap "+ Add Vault" to create a new category (e.g., Staff Payroll, Security Uniforms). Set a target monthly budget and initial balance.',
        'When income arrives, the Auto-Split Engine calculates the exact mathematical percentage for each vault (e.g. 50% Needs, 30% Wants, 20% Savings).'
      ],
      tips: [
        'You can edit or delete any vault at any time with full undo recovery.',
        'Deleting a vault requires a mandatory reason to record in the Audit Trail.'
      ]
    },
    {
      id: 'debtors-receivables',
      title: '3. Debtors & Collections Inflow Tracking',
      category: 'Credit & Receivables',
      icon: <Users size={18} className="text-amber-400" />,
      summary: 'Track unpaid tenant rent, security client balances, and factory adjustment dues.',
      steps: [
        'Open "Debtors & Receivables" from the sidebar.',
        'View debtor cards with progress bars and status badges (Pending, Partially Paid, Settled).',
        'To register a new debtor, tap "+ Register Debtor", enter the name, amount owed, contact phone, and due date.',
        'When the debtor pays: tap "Collect Payment", enter the collected amount, and choose which Account (KCB Bank or M-PESA Till) receives the money.',
        'The app automatically marks the payment, changes debtor status, and records an Income Transaction in your financial ledger.'
      ],
      tips: [
        'All debtor receipts appear in Analytics, Statements, and the Audit Trail.',
        'Debtors cards keep a historical ledger of every installment paid.'
      ]
    },
    {
      id: 'loans-debt-servicing',
      title: '4. Loans & SACCO Debt Amortization Manager',
      category: 'Liabilities',
      icon: <Landmark size={18} className="text-rose-400" />,
      summary: 'Monitor K&M SACCO commercial facilities, Imarisha SACCO loans, and Personal/Fuliza overdrafts.',
      steps: [
        'Open "Loans & SACCOs" in the sidebar.',
        'Review remaining balances, monthly installments commitment, and interest rates.',
        'When paying your monthly checkoff: tap "Log Amortization Repayment".',
        'Enter the installment amount (e.g. KSh 20,000) and select the source account.',
        'The remaining loan balance decreases immediately, and an Expense Transaction is created in your ledger.'
      ],
      tips: [
        'When the remaining balance reaches 0, the facility is automatically flagged as "Paid Off".',
        'Repayments are captured in the monthly statement loan debt amortization metrics.'
      ]
    },
    {
      id: 'date-filtering-statements',
      title: '5. Date Range Filtering & PDF Statement Generation',
      category: 'Reporting & Export',
      icon: <FileSpreadsheet size={18} className="text-cyan-400" />,
      summary: 'Filter your finances by time periods and generate official audit-ready PDF statements.',
      steps: [
        'Open "Financial Statements" or "Analytics".',
        'Click on the time period buttons: "This Week", "This Month", "Last Month", "Full Year", or "Custom".',
        'All totals (Total Income Inflow, Total Expenses Outflow, Debtor Collections, Net Surplus) dynamically recalculate based on the chosen period.',
        'Tap "Download PDF Statement" to generate a branded, formatted PDF document.',
        'Tap "Upload to Google Drive" to backup your statement directly to cloud storage.'
      ],
      tips: [
        'Filtered statements strictly include only transactions that occurred within the selected window.',
        'Statements include full category breakdowns, income streams, and leak analysis.'
      ]
    },
    {
      id: 'audit-trail-traceability',
      title: '6. Change Tracker & Audit Trail Compliance',
      category: 'Compliance',
      icon: <History size={18} className="text-purple-400" />,
      summary: 'Field-level diff tracking (Old Value -> New Value) for every edit and deletion.',
      steps: [
        'Open "Change Audit Trail" from the sidebar.',
        'Review the chronological log of all modifications performed in FlowGuard.',
        'Every deletion or restoration displays the user-stated reason.',
        'Use the filters to search by Entity Type (Debtors, Loans, Vaults, Accounts, Security) or Action (Create, Update, Delete, Collect, Repay).',
        'Export the full audit trail to CSV for external accounting audits.'
      ],
      tips: [
        'Purging the audit trail is restricted to Administrators and requires your 4-digit Admin PIN.',
        'Deleted items can be recovered via the Recycle Bin.'
      ]
    },
    {
      id: 'security-admin-pin',
      title: '7. Discreet Admin PIN & Biometric Authentication',
      category: 'Security',
      icon: <ShieldCheck size={18} className="text-emerald-400" />,
      summary: 'Multi-tiered access control protecting enterprise financial data.',
      steps: [
        'Standard User PIN (Default: 1234): Used for quick day-to-day app unlock.',
        'Discreet Admin PIN (Default: 9999): High-security PIN required for factory resets, audit purges, and system settings.',
        'Biometric / Fingerprint Sensor: Use device fingerprint scanner for 1-tap instant verification without typing passwords.',
        'Change both PINs anytime inside "Settings & Security".'
      ],
      tips: [
        'Keep your Admin PIN confidential and separate from the standard unlock PIN.'
      ]
    }
  ];

  const filteredTopics = manualTopics.filter(t => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.steps.some(s => s.toLowerCase().includes(q))
    );
  });

  const activeTopic = manualTopics.find(t => t.id === activeSectionId) || manualTopics[0];

  const handleDownloadPDFManual = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('FlowGuard Enterprise Edition - Official User Manual', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Prepared for: ${user.name} (${user.role})`, 14, 28);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 34);

    let currentY = 44;

    manualTopics.forEach((topic, idx) => {
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(topic.title, 14, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(topic.summary, 14, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      topic.steps.forEach(step => {
        const splitText = doc.splitTextToSize(`• ${step}`, 180);
        doc.text(splitText, 16, currentY);
        currentY += splitText.length * 5;
      });

      currentY += 6;
    });

    doc.save(`FlowGuard-Enterprise-User-Manual-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/60 border border-amber-900/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <BookOpen size={20} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Documentation & Knowledge Base
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              FlowGuard User Manual & Video Guides
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Comprehensive operational manual for tracking income streams, debt collection inflows, SACCO loan amortizations, and PDF statement exports.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadPDFManual}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg shadow-amber-950/50 transition flex items-center gap-2"
            >
              <Download size={16} />
              <span>Download Printable Manual (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Video Simulation Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Play size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Video Walkthrough</h3>
              <p className="text-[11px] text-slate-400">Step-by-step visual simulation of FlowGuard Enterprise</p>
            </div>
          </div>

          <button
            onClick={() => setIsPlayingDemo(!isPlayingDemo)}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isPlayingDemo ? 'bg-rose-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            <Play size={14} />
            <span>{isPlayingDemo ? 'Pause Walkthrough' : 'Play Interactive Walkthrough'}</span>
          </button>
        </div>

        {isPlayingDemo ? (
          <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-pulse">
              <Sparkles size={28} />
            </div>
            <h4 className="text-base font-bold text-white">Interactive Enterprise Walkthrough</h4>
            <p className="text-xs text-slate-400 max-w-md">
              Demonstrating: Inflow Recording ➔ Auto-Split Allocation ➔ Debtor Payment Collection ➔ SACCO Loan Repayment ➔ PDF Generation.
            </p>
            <div className="w-full max-w-sm h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-3/4 animate-[pulse_2s_infinite]" />
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-200">Ready to watch the operational guide?</p>
              <p className="text-slate-400 text-[11px]">Click "Play Interactive Walkthrough" above to launch the simulation.</p>
            </div>
            <button
              onClick={() => setIsPlayingDemo(true)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold flex items-center gap-1"
            >
              <Play size={12} />
              <span>Launch</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search manual topics (e.g. 'unexpected income', 'debtors', 'sacco loans', 'admin pin')..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 shadow-md"
        />
      </div>

      {/* Documentation Layout: Side Topics + Active Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Topics List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Manual Chapters ({filteredTopics.length})
          </h3>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {filteredTopics.map(topic => {
              const isActive = activeSectionId === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveSectionId(topic.id)}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-start gap-3 border ${
                    isActive
                      ? 'bg-amber-500/15 text-white border-amber-500/40 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-950 shrink-0 mt-0.5">
                    {topic.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{topic.title}</p>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{topic.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Chapter Details */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {activeTopic.category}
            </span>
            <h2 className="text-lg font-black text-white tracking-tight mt-2">
              {activeTopic.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {activeTopic.summary}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Step-by-Step Execution Guide</span>
            </h3>

            <div className="space-y-2.5">
              {activeTopic.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          {activeTopic.tips.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-950/30 to-slate-950 p-4 rounded-2xl border border-emerald-900/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles size={12} /> Executive Tips & Compliance Notes
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeTopic.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
