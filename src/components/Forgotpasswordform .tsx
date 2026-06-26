"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Leaf, ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await api.forgotPassword(email);

    if (result.success) {
      setSent(true);
      router.push("/reset-password");
 localStorage.setItem("email", email);
    } else {
      setError(result.message || "حدث خطأ، يرجى المحاولة مرة أخرى.");
    }
    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-950 flex items-stretch relative overflow-hidden">
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute top-[-120px] right-[-120px] w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[90px]" />

      {/* ── Left decorative panel (desktop) ── */}
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
            <Mail className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-white font-bold text-xl leading-snug">
            استعادة كلمة المرور
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            أدخل بريدك الإلكتروني المسجّل وسنرسل لك رمز التحقق فوراً لإعادة
            تعيين كلمة مرورك.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              "تأكّد من صحة البريد الإلكتروني",
              "تحقق من مجلد الرسائل غير المرغوب فيها",
              "الرمز صالح لمدة 15 دقيقة فقط",
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

      {/* ── Main form area ── */}
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
          {!sent ? (
            <>
              {/* Heading */}
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-white mb-1">
                  نسيت كلمة المرور؟ 🔑
                </h1>
                <p className="text-sm text-slate-500">
                  أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق
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
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جارٍ إرسال الرمز…
                    </>
                  ) : (
                    "إرسال رمز التحقق"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  تم إرسال الرمز! ✉️
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  أرسلنا رمز التحقق إلى{" "}
                  <span className="text-emerald-400 font-semibold">
                    {email}
                  </span>
                  <br />
                  تحقق من بريدك واتبع التعليمات.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl px-4 py-3 text-xs text-slate-500 text-right space-y-1">
                <p>⏱ الرمز صالح لمدة 15 دقيقة</p>
                <p>📁 تحقق من مجلد الرسائل غير المرغوب فيها إن لم يصل</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="text-xs text-slate-500 hover:text-emerald-400 transition-colors underline underline-offset-2">
                إعادة الإرسال بريد مختلف
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
