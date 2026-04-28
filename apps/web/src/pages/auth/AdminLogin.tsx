import { useState } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/auth.service";
import { saveToken } from "../../utils/token";
import { useToast } from "../../hooks/useToast";

export default function AdminLoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginAdmin({
        username,
        password,
      });
      toast.success("Login  successfully");
      saveToken(data.token);

      navigate(data.redirectUrl || "/admin");
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-2 min-h-screen">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
            <div className="px-10 py-10">
              <div className="text-center mb-8">
                <h1 className="text-[28px] font-bold text-[#0b1628] tracking-tight mb-2">
                  Administrator Portal
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Please enter your credentials for elevated access.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                    Admin Username
                  </label>
                  <div
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border bg-slate-50 transition-all ${
                      focused === "username"
                        ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-white"
                        : "border-slate-200"
                    }`}
                  >
                    <User
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        focused === "username"
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="e.g. root_admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocused("username")}
                      onBlur={() => setFocused(null)}
                      className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                      Password
                    </label>
                  </div>
                  <div
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border bg-slate-50 transition-all ${
                      focused === "password"
                        ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-white"
                        : "border-slate-200"
                    }`}
                  >
                    <Lock
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        focused === "password"
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }`}
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
                      Admin Auth
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
