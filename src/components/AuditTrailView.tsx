import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  UserCheck, 
  FileSpreadsheet,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { AuditLogEntry } from '../types/finance';
import { ConfirmActionModal } from './ConfirmActionModal';

export const AuditTrailView: React.FC = () => {
  const { 
    auditLogs, 
    clearAuditLogs, 
    formatMoney, 
    user, 
    validateAdminPin 
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const filteredLogs = auditLogs.filter(log => {
    if (selectedEntity !== 'all' && log.entityType !== selectedEntity) return false;
    if (selectedAction !== 'all' && log.action !== selectedAction) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = log.entityName.toLowerCase().includes(q);
      const matchReason = log.reason?.toLowerCase().includes(q);
      const matchPerformer = log.performedBy.toLowerCase().includes(q);
      if (!matchName && !matchReason && !matchPerformer) return false;
    }
    return true;
  });

  const getActionBadge = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'create':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Created</span>;
      case 'update':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Modified</span>;
      case 'delete':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">Deleted</span>;
      case 'restore':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Restored</span>;
      case 'collect':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Collected</span>;
      case 'repay':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">Repaid</span>;
      case 'auth':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">Auth</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Action</span>;
    }
  };

  const handleExportAuditCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Performer', 'Entity Type', 'Entity Name', 'Action', 'Reason', 'Field Changes'];
    const rows = filteredLogs.map(l => {
      const diffStr = (l.changes || []).map(c => `${c.label}: ${c.oldVal} -> ${c.newVal}`).join(' | ');
      return [
        l.id,
        l.timestamp,
        `"${l.performedBy.replace(/"/g, '""')}"`,
        l.entityType,
        `"${l.entityName.replace(/"/g, '""')}"`,
        l.action,
        `"${(l.reason || '').replace(/"/g, '""')}"`,
        `"${diffStr.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FlowGuard-Audit-Trail-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-900/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <History size={20} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Enterprise Compliance & Transparency
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Change Tracker & Audit Trail
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Inspect all recorded modifications, previous vs new values, user authorizations, and mandatory reasons for deletions and restorations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportAuditCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 px-3.5 rounded-2xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-bold py-2.5 px-3.5 rounded-2xl border border-rose-800/60 transition flex items-center gap-1.5"
            >
              <Trash2 size={15} />
              <span>Clear Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by entity name, user, or reason..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Entity Type Filter */}
          <div>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Entity Types</option>
              <option value="debtor">Debtors & Receivables</option>
              <option value="loan">Loans & SACCOs</option>
              <option value="envelope">Budget Vaults</option>
              <option value="income">Income Streams</option>
              <option value="expense">Expense Centers</option>
              <option value="account">Bank & Float Accounts</option>
              <option value="transaction">Transactions Ledger</option>
              <option value="security">Security & Auth</option>
              <option value="system">System Operations</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Actions</option>
              <option value="create">Created</option>
              <option value="update">Modified</option>
              <option value="delete">Deleted</option>
              <option value="restore">Restored</option>
              <option value="collect">Collected Receivable</option>
              <option value="repay">Loan Amortization</option>
              <option value="auth">Security Auth</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
            <History size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-bold text-slate-400">No matching audit trail records found</p>
            <p className="text-xs text-slate-600 mt-1">Try clearing filters or performing actions across the app</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const dateObj = new Date(log.timestamp);
            const formattedTime = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : log.timestamp;

            return (
              <div 
                key={log.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-4.5 space-y-3 shadow-sm transition"
              >
                {/* Top Row: Action badge, Entity Name, Timestamp, Performer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {getActionBadge(log.action)}
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {log.entityType}
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {log.entityName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      <span>{formattedTime}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-300">
                      <UserCheck size={12} className="text-indigo-400" />
                      <span>{log.performedBy}</span>
                    </span>
                  </div>
                </div>

                {/* Reason (if provided) */}
                {log.reason && (
                  <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800/80 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                      Stated Reason / Audit Memo:
                    </span>
                    <p className="text-slate-300 font-medium italic">
                      "{log.reason}"
                    </p>
                  </div>
                )}

                {/* Field-level Diffs (Old Value -> New Value) */}
                {log.changes && log.changes.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Field-Level Modifications:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {log.changes.map((change, idx) => (
                        <div key={idx} className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-400">{change.label}:</span>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-rose-400 line-through bg-rose-950/40 px-1.5 py-0.5 rounded">
                              {typeof change.oldVal === 'number' ? formatMoney(change.oldVal) : String(change.oldVal ?? 'None')}
                            </span>
                            <ArrowRight size={12} className="text-slate-500 shrink-0" />
                            <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded">
                              {typeof change.newVal === 'number' ? formatMoney(change.newVal) : String(change.newVal ?? 'None')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Clear Confirmation Modal requiring Admin PIN */}
      <ConfirmActionModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={(_reason, adminPin) => {
          if (adminPin && validateAdminPin(adminPin)) {
            clearAuditLogs();
            setIsClearModalOpen(false);
          } else {
            alert('Invalid Admin PIN. Audit trail purge was blocked.');
          }
        }}
        title="Purge Audit Trail"
        message="Clearing the audit trail will permanently remove recorded modification history. This action is restricted to Administrators and requires your 4-digit Admin PIN."
        confirmText="Purge History"
        requireAdminPin={true}
        requireReason={false}
        isDangerous={true}
      />
    </div>
  );
};
