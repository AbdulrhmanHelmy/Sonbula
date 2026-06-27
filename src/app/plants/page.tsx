"use client";

import PlantsPanel from "@/components/layout/PlantsPanel";
import { useSettings } from "@/context/SettingsContext";

export default function PlantsPage() {
  const { language } = useSettings();
  const isAr = language === "ar";

  return (
    <div
      className="text-slate-100 relative min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(circle at 50% 50%, #08150a 0%, #030804 100%)",
      }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed top-0 right-0 w-[700px] h-[700px] bg-emerald-500/6 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-700/4 rounded-full blur-[130px] -z-10" />

      {/* The dictionary interface immediately fills the entire viewport.
          Ends directly after the dictionary content. */}
      <div className="h-screen w-full flex flex-col overflow-hidden">
        <PlantsPanel />
      </div>
    </div>
  );
}
