import React, { useState, useEffect } from "react";

import {
  Lock,
  ChevronDown,
  Zap,
  FileText,
  Shield,
  Database,
  Radio,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getExamData } from "../../services/allocation.service";




interface Shift {
  id: number;
  startTime: string;
  endTime: string;
}

interface Subject {
  id: number;
  subjectName: string;
  setCount: number;
  usedSets: number[];
}

interface ExamData {
  id: number;
  configurationType: string;
  defaultConfiguration: any;
}

interface Exam {
  id: number;
  examName: string;
  examBodyName: string;
}

interface MainContentProps {
  activeExamId: number | null;
  activeExamName: string;
  activeExamBody: string;
  allExams: Exam[];
  onUpdateExamBody: (newName: string) => Promise<void>;
}




const MainContent: React.FC<MainContentProps> = ({
  activeExamId,
  activeExamName,
  activeExamBody,
  allExams,
  onUpdateExamBody,
}) => {
  const navigate = useNavigate();


  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [activeExamData, setActiveExamData] = useState<ExamData | null>(null);
  const [isEditingBody, setIsEditingBody] = useState<boolean>(false);
  const [tempBodyName, setTempBodyName] = useState<string>(activeExamBody);


  useEffect(() => {
    setTempBodyName(activeExamBody);
  }, [activeExamBody]);

  useEffect(() => {
    if (activeExamId) {
      fetchExamData();
    }
  }, [activeExamId]);


  const fetchExamData = async (): Promise<void> => {
    if (!activeExamId) return;

    setLoading(true);

    try {
      const data = await getExamData(activeExamId);
      setSubjects(data.subjects || []);
      setShifts(data.shifts || []);
      setActiveExamData(data.exam);

      if (data.subjects?.length > 0)
        setSelectedSubject(data.subjects[0].id.toString());

      if (data.shifts?.length > 0) setSelectedShift(data.shifts[0].id);
    } catch (err) {
      console.error("Failed to fetch exam data", err);
    } finally {
      setLoading(false);
    }
  };

  
  

  const getSetConfiguration = (idx: number) => {
    if (!activeExamData?.defaultConfiguration) return null;
    let config = activeExamData.defaultConfiguration;
    if (typeof config === "string") {
      try {
        config = JSON.parse(config);
      } catch (e) {
        console.error("Parse error", e);
        return null;
      }
    }

    if (Array.isArray(config)) return config[idx];
    if (config[idx] !== undefined) return config[idx];
    if (config[idx.toString()] !== undefined) return config[idx.toString()];
    const values = Object.values(config);
    if (values.length === 0) return null;
    return values[idx % values.length];
  };

  
  

  const handleProceed = () => {
    if (selectedSubject && selectedShift) {
      navigate(
        `/randomization-progress?subjectId=${selectedSubject}&shiftId=${selectedShift}&examId=${activeExamId}`,
      );
    }
  };

 
  

  return (
    <div className="flex-1 bg-[#f8fafc] p-6">
      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-lg mb-6 border border-emerald-300 shadow-sm shadow-emerald-500/5 tracking-[0.15em] uppercase">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
        LOCKED ALLOCATION NODE
      </div>
      <div className="mb-10">
        <h1 className="text-[42px] font-black text-[#0b1628] leading-[1.1] tracking-tighter">
          {activeExamName || "Internal Examination"} -
          <div className="inline-block group relative">
            {isEditingBody ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={tempBodyName}
                  onChange={(e) => setTempBodyName(e.target.value)}
                  onBlur={async () => {
                    setIsEditingBody(false);
                    if (tempBodyName !== activeExamBody) {
                      await onUpdateExamBody(tempBodyName);
                    }
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      setIsEditingBody(false);
                      if (tempBodyName !== activeExamBody) {
                        await onUpdateExamBody(tempBodyName);
                      }
                    }
                    if (e.key === "Escape") {
                      setTempBodyName(activeExamBody);
                      setIsEditingBody(false);
                    }
                  }}
                  autoFocus
                  className="bg-emerald-50 border-b-2 border-emerald-500 text-emerald-500 focus:outline-none px-2 min-w-[300px]"
                />
              </div>
            ) : (
              <span
                onClick={() => setIsEditingBody(true)}
                className="text-emerald-500 cursor-pointer hover:bg-emerald-50 rounded-lg px-2 transition-all"
                title="Click to edit Exam Body Name"
              >
                {activeExamBody || "National Medical Entrance"}
              </span>
            )}
          </div>
        </h1>
        <p className="text-slate-500 mt-4 text-sm leading-relaxed max-w-2xl font-medium">
          Authorized selector terminal for the{" "}
          <span className="text-slate-600 font-bold">{activeExamBody}</span>.
          Follow the three-step sequence to finalize the paper set randomization
          process {activeExamName ? `for ${activeExamName}` : ""}.
        </p>
      </div>

       <div className="grid grid-cols-1 gap-6 mb-10 max-w-3xl">
        {/* Step 1 - Subject Domain */}
        <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#0b1628] rounded-lg flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-900/10">
              01
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-2">
                Subject Domain
              </h3>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3.5 text-slate-900 font-bold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subjectName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 - Examination Shift */}
        <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#0b1628] rounded-lg flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-900/10">
              02
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-3">
                Examination Shift
              </h3>
              <div className="flex gap-3">
                {shifts.map((shift) => (
                  <button
                    key={shift.id}
                    onClick={() => setSelectedShift(shift.id)}
                    className={`flex-1 font-bold py-3.5 rounded-lg text-xs transition-all border ${
                      selectedShift === shift.id
                        ? "bg-[#0b1628] text-white border-[#0b1628] shadow-lg shadow-slate-900/20"
                        : "bg-slate-50 text-slate-500 border-slate-300 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                  >
                    {shift.startTime.substring(0, 5)} -{" "}
                    {shift.endTime.substring(0, 5)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 - Final Action */}
        <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#0b1628] rounded-lg flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-900/10">
              03
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-3">
                Final Action
              </h3>
              <button
                onClick={handleProceed}
                disabled={!selectedSubject || !selectedShift}
                className="w-full bg-gradient-to-r from-[#0b1628] to-[#1e293b] text-white font-black py-3.5 rounded-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                <Zap
                  size={20}
                  className="text-emerald-400 group-hover/btn:scale-125 transition-transform"
                />
                <span className="tracking-widest uppercase text-sm">
                  Proceed to Randomization
                </span>
              </button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield size={12} className="text-slate-700" />
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">
                  Immutable Audit Trail active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
<div className="bg-white rounded-lg p-8 border border-slate-300 shadow-sm max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <FileText size={22} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-[#0b1628] tracking-tight">
              Available Question Paper Sets
            </h3>
          </div>
          {/* <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {(() => {
                if (!activeExamData?.defaultConfiguration) return 0;
                let config = activeExamData.defaultConfiguration.length;
                if (typeof config === 'string') {
                  try { config = JSON.parse(config); } catch (e) { return 0; }
                }
                return Object.keys(config).length;
              })()} Sets Validated
            </span>
          </div> */}
        </div>

        <div className="grid grid-cols-5 gap-6">
          {activeExamData ? (
            Array.from({
              length:
                subjects.find((s) => s.id.toString() === selectedSubject)
                  ?.setCount || 0,
            }).map((_, idx) => {
              const setNum = idx + 1;
              const value = getSetConfiguration(idx);
              const currentSub = subjects.find(
                (s) => s.id.toString() === selectedSubject,
              );
              const isUsed = currentSub?.usedSets?.includes(setNum);
              const isColorMode = activeExamData.configurationType === "Colour";

              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-center gap-4 bg-white border border-slate-200 p-4 rounded-lg hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300"
                >
                  <div
                    className={`w-full aspect-square rounded-xl shadow-sm transition-all duration-500 ${!isUsed && value ? "group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-slate-200" : ""} flex items-center justify-center overflow-hidden relative ${isUsed ? "border-4 border-slate-100" : "bg-white shadow-inner border border-slate-50"}`}
                    style={
                      isColorMode && value && (value as string).startsWith("#")
                        ? { backgroundColor: value as string }
                        : {}
                    }
                  >
                    {/* Locked Overlay for used sets */}
                    {isUsed && (
                      <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1px] flex items-center justify-center z-20">
                        <div className="bg-white/90 p-2 rounded-full shadow-lg border border-slate-200">
                          <Lock size={16} className="text-slate-500" />
                        </div>
                      </div>
                    )}

                    {!isColorMode && value && (
                      <div className="flex flex-col items-center justify-center bg-white w-full h-full shadow-inner border-[3px] border-slate-50 rounded-[22px]">
                        <span className="text-[#0b1628] font-black text-2xl tracking-tighter relative z-10">
                          {value as string}
                        </span>
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      </div>
                    )}

                    {/* Colour Display fallback if not # format */}
                    {isColorMode &&
                      value &&
                      !(value as string).startsWith("#") && (
                        <span className="text-slate-500 font-black text-xs uppercase tracking-widest">
                          {value as string}
                        </span>
                      )}

                    {!value && (
                      <div className="flex flex-col items-center gap-2 opacity-20">
                        <Database size={20} className="text-slate-500" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter">
                          Unconfigured
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <p
                      className={`text-[10px] font-black  uppercase transition-colors ${isUsed ? "text-slate-700" : "text-slate-700 group-hover:text-emerald-500"}`}
                    >
                      {isUsed
                        ? "ALLOCATED"
                        : `Set Descriptor ${setNum.toString().padStart(2, "0")}`}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-5 py-12 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
              <FileText
                size={48}
                className="mx-auto text-slate-200 mb-4 opacity-20"
              />
              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                Awaiting Exam Metadata...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* System Monitor Bar */}
      <div className="mt-8 max-w-3xl flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-50 rounded-lg">
            <Radio size={16} className="text-emerald-500 animate-pulse" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-[#0b1628] uppercase tracking-widest leading-none">
              System Integrity Monitor
            </h4>
            <p className="text-[10px] text-slate-500 font-bold mt-1">
              Continuous credential validation active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Database size={12} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 tracking-widest uppercase">
              + DB Latency: 24ms
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <Radio size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase">
              Synced
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainContent;
