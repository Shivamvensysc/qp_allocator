import { Edit3, Loader2, FileText, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchExams } from "../../../services/exam.service";

const AdminDashboardPage = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getExams = async () => {
      try {
        const data = await fetchExams();
        setExams(data.exams || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getExams();
  }, []);

  const stats = {
    total: exams.length,
    drafts: exams.filter((e) => e.status === "draft").length,
    published: exams.filter((e) => e.status === "publish").length,
    completed: exams.filter((e) => e.status === "complete").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1d3557]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen pb-12">
      {/* Stats Cards */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Exams */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#1d3557] px-6 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#a8bcdc] uppercase">
                Total Exams
              </span>
            </div>
            <h3 className="text-4xl font-bold tracking-tight">{stats.total}</h3>
            <div className="flex items-center gap-1 text-[#a8bcdc] text-xs ">
              <TrendingUp size={12} />
              <span>All time</span>
            </div>
          </div>
        </div>

        {/* Drafts */}
        <div className="group relative overflow-hidden rounded-2xl bg-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-slate-900">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Drafts
              </span>
            </div>
            <h3 className="text-4xl font-bold tracking-tight text-slate-800">
              {String(stats.drafts).padStart(2, "0")}
            </h3>
            <div className="text-xs text-slate-400 ">Pending review</div>
          </div>
        </div>

        {/* Published */}
        <div className="group relative overflow-hidden rounded-2xl bg-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-emerald-500">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Published
              </span>
            </div>
            <h3 className="text-4xl font-bold tracking-tight text-slate-800">
              {String(stats.published).padStart(2, "0")}
            </h3>
            <div className="text-xs text-slate-400 ">Live now</div>
          </div>
        </div>

        {/* Completed */}
        <div className="group relative overflow-hidden rounded-2xl bg-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-rose-500">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Completed
              </span>
            </div>
            <h3 className="text-4xl font-bold tracking-tight text-slate-800">
              {String(stats.completed).padStart(2, "0")}
            </h3>
            <div className="text-xs text-slate-400 ">Finished exams</div>
          </div>
        </div>
      </section>

      {/* Exams Table Section */}
      <section className="grid gap-8 lg:grid-cols-1">
        {/* Single Border Wrapper */}
        <div className="border border-slate-300 rounded-3xl overflow-hidden bg-white">
          {/* Header Section */}
          <div className="bg-slate-200 flex items-center justify-between px-6 py-3 border-b border-slate-300">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Examination Records
              </h2>
            </div>
            <Link to="/admin/examconfigration">
              <button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-md hover:shadow-lg">
                + Create New Exam
              </button>
            </Link>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_60px] bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-300">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Exam Name
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Start Date
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              End Date
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Shifts
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Subjects
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Status
            </div>
            <div className="text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Action
            </div>
          </div>

          {/* Table Body with Border Bottom for Each Row */}
          <div>
            {exams.map((exam, index) => (
              <div
                key={exam.id}
                className={`group grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_60px] items-center px-6 py-5 hover:bg-slate-50/50 transition-all duration-200 ${
                  index !== exams.length - 1 ? "border-b border-slate-200" : ""
                }`}
              >
                {/* Exam Name */}
                <div>
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-[#1d3557] transition-colors">
                        {exam.examName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        #{String(exam.id).padStart(5, "0")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Start Date */}
                <div className="text-[13px] font-medium text-slate-700">
                  {new Date(exam.startDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {/* End Date */}
                <div className="text-[13px] font-medium text-slate-700">
                  {new Date(exam.endDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {/* Shifts */}
                <div>
                  <span className="inline-flex items-center justify-center w-12 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-bold">
                    {exam.shiftCount}
                  </span>
                </div>

                {/* Subjects */}
                <div>
                  <span className="inline-flex items-center justify-center w-12 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-bold">
                    {exam.subjectCount}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      exam.status === "complete"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : exam.status === "publish"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        exam.status === "complete"
                          ? "bg-emerald-500"
                          : exam.status === "publish"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                    ></span>
                    {exam.status}
                  </span>
                </div>

                {/* Action */}
                <div className="flex items-center justify-end">
                  <Link to={`/admin/examconfigration?id=${exam.id}`}>
                    <button className="text-slate-400 hover:text-blue-600 transition-all duration-200 p-2 hover:bg-blue-50 rounded-xl group/btn">
                      <Edit3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {exams.length === 0 && (
              <div className="p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <FileText size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No examinations found
                </h3>
                <p className="text-sm text-slate-500">
                  Start by creating your first exam configuration
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
