import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Sliders, 
  Award, 
  FileText, 
  Smartphone,
  Check,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';

interface VideoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTourModal: React.FC<VideoTourModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isTapping, setIsTapping] = useState(false);

  const steps = [
    // 1. PIN KEYPAD UNLOCK
    {
      title: '1. PIN Access & Keypad Unlock',
      subtitle: 'Finger types PIN "1234" (Admin Master Key)',
      narration: 'Watch the finger tap digits 1, 2, 3, and 4 on the keypad. The vault unlocks Benard Cheruiyot\'s confidential enterprise cashbooks.',
      cursorSeq: [
        { x: 25, y: 65, delay: 300 },
        { x: 50, y: 65, delay: 900 },
        { x: 75, y: 65, delay: 1500 },
        { x: 25, y: 75, delay: 2100 }
      ],
      renderScreen: () => (
        <div className="flex flex-col justify-between h-full py-2 text-center select-none">
          <div className="space-y-1">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-white text-sm">BC</div>
            </div>
            <div className="text-xs font-bold text-white">Benard Cheruiyot</div>
            <div className="text-[9px] text-slate-400">Security • Real Estate • Rentals • Tea</div>
          </div>

          <div className="flex justify-center gap-2.5 my-1">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 px-3 text-xs font-bold text-slate-200">
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">1</div>
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">2</div>
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">3</div>
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">4</div>
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">5</div>
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">6</div>
          </div>

          <div className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20 mx-2">
            ✓ Access Granted • Loading Dashboard...
          </div>
        </div>
      )
    },

    // 2. DEBTORS (ADD, EDIT, COLLECT)
    {
      title: '2. Debtors: Adding, Editing & 1-Tap Recovery',
      subtitle: 'Add Peter Koech (20k), edit Apex, collect rent',
      narration: 'Watch the finger tap "+ Add Debtor" to record Peter Koech (20k), edit Apex Logistics, and collect KSh 15,000 rent arrears from tenant Kiprono into M-PESA.',
      cursorSeq: [
        { x: 80, y: 15, delay: 500 },
        { x: 50, y: 35, delay: 1500 },
        { x: 50, y: 65, delay: 2700 }
      ],
      renderScreen: () => (
        <div className="flex flex-col h-full space-y-1.5 select-none">
          <div className="flex justify-between items-center pb-1 border-b border-slate-800 text-[10px]">
            <span className="font-bold text-white">Debtors & Receivables</span>
            <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">+ Add Debtor</span>
          </div>

          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500 rounded-lg space-y-0.5">
            <div className="flex justify-between text-[10px] font-bold text-emerald-300">
              <span>✓ Peter Koech (New)</span>
              <span>20,000</span>
            </div>
            <div className="text-[8px] text-slate-400">Security contract arrears added</div>
          </div>

          <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between text-[10px]">
              <div>
                <div className="font-bold text-white">Kiprono (Lonjo Unit 4)</div>
                <div className="text-[8px] text-slate-400">2 months rent arrears</div>
              </div>
              <span className="font-black text-emerald-400">15,000</span>
            </div>
            <button className="w-full py-1 bg-emerald-500 text-white font-bold text-[8px] rounded">
              ✓ Collect Payment (M-PESA)
            </button>
          </div>

          <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-[9px] text-center text-emerald-400 font-bold">
            🎉 KSh 15,000 Credited into M-PESA Till!
          </div>
        </div>
      )
    },

    // 3. DELETE & 1-TAP UNDO
    {
      title: '3. Deleting an Item & Restoring with 1-Tap Undo',
      subtitle: 'Accidental delete ➔ Instant Undo toast',
      narration: 'Watch what happens when an item is deleted. A floating "Item deleted — [Undo]" banner pops up at the bottom. Tapping Undo restores it instantly.',
      cursorSeq: [
        { x: 85, y: 40, delay: 500 },
        { x: 75, y: 88, delay: 1800 }
      ],
      renderScreen: () => (
        <div className="flex flex-col h-full justify-between select-none">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-white pb-1 border-b border-slate-800">
              Recent Transactions & Items
            </div>

            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-[10px]">
              <div>
                <div className="font-bold">Shell Petrol Station</div>
                <div className="text-[8px] text-slate-400">-KSh 4,500 • Fuel</div>
              </div>
              <span className="text-slate-500">🗑️</span>
            </div>

            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-[10px] opacity-40 line-through">
              <div>
                <div className="font-bold">Barber Grooming</div>
                <div className="text-[8px] text-slate-400">-KSh 3,000 (Deleted)</div>
              </div>
            </div>
          </div>

          {/* Undo Toast */}
          <div className="p-2 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl flex items-center justify-between gap-1 text-[9px] animate-bounce">
            <div className="flex items-center gap-1.5">
              <span>🗑️</span>
              <span className="font-bold text-white">Barber Deleted</span>
            </div>
            <button className="px-2 py-0.5 bg-emerald-500 text-white font-bold rounded shadow">
              🔄 Undo
            </button>
          </div>
        </div>
      )
    },

    // 4. CENTER "+" BUTTON ACTION
    {
      title: '4. Center "+" Button: Quick Transaction Logging',
      subtitle: 'Taps glowing "+" button ➔ Logs Fuel/Shopping in 2s',
      narration: 'Watch the finger tap the glowing center "+" button at the bottom navigation bar. Quick logger opens and records transactions in 2 seconds.',
      cursorSeq: [
        { x: 50, y: 92, delay: 500 },
        { x: 25, y: 35, delay: 1400 },
        { x: 50, y: 78, delay: 2600 }
      ],
      renderScreen: () => (
        <div className="flex flex-col h-full justify-between select-none">
          <div className="p-2 bg-slate-900 border border-emerald-500 rounded-xl space-y-1.5 shadow-xl">
            <div className="flex justify-between items-center pb-1 border-b border-slate-800 text-[10px] font-bold text-emerald-400">
              <span>+ Quick Transaction Logger</span>
              <span className="text-slate-400">✕</span>
            </div>

            <div className="grid grid-cols-3 gap-1 text-[8px] font-bold text-center">
              <div className="p-1 bg-rose-500 text-white rounded">Expense</div>
              <div className="p-1 bg-slate-800 text-slate-400 rounded">Income</div>
              <div className="p-1 bg-slate-800 text-slate-400 rounded">Transfer</div>
            </div>

            <div className="space-y-1 text-[9px]">
              <div>
                <span className="text-slate-400">Category:</span>
                <div className="p-1 bg-slate-950 rounded border border-slate-800 font-bold">⛳ Golf Club Membership</div>
              </div>
              <div>
                <span className="text-slate-400">Amount (KSh):</span>
                <div className="p-1 bg-slate-950 rounded border border-emerald-500 text-emerald-400 font-black text-xs">12,000.00</div>
              </div>
            </div>

            <button className="w-full py-1 bg-emerald-500 rounded-lg text-white font-bold text-[9px] shadow">
              ✓ Record Golf Expense
            </button>
          </div>

          {/* Bottom Bar */}
          <div className="p-1 bg-slate-900 rounded-xl border border-slate-800 flex justify-around items-center text-[8px] text-slate-400">
            <span>🏠 Home</span>
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow ring-2 ring-emerald-500/30">
              +
            </div>
            <span>📋 Records</span>
          </div>
        </div>
      )
    },

    // 5. AUTO SPLIT 50/30/20
    {
      title: '5. Auto-Split Dispatcher: Allocating KSh 220,000',
      subtitle: 'Prevents money leaks the moment income arrives',
      narration: 'Watch the finger receive KSh 220,000 and trigger the 50/30/20 Auto-Split: 50% (110k) for Ops/Fuel, 30% (66k) for Leisure, and 20% (44k) for SACCOs.',
      cursorSeq: [
        { x: 50, y: 25, delay: 500 },
        { x: 75, y: 55, delay: 1600 },
        { x: 50, y: 88, delay: 2800 }
      ],
      renderScreen: () => (
        <div className="flex flex-col h-full space-y-1 select-none">
          <div className="p-2 bg-slate-900 border border-emerald-500/50 rounded-xl space-y-1 flex-1 flex flex-col justify-between shadow-xl">
            <div className="space-y-1">
              <div className="flex justify-between items-center pb-1 border-b border-slate-800 text-[10px] font-bold text-emerald-400">
                <span>✨ 50/30/20 Auto-Splitter</span>
                <span className="text-[8px] text-slate-400">KSh 220,000</span>
              </div>

              <div className="space-y-1 text-[9px]">
                <div className="flex justify-between">
                  <span>🏢 Office & Fuel (50%)</span>
                  <span className="font-bold text-cyan-400">110,000</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-1/2"></div>
                </div>

                <div className="flex justify-between mt-0.5">
                  <span>⛳ Golf & Leisure (30%)</span>
                  <span className="font-bold text-amber-400">66,000</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[30%]"></div>
                </div>

                <div className="flex justify-between mt-0.5">
                  <span>🏦 Imarisha SACCO (20%)</span>
                  <span className="font-bold text-emerald-400">44,000</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[20%]"></div>
                </div>
              </div>
            </div>

            <button className="w-full py-1.5 bg-emerald-500 rounded-lg text-white font-bold text-[9px] shadow">
              🎉 Execute 50/30/20 Allocation
            </button>
          </div>
        </div>
      )
    },

    // 6. EXPENSES: ADD, EDIT, FAST LOG
    {
      title: '6. Expenses: Adding Cost Centers & Fast Log',
      subtitle: 'Add Gym Club (6k), edit Fuel (25k), log Caddy',
      narration: 'Watch the finger tap "+ Add Expense" to create Gym Club (6k), adjust Travelling & Fuel budget to 25k, and fast log Golf Caddy fees in 2 seconds.',
      cursorSeq: [
        { x: 80, y: 15, delay: 500 },
        { x: 60, y: 40, delay: 1500 },
        { x: 80, y: 70, delay: 2700 }
      ],
      renderScreen: () => (
        <div className="flex flex-col h-full space-y-1 select-none">
          <div className="flex justify-between items-center pb-1 border-b border-slate-800 text-[10px]">
            <span className="font-bold text-white">Expenses & Cost Centers</span>
            <span className="text-[8px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded">+ Add Expense</span>
          </div>

          <div className="space-y-1 flex-1 overflow-hidden text-[9px]">
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/40 rounded-lg flex justify-between items-center">
              <span className="font-bold text-emerald-300">✓ Gym & Swimming (New)</span>
              <span className="text-emerald-400 font-bold">6,000</span>
            </div>

            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-bold text-white">⛽ Travelling & Fuel</div>
                <div className="text-[8px] text-slate-400">Budget: 25,000 / mo</div>
              </div>
              <span className="text-[8px] bg-slate-800 px-1 py-0.5 rounded text-slate-300">Edit ✏️</span>
            </div>

            <div className="p-1.5 bg-rose-500/10 border border-rose-500/40 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-bold text-rose-300">⛳ Golf Caddy Tips</div>
                <div className="text-[8px] text-slate-400">-KSh 3,000 Paid</div>
              </div>
              <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">Fast Log</span>
            </div>
          </div>
        </div>
      )
    },

    // 7. STATEMENTS & PROFILE ADMIN KEY
    {
      title: '7. Official PDF Statements & Admin Key 1234',
      subtitle: 'Print PDF statement + Admin backdoor active',
      narration: 'Watch the finger generate a bank-ready PDF financial statement, and verify that Admin Master PIN 1234 remains permanently active for support.',
      cursorSeq: [
        { x: 50, y: 35, delay: 500 },
        { x: 50, y: 70, delay: 1800 }
      ],
      renderScreen: () => (
        <div className="flex flex-col h-full space-y-1.5 justify-between select-none">
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="flex justify-between items-center pb-1 border-b border-slate-800 text-[10px] font-bold text-white">
              <span>Financial Statements</span>
              <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 rounded">PDF Ready</span>
            </div>

            <div className="p-1.5 bg-slate-950 rounded text-center text-[9px]">
              <div className="text-slate-400">Monthly Statement: <strong className="text-white">Benard Cheruiyot</strong></div>
              <div className="text-xs font-black text-emerald-400 mt-0.5">+ KSh 64,700.00 Surplus</div>
            </div>

            <button className="w-full py-1 bg-emerald-500 rounded text-white font-bold text-[9px] shadow">
              📄 Print / Save PDF Statement
            </button>
          </div>

          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[8px] space-y-0.5">
            <div className="font-bold text-emerald-400">🔑 Admin Master Key 1234 Active</div>
            <div className="text-slate-300">You can always log in with 1234 for troubleshooting.</div>
          </div>
        </div>
      )
    }
  ];

  const current = steps[currentStep];

  useEffect(() => {
    if (!isOpen) return;

    // Speak narration if audio enabled
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(current.narration);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    // Trigger cursor sequence for current step
    current.cursorSeq.forEach((point) => {
      setTimeout(() => {
        setCursorPos({ x: point.x, y: point.y });
        setIsTapping(true);
        setTimeout(() => setIsTapping(false), 300);
      }, point.delay);
    });

    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 6500);
    return () => {
      clearInterval(interval);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isOpen, isPlaying, isMuted, currentStep, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="p-3 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interactive Phone Manual & Walkthrough
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/video_manual.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 transition flex items-center gap-1"
            >
              <span>🖥️ HD Fullscreen</span>
            </a>
            <button 
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Interactive Screen Stage */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-center">
          
          {/* Simulated Mobile Phone Chassis */}
          <div className="w-[200px] h-[360px] bg-slate-950 border-[6px] border-slate-800 rounded-[32px] shadow-2xl relative flex flex-col overflow-hidden shrink-0">
            
            {/* Dynamic Island Bar */}
            <div className="bg-slate-900 px-3 pt-1.5 pb-1 flex items-center justify-between text-[8px] text-slate-400 border-b border-slate-800 select-none">
              <span className="font-bold text-white">09:41</span>
              <div className="w-8 h-2 bg-black rounded-full"></div>
              <div className="w-2.5 h-1.5 bg-emerald-500 rounded-xs"></div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 bg-slate-950 p-2 overflow-hidden relative">
              {current.renderScreen()}

              {/* Animated Finger Cursor */}
              <div 
                className="absolute z-50 pointer-events-none transition-all duration-500 -translate-x-2 -translate-y-2 flex items-center justify-center"
                style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
              >
                <div className={`w-5 h-5 rounded-full bg-emerald-400/90 border border-white flex items-center justify-center text-[8px] text-black shadow-lg transition-transform ${isTapping ? 'scale-75 ring-4 ring-emerald-400/40' : 'scale-100'}`}>
                  👆
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="h-2.5 bg-slate-900 flex items-center justify-center">
              <div className="w-12 h-0.5 bg-slate-600 rounded-full"></div>
            </div>
          </div>

          {/* Narration & Storyboard Card */}
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
                {current.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{current.subtitle}</p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
              "{current.narration}"
            </div>

            {/* Audio narration mute toggle & Progress Indicators */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentStep(i);
                      setIsPlaying(false);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold"
              >
                {isMuted ? '🔇 Unmute' : '🔊 Voice On'}
              </button>
            </div>
          </div>
        </div>

        {/* Playback Controls Footer */}
        <div className="p-3 px-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow transition active:scale-95"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause Video' : 'Resume Video'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentStep((prev) => (prev + 1) % steps.length);
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
