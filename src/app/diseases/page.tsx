"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { Disease, getDiseases } from "@/data/diseases";

import {
  AlertTriangle,
  Shield,
  Bug,
  Droplets,
  Eye,
  ChevronRight,
  Leaf,
  Search,
  Filter,
  Zap,
  Activity,
  Wind,
} from "lucide-react";

// ─── Filter Configurations ──────────────────────────────────────────────────

const categories = ["All", "Fungal", "Bacterial", "Viral", "Pest"] as const;
type CategoryFilter = (typeof categories)[number];

const getCategoryLabel = (cat: CategoryFilter, isAr: boolean): string => {
  const labels: Record<CategoryFilter, [string, string]> = {
    All: ["All Categories", "الكل"],
    Fungal: ["Fungal", "فطري"],
    Bacterial: ["Bacterial", "بكتيري"],
    Viral: ["Viral", "فيروسي"],
    Pest: ["Pest", "آفة"],
  };
  return isAr ? labels[cat][1] : labels[cat][0];
};

const plants = [
  "All",
  "Apple",
  "Cherry",
  "Corn",
  "Grape",
  "Orange",
  "Peach",
  "Pepper",
  "Potato",
  "Squash",
  "Strawberry",
  "Tomato",
] as const;
type PlantFilter = (typeof plants)[number];

const getPlantLabel = (plant: PlantFilter, isAr: boolean): string => {
  const labels: Record<PlantFilter, [string, string]> = {
    All: ["All Plants", "جميع النباتات"],
    Apple: ["Apple", "تفاح"],
    Cherry: ["Cherry", "كرز"],
    Corn: ["Corn", "ذرة"],
    Grape: ["Grape", "عنب"],
    Orange: ["Orange", "برتقال"],
    Peach: ["Peach", "خوخ"],
    Pepper: ["Pepper", "فلفل"],
    Potato: ["Potato", "بطاطس"],
    Squash: ["Squash", "كوسة"],
    Strawberry: ["Strawberry", "فراولة"],
    Tomato: ["Tomato", "طماطم"],
  };
  return isAr ? labels[plant][1] : labels[plant][0];
};

const arToEnPlant: Record<string, string> = {
  "تفاح": "Apple",
  "كرز": "Cherry",
  "ذرة": "Corn",
  "عنب": "Grape",
  "برتقال": "Orange",
  "خوخ": "Peach",
  "فلفل": "Pepper",
  "بطاطس": "Potato",
  "كوسة": "Squash",
  "فراولة": "Strawberry",
  "طماطم": "Tomato",
};

// ─── Severity helpers ─────────────────────────────────────────────────────────

type Severity = "Low" | "Medium" | "High" | "Critical";

const severityConfig: Record<
  Severity,
  { color: string; dot: string; pulse: boolean }
> = {
  Low: {
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    dot: "bg-emerald-400",
    pulse: false,
  },
  Medium: {
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    dot: "bg-amber-400",
    pulse: false,
  },
  High: {
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    dot: "bg-red-400",
    pulse: false,
  },
  Critical: {
    color: "text-red-300 bg-red-500/15 border-red-400/40",
    dot: "bg-red-400",
    pulse: true,
  },
};

const getSeverityLabel = (severity: Severity, isAr: boolean): string => {
  const labels: Record<Severity, [string, string]> = {
    Low: ["Low", "منخفض"],
    Medium: ["Medium", "متوسط"],
    High: ["High", "مرتفع"],
    Critical: ["Critical", "حرج"],
  };
  return isAr ? labels[severity][1] : labels[severity][0];
};

const categoryIconMap: Record<Disease["category"], React.ReactNode> = {
  Fungal: <Leaf className="w-3 h-3" />,
  Bacterial: <Activity className="w-3 h-3" />,
  Viral: <Zap className="w-3 h-3" />,
  Pest: <Bug className="w-3 h-3" />,
};

const categoryColorMap: Record<Disease["category"], string> = {
  Fungal: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Bacterial: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Viral: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Pest: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

const getCategoryDisplayLabel = (cat: Disease["category"], isAr: boolean): string => {
  const labels: Record<Disease["category"], [string, string]> = {
    Fungal: ["Fungal", "فطري"],
    Bacterial: ["Bacterial", "بكتيري"],
    Viral: ["Viral", "فيروسي"],
    Pest: ["Pest", "آفة"],
  };
  return isAr ? labels[cat][1] : labels[cat][0];
};

// ─── Detail section component ─────────────────────────────────────────────────

function DetailSection({
  icon,
  title,
  text,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className={`flex items-center gap-2 font-semibold text-sm ${color}`}>
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed pl-5">{text}</p>
    </div>
  );
}

// ─── Disease Card ─────────────────────────────────────────────────────────────

function DiseaseCard({
  disease,
  index,
  isAr,
}: {
  disease: Disease;
  index: number;
  isAr: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const sev = severityConfig[disease.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{
        y: -4,
        borderColor: "rgba(34,197,94,0.30)",
        transition: { duration: 0.2 },
      }}
      className="group bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/60 p-6 flex flex-col gap-4 cursor-pointer"
      dir={isAr ? "rtl" : "ltr"}
      onClick={() => setExpanded((p) => !p)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-3xl leading-none flex-shrink-0 mt-0.5">
            {disease.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white leading-snug">
              {disease.plant} — {disease.disease}
            </h3>
            {/* Category chip */}
            <span
              className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${
                categoryColorMap[disease.category]
              }`}>
              {categoryIconMap[disease.category]}
              {getCategoryDisplayLabel(disease.category, isAr)}
            </span>
          </div>
        </div>

        {/* Severity badge */}
        <div
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sev.color}`}>
          <span
            className={`w-1.5 h-1.5 rounded-full ${sev.dot} ${
              sev.pulse ? "animate-ping" : ""
            }`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full ${sev.dot} ${
              sev.pulse ? "absolute" : ""
            }`}
          />
          {getSeverityLabel(disease.severity, isAr)}
        </div>
      </div>

      {/* Symptoms preview */}
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
        <span className="text-slate-500 font-medium">
          {isAr ? "الأعراض: " : "Symptoms: "}
        </span>
        {disease.symptoms}
      </p>

      {/* Expand / collapse toggle */}
      <button
        className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold self-start"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((p) => !p);
        }}>
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            expanded ? "rotate-90" : ""
          }`}
        />
        {expanded
          ? isAr
            ? "إخفاء التفاصيل"
            : "Collapse Details"
          : isAr
            ? "عرض التفاصيل"
            : "View Details"}
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden">
            <div className="pt-2 border-t border-slate-800/60 space-y-4">
              <DetailSection
                icon={<Eye className="w-4 h-4" />}
                title={isAr ? "الأعراض" : "Symptoms"}
                text={disease.symptoms}
                color="text-sky-400"
              />
              <DetailSection
                icon={<AlertTriangle className="w-4 h-4" />}
                title={isAr ? "الأسباب" : "Causes"}
                text={disease.causes}
                color="text-amber-400"
              />
              <DetailSection
                icon={<Shield className="w-4 h-4" />}
                title={isAr ? "العلاج" : "Treatment"}
                text={disease.treatment}
                color="text-emerald-400"
              />
              <DetailSection
                icon={<Wind className="w-4 h-4" />}
                title={isAr ? "الوقاية" : "Prevention"}
                text={disease.prevention}
                color="text-purple-400"
              />

              {/* Affected Plants */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-rose-400">
                  <Leaf className="w-4 h-4" />
                  <span>{isAr ? "النبات المتضرر" : "Affected Plant"}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  <span className="text-xs text-slate-300 bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-700/60">
                    {disease.plant}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                href="/assistant"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-sm font-semibold transition-all duration-200">
                <Zap className="w-4 h-4" />
                {isAr ? "تحليل بالذكاء الاصطناعي" : "Analyze with AI"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiseasesPage() {
  const { language } = useSettings();
  const isAr = language === "ar";

  const diseases = getDiseases(isAr);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [activePlant, setActivePlant] = useState<PlantFilter>("All");

  const filtered = diseases.filter((d) => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    
    // Resolve English plant name for language-agnostic filtering
    const plantEn = isAr ? arToEnPlant[d.plant] : d.plant;
    const matchPlant = activePlant === "All" || plantEn === activePlant;

    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.disease.toLowerCase().includes(q) ||
      d.plant.toLowerCase().includes(q) ||
      d.symptoms.toLowerCase().includes(q);

    return matchCat && matchPlant && matchSearch;
  });

  return (
    <div
      className="min-h-screen text-slate-100 relative overflow-hidden bg-transparent"
      dir={isAr ? "rtl" : "ltr"}>
      {/* Full Page Background Image Layer */}
      <div 
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/Diseases.webp')" }}
      />
      {/* Dark Gradient Overlay */}
      <div 
        className="fixed inset-0 -z-20"
        style={{
          background: "linear-gradient(to bottom, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.88) 60%, rgba(2,6,23,0.96) 100%)"
        }}
      />
      {/* Ambient orbs */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/6 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/4 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full tracking-wide">
            🔬 {isAr ? "قاعدة بيانات أمراض النبات" : "AI-Powered Plant Disease Knowledge Base"}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-white leading-tight mb-4">
          {isAr ? "أمراض النبات الشائعة" : "Common Plant Diseases"}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 animate-pulse">
            {isAr ? "في مصر" : "in Egypt"}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-10">
          {isAr
            ? "تشخيص أمراض النبات بالذكاء الاصطناعي مدرّب على ظروف المناخ المصري. تصفح قاعدة بياناتنا أو ارفع صورة للحصول على تشخيص فوري."
            : "AI-powered disease identification trained on Egyptian climate conditions. Browse our curated pathology database or upload a photo for instant diagnosis."}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            {
              icon: <Activity className="w-4 h-4" />,
              label: isAr ? "26 مرض مُتتبَّع" : "26 Diseases Tracked",
            },
            {
              icon: <Zap className="w-4 h-4" />,
              label: isAr ? "99% دقة اكتشاف" : "99% Detection Rate",
            },
            {
              icon: <Shield className="w-4 h-4" />,
              label: isAr ? "تحديثات فورية" : "Real-time Updates",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-slate-900/40 border border-slate-800/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-emerald-400">
              {s.icon}
              {s.label}
            </div>
          ))}
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search
              className={`absolute ${
                isAr ? "right-4" : "left-4"
              } top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`}
            />
            <input
              type="text"
              placeholder={
                isAr
                  ? "ابحث في الأمراض والأعراض والنباتات…"
                  : "Search diseases, symptoms, plants…"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-slate-900/50 backdrop-blur-md border border-slate-800/60 rounded-xl ${
                isAr ? "pr-11 pl-4" : "pl-11 pr-4"
              } py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all`}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800/60 backdrop-blur-md rounded-xl px-4 py-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 whitespace-nowrap">
              {filtered.length}{" "}
              {isAr ? "نتيجة" : `result${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── FILTERS ── */}
      <section className="sticky top-16 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/40 px-4 sm:px-6 py-3 space-y-2.5">
        {/* Plant Filter */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {plants.map((plt) => (
            <button
              key={plt}
              onClick={() => setActivePlant(plt)}
              className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                activePlant === plt
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "text-slate-400 border-slate-800/60 hover:text-slate-300 hover:border-slate-700"
              }`}>
              {getPlantLabel(plt, isAr)}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "text-slate-400 border-slate-800/60 hover:text-slate-300 hover:border-slate-700"
              }`}>
              {getCategoryLabel(cat, isAr)}
            </button>
          ))}
        </div>
      </section>

      {/* ── DISEASE CARDS GRID ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + activePlant + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((disease, i) => (
                <DiseaseCard
                  key={disease.id}
                  disease={disease}
                  index={i}
                  isAr={isAr}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-xl font-bold text-white mb-2">
                {isAr ? "لا توجد أمراض مطابقة" : "No diseases found"}
              </h3>
              <p className="text-slate-400 text-sm">
                {isAr
                  ? "حاول تعديل البحث أو اختيار فئة مختلفة."
                  : "Try adjusting your search or selecting a different category."}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setActivePlant("All");
                }}
                className="mt-6 text-sm text-emerald-400 underline underline-offset-4">
                {isAr ? "مسح الفلاتر" : "Clear filters"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── AI DIAGNOSIS BANNER ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/80 via-emerald-950/40 to-slate-900/80 backdrop-blur-md p-10 sm:p-14 text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-center">
              <span className="text-4xl">🤖</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr
                ? "مش متأكد من مرض نباتك؟"
                : "Unsure what disease your plant has?"}
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              {isAr
                ? "دع الذكاء الاصطناعي يحلل صورة نباتك ويحدد الأمراض فوراً، مع توصيات علاج مخصصة لظروف المناخ والتربة المصرية."
                : "Let our AI analyze your plant photo and identify diseases instantly. Get tailored treatment recommendations based on Egyptian climate and soil conditions."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="/assistant"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40">
                <Zap className="w-4 h-4" />
                {isAr ? "ارفع صورة النبات" : "Upload Plant Photo"}
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                {isAr
                  ? "تعرف على مميزات الذكاء الاصطناعي"
                  : "Learn about AI features"}
                <ChevronRight
                  className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`}
                />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-extrabold text-xl tracking-tight">
              {isAr ? "سنبلة" : "Sonbola"}
            </span>
            <span className="text-slate-600 text-xs">|</span>
            <span className="text-slate-500 text-xs">
              {isAr
                ? "منصة ذكاء النبات بالذكاء الاصطناعي"
                : "AI Plant Intelligence Platform"}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="/" className="hover:text-emerald-400 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </a>
            <a
              href="/about"
              className="hover:text-emerald-400 transition-colors">
              {isAr ? "المميزات" : "Features"}
            </a>
            <a href="/diseases" className="text-emerald-400">
              {isAr ? "الأمراض" : "Diseases"}
            </a>
            <a
              href="/about"
              className="hover:text-emerald-400 transition-colors">
              {isAr ? "عنا" : "About"}
            </a>
            <a
              href="/assistant"
              className="hover:text-emerald-400 transition-colors">
              {isAr ? "ابدأ الآن" : "Get Started"}
            </a>
          </div>
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Sonbola.{" "}
            {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
}
