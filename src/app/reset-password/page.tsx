"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Leaf,
  ArrowRight,
  Loader2,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const email = localStorage.getItem("email")||"";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    if (newPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    const result = await api.resetPassword(email, otp, newPassword);

    if (result.success) {
      setDone(true);
    } else {
      setError(result.message || "حدث خطأ، يرجى المحاولة مرة أخرى.");
    }
    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-950 flex items-stretch relative overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-[-120px] right-[-120px] w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[90px]" />

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-slate-900/60 backdrop-blur-xl border-l border-slate-800/50 p-10 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.12),transparent_65%)]" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            سنبلة
          </span>
        </div>

        {/* Info block */}
        <div className="space-y-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-white font-bold text-xl leading-snug">
            تعيين كلمة مرور جديدة
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            أدخل الرمز الذي وصلك على بريدك الإلكتروني وكلمة المرور الجديدة.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              "الرمز صالح لمدة 10 دقائق فقط",
              "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
              "تأكد من حفظ كلمة المرور الجديدة",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />
                </span>
                <span className="text-slate-500 text-xs">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-600 relative z-10">
          © {new Date().getFullYear()} سنبلة — مدعوم بالذكاء الاصطناعي
        </p>
      </div>

      {/* Main form area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            سنبلة
          </span>
        </div>

        <div className="w-full max-w-sm">
          {!done ? (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-white mb-1">
                  تعيين كلمة مرور جديدة 🔐
                </h1>
                <p className="text-sm text-slate-500">
                  أدخل بياناتك لإعادة تعيين كلمة المرور
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}

                {/* OTP */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError("");
                    }}
                    required
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all tracking-widest text-center"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جارٍ التحديث…
                    </>
                  ) : (
                    "تعيين كلمة المرور"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  تم تغيير كلمة المرور! ✅
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/auth")}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                تسجيل الدخول
              </button>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}