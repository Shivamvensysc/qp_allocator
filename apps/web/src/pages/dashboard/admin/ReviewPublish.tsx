import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BarChart2,
  CalendarDays,
  Layers,
  Clock,
  LayoutGrid,
  CheckCircle2,
  Info,
  Send,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  fetchExamById,
  updateExamStatus,
} from "../../../services/exam.service";
import type { ExamData, Mapping } from "../../../services/exam.service";
export default function ReviewPublish() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [data, setData] = useState<ExamData | null>(null);

  useEffect(() => {
    if (examId) {
      fetchExamById(examId)
        .then((resData: ExamData) => {
          setData(resData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [examId]);

  const handlePublish = async () => {
    if (!examId) return;
    setPublishLoading(true);

    try {
      await updateExamStatus(examId, "publish");
      alert("Exam published successfully!");
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Failed to publish";
      alert(`Error: ${errorMessage}`);
    } finally {
      setPublishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#14223E]" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-10 text-center">Exam not found</div>;
  }

  const { exam, shifts, subjects } = data;

  return (
    <div className="max-w-[1460px] mx-auto  min-h-screen bg-[#F9FAFB] text-slate-900 font-sans pb-24">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-10">
        <div className="max-w-3xl">
          <h1 className="text-[34px] font-bold text-[#14223E] tracking-tight leading-tight mb-3">
            Final Review: Review & Publish
          </h1>
          <p className="text-[15px] text-slate-600 leading-relaxed max-w-3xl">
            Verify all details before the examination is finalized and becomes
            active for selectors. Once published, core parameters cannot be
            altered without high-level clearance.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex bg-[#F5F5FA] rounded-xl px-6 py-4 gap-8 shrink-0">
          <div className="flex flex-col opacity-40">
            <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-1.5">
              Previous
            </span>
            <div className="flex flex-col text-[16px] font-bold text-[#8B9BB4] leading-[1.2]">
              <span>Event</span>
              <span>Core</span>
            </div>
          </div>
          <div className="w-16 flex items-center">
            <div className="h-[2px] w-full bg-[#D6DFE8]"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-1.5">
              Current Step
            </span>
            <div className="flex flex-col text-[16px] font-bold text-[#14223E] leading-[1.2]">
              <span>Final</span>
              <span>Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Section Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] mb-6">
        {/* Exam Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-[#14223E]" />
              <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                Exam Overview
              </h2>
            </div>
            <button
              onClick={() => navigate(`/admin/examconfigration?id=${examId}`)}
              className="text-sm font-bold text-[#14223E] hover:text-blue-600 transition"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-10 gap-x-8">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Exam Name
              </span>
              <span className="text-xl font-bold text-[#14223E]">
                {exam.examName}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Regulatory Body
              </span>
              <span className="text-xl font-bold text-[#14223E]">
                {exam.examBodyName}
              </span>
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Start Date
              </span>
              <div className="flex items-center gap-2 text-[17px] font-bold text-[#14223E]">
                <CalendarDays className="w-4 h-4 text-slate-700" />
                {new Date(exam.startDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                End Date
              </span>
              <div className="flex items-center gap-2 text-[17px] font-bold text-[#14223E]">
                <CalendarDays className="w-4 h-4 text-slate-700" />
                {new Date(exam.endDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Global Configuration */}
        <div className="bg-[#0b1727] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center">
          <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-8">
            Global Configuration
          </h2>

          <div className="flex items-end justify-between border-b border-slate-700 pb-8 mb-8">
            <div>
              <span className="text-[13px] text-slate-400 block mb-1">
                Total Paper Sets / Cycles
              </span>
              <span className="text-[44px] leading-none font-bold text-emerald-400 tracking-tight">
                {subjects[0]?.setCount || 0} / {exam.noOfIteration}
              </span>
            </div>
            <Layers className="w-8 h-8 text-slate-500 mb-2" />
          </div>

          <div className="flex items-end justify-between border-b border-slate-700 pb-8 mb-8">
            <div>
              <span className="text-[13px] text-slate-400 block mb-1">
                Set Coding Type
              </span>
              <span className="text-[28px] leading-none font-bold text-white tracking-tight">
                {exam.configurationType}
              </span>
            </div>
            <div className="bg-slate-700/50 text-slate-300 text-xs font-bold px-3 py-1.5 rounded mb-1 tracking-widest uppercase">
              {exam.configurationType === "Colour" ? "Hex" : "Code"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                Rotation Mode
              </span>
              <span className="text-[15px] font-bold text-white capitalize">
                {exam.rotationType?.replace("_", " ") || "Manual Roll"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                Reusable Sets
              </span>
              <span className="text-[15px] font-bold text-white uppercase">
                {exam.reUsableSet || "NO"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Global Shift Schedule */}
        <div className="bg-[#F4F6FB] rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-[#14223E]" />
            <h2 className="text-[12px] font-bold text-[#14223E] uppercase tracking-widest">
              Global Shift Schedule
            </h2>
          </div>

          <div className="space-y-3 mb-5 overflow-y-auto max-h-[300px]">
            {shifts.map((shift, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden"
              >
                <div className="flex flex-col gap-0.5 relative z-10">
                  <span className="text-[14px] font-bold text-[#14223E]">
                    {new Date(shift.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[12px] text-slate-500">
                    {shift.startTime.slice(0, 5)} - {shift.endTime.slice(0, 5)}
                  </span>
                </div>
                <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-2.5 py-1 rounded tracking-wider relative z-10 uppercase">
                  {shift.type || "N/A"}
                </span>
              </div>
            ))}
            {shifts.length === 0 && (
              <p className="text-center text-slate-400 py-4">
                No shifts defined
              </p>
            )}
          </div>

          <button className="w-full bg-transparent border border-slate-200 text-slate-600 font-semibold text-[13px] py-3 rounded-xl hover:bg-white transition shadow-sm">
            View Full Schedule
          </button>
        </div>

        {/* Subject Assignment Matrix */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-6">
          <div className="flex items-center justify-between px-8 mb-6">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-[#14223E]" />
              <h2 className="text-[12px] font-bold text-[#14223E] uppercase tracking-widest">
                Subject Assignment Matrix
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#14223E]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                Linked
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Unassigned
              </div>
            </div>
          </div>

          <div className="px-8">
            <div className="grid grid-cols-[1.5fr_2fr_100px] text-[10px] font-bold text-slate-500 uppercase tracking-widest py-3 px-4 bg-[#F8F9FB] rounded-t-xl border-b border-slate-100">
              <div>Subject Name</div>
              <div>Assigned Shifts</div>
              <div className="text-right">Status</div>
            </div>

            <div className="space-y-0.5 bg-[#F8F9FB] rounded-b-xl overflow-hidden pb-1 max-h-[400px] overflow-y-auto">
              {subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1.5fr_2fr_100px] items-center p-4 bg-white mx-1 my-0.5 rounded-lg border border-slate-50 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#14223E]">
                      {sub.subjectName}
                    </span>
                    <span className="text-[12px] text-slate-500">
                      {sub.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-start">
                    {sub.mappings.map((m: Mapping, mIdx: number) => {
                      const shift = shifts.find((s) => s.id === m.ssId);
                      return shift ? (
                        <span
                          key={mIdx}
                          className="bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold px-2 py-0.5 rounded"
                        >
                          {new Date(shift.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          • {shift.type}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <div className="flex justify-end">
                    {sub.mappings.length > 0 ? (
                      <div className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Linked
                      </div>
                    ) : (
                      <div className="bg-red-50 text-red-600 text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                        Unassigned
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Setup Footer/Confirmation Component */}
      <div className="mt-6 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
            <Info className="w-5 h-5 text-[#14223E]" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#14223E]">
              Confirmation Required
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(`/admin/examconfigration?id=${examId}`)}
            className="text-[14px] font-bold text-[#14223E] hover:text-blue-600 transition"
          >
            Back to Configuration
          </button>
          <button
            onClick={handlePublish}
            disabled={publishLoading}
            className="bg-[#0b1727] hover:bg-[#12243d] flex items-center gap-2 text-white font-semibold text-[14px] px-6 py-3 rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publish Exam
          </button>
        </div>
      </div>
    </div>
  );
}
