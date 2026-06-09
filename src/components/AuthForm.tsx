"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const egyptGovernorates = [
  { id: 'Cairo', name: 'القاهرة' },
  { id: 'Alexandria', name: 'الإسكندرية' },
  { id: 'Giza', name: 'الجيزة' },
  { id: 'Qalyubia', name: 'القليوبية' },
  { id: 'Dakahlia', name: 'الدقهلية' },
  { id: 'Sharqia', name: 'الشرقية' },
  { id: 'Gharbia', name: 'الغربية' },
  { id: 'Monufia', name: 'المنوفية' },
  { id: 'Beheira', name: 'البحيرة' },
  { id: 'Kafr El Sheikh', name: 'كفر الشيخ' },
  { id: 'Damietta', name: 'دمياط' },
  { id: 'Port Said', name: 'بورسعيد' },
  { id: 'Ismailia', name: 'الإسماعيلية' },
  { id: 'Suez', name: 'السويس' },
  { id: 'North Sinai', name: 'شمال سيناء' },
  { id: 'South Sinai', name: 'جنوب سيناء' },
  { id: 'Matrouh', name: 'مطروح' },
  { id: 'Faiyum', name: 'الفيوم' },
  { id: 'Beni Suef', name: 'بني سويف' },
  { id: 'Minya', name: 'المنيا' },
  { id: 'Asyut', name: 'أسيوط' },
  { id: 'Sohag', name: 'سوهاج' },
  { id: 'Qena', name: 'قنا' },
  { id: 'Luxor', name: 'الأقصر' },
  { id: 'Aswan', name: 'أسوان' },
  { id: 'Red Sea', name: 'البحر الأحمر' },
  { id: 'New Valley', name: 'الوادي الجديد' }
];

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "", governorate: "" });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      api.setUser({ _id: result.data._id, username: result.data.username, email: result.data.email });
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
    // لاحظ إننا ضفنا المحافظة هنا، هتحتاج تعدل api.signup عشان تستقبل المتغير الرابع
    const result = await api.signup(signupData.username, signupData.email, signupData.password, signupData.governorate);
    if (result.success && result.data) {
      api.setToken(result.data.token);
      api.setUser({ _id: result.data._id, username: result.data.username, email: result.data.email, governorate: result.data.governorate });
      router.push("/");
    } else {
      setError(result.message || "فشل إنشاء الحساب، يرجى المحاولة مرة أخرى.");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base";

  const GoogleIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center text-4xl mb-4">
              <span>🌱</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">سنبلة</h1>
            <p className="text-gray-600 text-sm sm:text-base">نظام لاكتشاف أمراض النباتات بالذكاء الاصطناعي</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => { setIsLogin(true); setError(""); }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all text-sm sm:text-base ${
                  isLogin ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:text-green-600"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all text-sm sm:text-base ${
                  !isLogin ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:text-green-600"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            {isLogin && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="login-email">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="login-password">
                    كلمة المرور
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    placeholder="••••••••"
                    className={inputClass}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  {loading ? "جاري تسجيل الدخول…" : "دخول"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">أو</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <GoogleIcon />
                  <span className="text-gray-700 font-medium">المتابعة باستخدام جوجل</span>
                </button>
              </form>
            )}

            {!isLogin && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="signup-username">
                    اسم المستخدم
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    name="username"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    required
                    placeholder="john_doe"
                    className={inputClass}
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="signup-email">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="signup-password">
                    كلمة المرور
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    placeholder="••••••••"
                    className={inputClass}
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="signup-governorate">
                    المحافظة
                  </label>
                  <select
                    id="signup-governorate"
                    name="governorate"
                    value={signupData.governorate}
                    onChange={handleSignupChange}
                    required
                    className={inputClass}
                  >
                    <option value="" disabled>اختر محافظتك</option>
                    {egyptGovernorates.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  {loading ? "جاري إنشاء الحساب…" : "إنشاء حساب"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">أو</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <GoogleIcon />
                  <span className="text-gray-700 font-medium">المتابعة باستخدام جوجل</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          اكتشاف أمراض النباتات مدعوم بالذكاء الاصطناعي
        </p>
      </div>
    </div>
  );
}