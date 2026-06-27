"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Type,
  Globe,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsPage() {
  const router = useRouter();
  const { language, theme, fontSize, setLanguage, setTheme, setFontSize, t } =
    useSettings();

  const [toast, setToast] = useState<{ show: boolean; msg: string }>({
    show: false,
    msg: "",
  });

  const triggerToast = (message: string) => {
    setToast({ show: true, msg: message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  const handleLanguage = (lang: "ar" | "en") => {
    setLanguage(lang);
    triggerToast(
      lang === "ar" ? "تم تحويل اللغة إلى العربية" : "Language switched to English"
    );
  };

  const handleTheme = (val: "light" | "dark" | "system") => {
    setTheme(val);
    triggerToast(t("toast.theme"));
  };

  const handleFontSize = (val: "small" | "medium" | "large") => {
    setFontSize(val);
    triggerToast(t("toast.fontSize"));
  };

  const resetToDefaults = () => {
    if (confirm(t("settings.resetConfirm"))) {
      setLanguage("ar");
      setTheme("dark");
      setFontSize("medium");
      triggerToast(t("settings.resetDone"));
    }
  };

  const isAr = language === "ar";

  // Styled custom toggle switch (always LTR internally)
  const OptionButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className={
        active
          ? "shadow-md"
          : "border-slate-700 text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }
    >
      {children}
    </Button>
  );

  return (
    <div
      className="min-h-screen pb-20 relative overflow-hidden selection:bg-emerald-500 selection:text-white"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -40, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 bg-emerald-950/90 text-emerald-300 px-6 py-3.5 rounded-2xl border border-emerald-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 font-semibold text-sm max-w-sm w-full mx-auto"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="flex-1 text-center">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
        {/* Back button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-8 text-slate-400 hover:text-emerald-400 hover:bg-white/5 border border-transparent hover:border-slate-800 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowLeft
              className={`w-4 h-4 ${isAr ? "ml-2 rotate-180" : "mr-2"}`}
            />
            {t("settings.back")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="pb-4 border-b border-slate-800/80">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              ⚙️ {t("settings.title")}
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">{t("settings.subtitle")}</p>
          </div>

          {/* Account Profile Card */}
          <section className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/20 backdrop-blur-md rounded-3xl border border-slate-800/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                🧑‍🌾
              </div>
              <div className="flex-1 text-center sm:text-start space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                  <h3 className="font-bold text-white text-lg">
                    {t("settings.account")}
                  </h3>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold w-fit mx-auto sm:mx-0">
                    {t("settings.accountTier")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  farmer@sonbula.eg
                </p>
                <p className="text-xs text-slate-500 pt-1">
                  {t("settings.memberSince")}
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-xs border border-slate-800 hover:bg-white/5 text-slate-400 hover:text-emerald-400 mt-2 sm:mt-0"
                onClick={() => router.push("/profile")}
              >
                {t("settings.editProfile")}
              </Button>
            </div>
          </section>

          {/* Appearance & Interface */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              🖥️ {t("settings.appearance")}
            </h2>

            <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4">
              {/* Language Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/40">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white text-sm block">
                      {t("settings.language")}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {t("settings.languageDesc")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2" dir="ltr">
                  <OptionButton
                    active={isAr}
                    onClick={() => handleLanguage("ar")}
                  >
                    العربية
                  </OptionButton>
                  <OptionButton
                    active={!isAr}
                    onClick={() => handleLanguage("en")}
                  >
                    English
                  </OptionButton>
                </div>
              </div>

              {/* Theme */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/40">
                <div className="flex items-center gap-3">
                  {theme === "light" ? (
                    <Sun className="w-5 h-5 text-emerald-400" />
                  ) : theme === "dark" ? (
                    <Moon className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Monitor className="w-5 h-5 text-emerald-400" />
                  )}
                  <div>
                    <span className="font-bold text-white text-sm block">
                      {t("settings.theme")}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {t("settings.themeDesc")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap" dir="ltr">
                  {(["light", "dark", "system"] as const).map((val) => (
                    <OptionButton
                      key={val}
                      active={theme === val}
                      onClick={() => handleTheme(val)}
                    >
                      {val === "light"
                        ? t("settings.light")
                        : val === "dark"
                        ? t("settings.dark")
                        : t("settings.system")}
                    </OptionButton>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white text-sm block">
                      {t("settings.fontSize")}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {t("settings.fontSizeDesc")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap" dir="ltr">
                  {(["small", "medium", "large"] as const).map((val) => (
                    <OptionButton
                      key={val}
                      active={fontSize === val}
                      onClick={() => handleFontSize(val)}
                    >
                      {val === "small"
                        ? t("settings.small")
                        : val === "medium"
                        ? t("settings.medium")
                        : t("settings.large")}
                    </OptionButton>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-800/60">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-red-500/20 text-red-400 hover:bg-red-500/10 gap-2 text-xs"
              onClick={resetToDefaults}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t("settings.reset")}
            </Button>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              {t("common.version")}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
