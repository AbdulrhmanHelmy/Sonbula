"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Fingerprint,
  LogOut,
  ArrowLeft,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { api, type User as ApiUser } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    const userInfo = api.getUser();
    if (!token || !userInfo) {
      router.push("/auth");
      return;
    }
    setUser(userInfo);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    api.clearToken();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500">جار التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />

      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-12 relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold mx-auto mb-4">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <h1 className="text-xl font-bold text-white">{user?.username}</h1>
            <p className="text-sm text-slate-500 mt-1">إدارة معلومات حسابك</p>
          </div>

          <hr className="border-slate-800/60 mb-6" />

          <div className="flex items-center gap-2 text-xs font-bold text-white mb-4">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            معلومات الحساب
          </div>

          <div className="space-y-4 mb-5">
            {[
              {
                icon: <User className="w-3.5 h-3.5" />,
                label: "اسم المستخدم",
                value: user?.username,
              },
              {
                icon: <Mail className="w-3.5 h-3.5" />,
                label: "البريد الإلكتروني",
                value: user?.email,
              },
            ].map((f) => (
              <div key={f.label}>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                  {f.icon} {f.label}
                </div>
                <div className="px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/50 rounded-xl text-sm text-slate-300">
                  {f.value || "—"}
                </div>
              </div>
            ))}

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                <Fingerprint className="w-3.5 h-3.5" /> معرف المستخدم
              </div>
              <div className="px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/50 rounded-xl text-xs font-mono text-slate-600 break-all">
                {user?._id || "—"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-400">
                مميزات قريباً
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                تعديل الملف الشخصي، تغيير كلمة المرور، والإعدادات
              </p>
            </div>
          </div>

          <div className="mb-6">
            <Link href="/profile/complaints" className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800/60 rounded-xl hover:bg-slate-800/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">الشكاوى الخاصة بي</h3>
                  <p className="text-xs text-slate-500">متابعة حالة شكاويك والردود عليها</p>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-500 rotate-180" />
            </Link>
          </div>

          <hr className="border-slate-800/60 mb-6" />

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-all">
              <ArrowLeft className="w-4 h-4" /> الرئيسية
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-sm font-semibold text-red-400 transition-all">
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
