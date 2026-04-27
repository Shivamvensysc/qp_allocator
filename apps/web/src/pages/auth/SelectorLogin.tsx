import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Shield,
  ChevronDown,
  ArrowRight,
  ClipboardList,
  LogOut,
  CheckCircle2,
  User,
  Lock,
} from "lucide-react";

import { loginSelector, forceLogout } from "../../services/auth.service";
import { fetchExams } from "../../services/exam.service";
import type { Exam } from "../../services/exam.service";

import { saveToken } from "../../utils/token";

export default function SelectorLoginPage() {
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedExam, setSelectedExam] = useState<string>("");
  const [examinations, setExaminations] = useState<Exam[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  console.log("success value", success);

    const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchExams();

        setExaminations(data.exams || []);
      } catch (err) {
        console.error("Fetch exams error:", err);
      }
    };

    loadExams();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExam) {
      setError("Please select an examination");

      return;
    }

    setLoading(true);
    setError("");
    console.log("my selector login are call or not ")
    try {
      const data = await loginSelector({
        username,
        password,
        examName: selectedExam,
      });

      /* Save Token */

      saveToken(data.token);

      /* Redirect */

      navigate(data.redirectUrl || "/selectorControl");
    } catch (err: any) {
      const message = err?.response?.data?.error || err.message;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogout = async () => {
    if (!username || !password) {
      setError("Please enter username and password");

      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forceLogout({
        username,
        password,
      });

      setSuccess("Logged out from other sessions.");
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-2 min-h-screen">
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

            <div className="px-10 py-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-[28px] font-bold text-[#0b1628] tracking-tight mb-2">
                  Selector Portal
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Please enter your credentials to access the allocation engine.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                  {error.includes("already logged in") && (
                    <button
                      type="button"
                      onClick={handleForceLogout}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout from other devices
                    </button>
                  )}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Examination Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                    Select Examination
                  </label>
                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 hover:border-slate-300 transition-all text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <ClipboardList className="w-4 h-4 text-slate-400 shrink-0" />
                        <span
                          className={
                            selectedExam ? "text-slate-700" : "text-slate-400"
                          }
                        >
                          {selectedExam || "Choose an examination..."}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-10 overflow-hidden max-h-60 overflow-y-auto">
                        {examinations.map((exam) => (
                          <button
                            key={exam.id}
                            type="button"
                            onClick={() => {
                              setSelectedExam(exam.examName);
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2.5 border-b border-slate-100 last:border-0"
                          >
                            {selectedExam === exam.examName && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                            <span
                              className={
                                selectedExam === exam.examName ? "ml-0" : "ml-6"
                              }
                            >
                              {exam.examName}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                    Username
                  </label>
                  <div
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border bg-slate-50 transition-all ${
                      focused === "username"
                        ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-white"
                        : "border-slate-300"
                    }`}
                  >
                    <User
                      className={`w-4 h-4 shrink-0 transition-colors ${focused === "username" ? "text-emerald-500" : "text-slate-400"}`}
                    />
                    <input
                      type="text"
                      placeholder="e.g. selector_admin_01"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocused("username")}
                      onBlur={() => setFocused(null)}
                      className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase hover:text-emerald-600 transition-colors"
                    >
                      Forgot Access?
                    </button>
                  </div>
                  <div
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border bg-slate-50 transition-all ${
                      focused === "password"
                        ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-white"
                        : "border-slate-300"
                    }`}
                  >
                    <Lock
                      className={`w-4 h-4 shrink-0 transition-colors ${focused === "password" ? "text-emerald-500" : "text-slate-400"}`}
                    />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0b1628] text-white text-sm font-semibold tracking-wide hover:bg-[#162035] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 group"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Secure Login
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-700 italic">
                  Only one authorized selector permitted per examination
                  session.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
