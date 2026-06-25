"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Leaf, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

const egyptGovernorates = [
  { id: "Cairo", name: "القاهرة" },
  { id: "Alexandria", name: "الإسكندرية" },
  { id: "Giza", name: "الجيزة" },
  { id: "Qalyubia", name: "القليوبية" },
  { id: "Dakahlia", name: "الدقهلية" },
  { id: "Sharqia", name: "الشرقية" },
  { id: "Gharbia", name: "الغربية" },
  { id: "Monufia", name: "المنوفية" },
  { id: "Beheira", name: "البحيرة" },
  { id: "Kafr El Sheikh", name: "كفر الشيخ" },
  { id: "Damietta", name: "دمياط" },
  { id: "Port Said", name: "بورسعيد" },
  { id: "Ismailia", name: "الإسماعيلية" },
  { id: "Suez", name: "السويس" },
  { id: "North Sinai", name: "شمال سيناء" },
  { id: "South Sinai", name: "جنوب سيناء" },
  { id: "Matrouh", name: "مطروح" },
  { id: "Faiyum", name: "الفيوم" },
  { id: "Beni Suef", name: "بني سويف" },
  { id: "Minya", name: "المنيا" },
  { id: "Asyut", name: "أسيوط" },
  { id: "Sohag", name: "سوهاج" },
  { id: "Qena", name: "قنا" },
  { id: "Luxor", name: "الأقصر" },
  { id: "Aswan", name: "أسوان" },
  { id: "Red Sea", name: "البحر الأحمر" },
  { id: "New Valley", name: "الوادي الجديد" },
];

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    governorate: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await api.signin(loginData.email, loginData.password);
    if (result.success && result.data) {
      api.setToken(result.data.token);
      api.setUser({
        _id: result.data._id,
        username: result.data.username,
        email: result.data.email,
      });
      router.push("/");
    } else {
      setError(result.message || "فشل تسجيل الدخول، يرجى المحاولة مرة أخرى.");
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await api.signup(
      signupData.username,
      signupData.email,
      signupData.password,
      signupData.governorate,
    );
    if (result.success && result.data) {
      api.setToken(result.data.token);
      api.setUser({
        _id: result.data._id,
        username: result.data.username,
        email: result.data.email,
        governorate: result.data.governorate,
      });
      router.push("/");
    } else {
      setError(result.message || "فشل إنشاء الحساب، يرجى المحاولة مرة أخرى.");
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

        {/* Feature list */}
        <div className="space-y-6 relative z-10">
          {[
            {
              emoji: "🔬",
              title: "تشخيص فوري",
              desc: "اكتشف أمراض نباتاتك بدقة عالية خلال ثوانٍ",
            },
            {
              emoji: "🌿",
              title: "مجتمع نشط",
              desc: "شارك تجربتك مع آلاف عشاق النباتات",
            },
            {
              emoji: "👨‍⚕️",
              title: "خبراء متاحون",
              desc: "احصل على إجابات من أطباء نباتات متخصصين",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center text-xl shrink-0">
                {f.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">
                  {f.title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
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
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white mb-1">
              {isLogin ? "أهلاً بعودتك 👋" : "إنشاء حساب جديد"}
            </h1>
            <p className="text-sm text-slate-500">
              {isLogin
                ? "سجّل دخولك للوصول إلى حسابك"
                : "انضم لمجتمع سنبلة مجاناً"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-slate-900/70 border border-slate-800/60 rounded-xl mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setShowPassword(false);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}>
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setShowPassword(false);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                !isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}>
              حساب جديد
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {isLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Field label="البريد الإلكتروني">
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  placeholder="you@example.com"
                  className={inputCls}
                  autoComplete="email"
                />
              </Field>

              <Field label="كلمة المرور">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    placeholder="••••••••"
                    className={`${inputCls} pl-10`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>

              <SubmitBtn
                loading={loading}
                label="دخول"
                loadingLabel="جارٍ تسجيل الدخول…"
              />
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {!isLogin && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <Field label="اسم المستخدم">
                <input
                  type="text"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                  placeholder="john_doe"
                  className={inputCls}
                  autoComplete="username"
                />
              </Field>

              <Field label="البريد الإلكتروني">
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  placeholder="you@example.com"
                  className={inputCls}
                  autoComplete="email"
                />
              </Field>

              <Field label="كلمة المرور">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    placeholder="••••••••"
                    className={`${inputCls} pl-10`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Field label="المحافظة">
                <select
                  name="governorate"
                  value={signupData.governorate}
                  onChange={handleSignupChange}
                  required
                  className={`${inputCls} appearance-none`}>
                  <option value="" disabled>
                    اختر محافظتك
                  </option>
                  {egyptGovernorates.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {gov.name}
                    </option>
                  ))}
                </select>
              </Field>

              <SubmitBtn
                loading={loading}
                label="إنشاء حساب"
                loadingLabel="جارٍ إنشاء الحساب…"
              />
            </form>
          )}

          {/* Switch mode link */}
          <p className="text-center text-xs text-slate-600 mt-5">
            {isLogin ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
            <button
              type="button"
              onClick={() => {
                setIsLogin((v) => !v);
                setError("");
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              {isLogin ? "أنشئ حساباً" : "سجّل دخولك"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function SubmitBtn({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
