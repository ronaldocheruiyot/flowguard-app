import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, adminPin?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  requireReason?: boolean;
  reasonPlaceholder?: string;
  requireAdminPin?: boolean;
  isDangerous?: boolean;
  itemDetails?: { label: string; value: string }[];
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm & Proceed',
  cancelText = 'Cancel',
  requireReason = false,
  reasonPlaceholder = 'Please state the reason for this action (mandatory for audit trail)...',
  requireAdminPin = false,
  isDangerous = false,
  itemDetails
}) => {
  const [reason, setReason] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setError('A reason is mandatory to maintain compliance in the Audit Trail.');
      return;
    }
    if (requireAdminPin && (!adminPin.trim() || adminPin.length < 4)) {
      setError('Please enter the 4-digit Admin PIN to authorize this action.');
      return;
    }
    setError('');
    onConfirm(reason.trim(), adminPin.trim());
    setReason('');
    setAdminPin('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            isDangerous 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {isDangerous ? <ShieldAlert size={22} /> : <AlertTriangle size={22} />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Optional Item Details Card */}
        {itemDetails && itemDetails.length > 0 && (
          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 space-y-1.5">
            {itemDetails.map((detail, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{detail.label}:</span>
                <span className="font-semibold text-slate-200">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Reason Input */}
          {requireReason && (
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Reason for Action <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={reasonPlaceholder}
                className="w-full bg-slate-800/90 border border-slate-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 transition resize-none placeholder:text-slate-500"
              />
            </div>
          )}

          {/* Admin PIN Input */}
          {requireAdminPin && (
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Admin Authorization PIN <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                maxLength={6}
                required
                value={adminPin}
                onChange={(e) => {
                  setAdminPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter 4-digit Admin PIN"
                className="w-full bg-slate-800/90 border border-slate-700 text-center tracking-[0.4em] font-mono text-sm text-white rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          {error && (
            <p className="text-[11px] font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-lg p-2 text-center">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className={`py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition shadow-lg ${
                isDangerous
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{confirmText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
