import React, { useEffect, useState } from "react";
import { CheckCircle, Eye, Lock, Shield, History, Info } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { getHistory } from "../../services/allocation.service";

/* =========================
   Types
========================= */

interface HistoryItem {
  id: number;
  iterationCount: number;
  selectedSet: number;
  ts: string;
  subjectName: string;
  shiftStartTime: string;
}

interface RightSidebarProps {
  activeExamName: string;
  activeExamId: number | null;
}

/* =========================
   Component
========================= */

const RightSidebar: React.FC<RightSidebarProps> = ({
  activeExamName,
  activeExamId,
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryItem[]>([]);

  /* =========================
     Fetch History
  ========================= */

  useEffect(() => {
    fetchHistory();
  }, [activeExamId]);

  const fetchHistory = async () => {
    try {
      const data = await getHistory(activeExamId || undefined);

      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  /* =========================
     Helpers
  ========================= */

  const getSetColor = (setNum: number) => {
    const colors = [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Purple",
      "Orange",
      "Teal",
      "Pink",
      "Amber",
      "Indigo",
    ];

    return colors[(setNum - 1) % colors.length];
  };

  /* =========================
     Loading State
  ========================= */

  if (loading || !user) {
    return (
      <div className="w-80 bg-white border-l border-slate-100 flex flex-col animate-pulse p-6 gap-6">
        <div className="h-32 bg-slate-50 rounded-2xl"></div>
        <div className="h-64 bg-slate-50 rounded-2xl"></div>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="w-80 bg-white border-l border-slate-100 flex flex-col">
      {/* Auth Status */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 mb-3 uppercase">
            Auth Status
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                Selector ID
              </span>

              <span className="bg-[#0b1628] text-white px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest border border-slate-800">
                {user.username}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-50">
              <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest leading-none">
                <Shield size={14} className="animate-pulse" />

                <span>Full Clearance Granted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Allocations */}
      <div className="px-6 pb-6 flex flex-col">
        <div className="bg-[#0b1628] rounded-2xl p-6 flex flex-col shadow-xl relative overflow-hidden">
          <div className="flex flex-col mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <CheckCircle size={18} className="text-emerald-400" />
              </div>

              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                Completed Allocations
              </h3>
            </div>

            {activeExamName && (
              <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest mt-2 ml-[46px]">
                For: {activeExamName}
              </p>
            )}
          </div>

          {/* History List */}
          <div className="space-y-3 flex-1 pr-1 custom-scrollbar">
            {history.length === 0 ? (
              <div className="py-10 text-center">
                <History
                  size={32}
                  className="text-slate-700 mx-auto mb-3 opacity-20"
                />

                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  No recent protocols
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/15 border border-white/20 rounded-xl p-3.5 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                      {item.shiftStartTime.substring(0, 5)} Shift
                    </p>

                    <div className="flex items-center gap-1 bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 text-[8px] font-black uppercase tracking-tighter">
                      <Lock size={8} />
                      Verified
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2">
                    {item.subjectName}
                  </h4>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-slate-200 font-medium">
                      Iteration:
                      <span className="text-white font-bold ml-1">
                        {item.iterationCount}
                      </span>
                    </p>

                    <p className="text-[10px] text-slate-400 font-medium">
                      Final Set:
                      <span className="text-white font-bold ml-1">
                        {item.selectedSet}
                      </span>
                      <span className="opacity-75 ml-1">
                        ({getSetColor(item.selectedSet)})
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Button */}
          <button
            onClick={() => navigate("/audit-log")}
            className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-black py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all text-[10px] uppercase tracking-[0.2em] border border-white/30"
          >
            <Eye size={14} />
            View Full Audit Log
          </button>
        </div>
      </div>

      {/* Protocol Note */}
      <div className="px-6 pb-6">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex items-start gap-4">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl mt-1">
            <Info size={16} />
          </div>

          <div>
            <h4 className="text-[11px] font-black text-[#0b1628] uppercase tracking-widest mb-1.5">
              Protocol Note
            </h4>

            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              The randomization engine uses a quantum-resistant seed generator.
              Ensure all selection parameters are verified before clicking the
              allocation trigger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
