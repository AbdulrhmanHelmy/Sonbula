"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  Eye,
  Zap,
  Leaf,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  MapPin,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────
   CSS Keyframe Injection
───────────────────────────────────────────── */
const WeatherStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes gradient-shimmer {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .shimmer-text {
      background: linear-gradient(to right, #34d399, #10b981, #6ee7b7, #059669, #34d399);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient-shimmer 5s linear infinite;
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .spin-slow { animation: spin-slow 8s linear infinite; }

    @keyframes pulse-ring {
      0%   { transform: scale(0.95); opacity: 0.8; }
      70%  { transform: scale(1.15); opacity: 0; }
      100% { transform: scale(0.95); opacity: 0; }
    }
    .pulse-ring {
      animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    }

    @keyframes wind-blow {
      0%   { transform: translateX(0px) scaleX(1); opacity: 0.8; }
      50%  { transform: translateX(6px) scaleX(1.08); opacity: 1; }
      100% { transform: translateX(0px) scaleX(1); opacity: 0.8; }
    }
    .wind-anim { animation: wind-blow 1.8s ease-in-out infinite; }

    @keyframes float-up {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }
    .float-up { animation: float-up 3s ease-in-out infinite; }

    /* horizontal scroll hide scrollbar */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}} />
);

/* ─────────────────────────────────────────────
   Types & Static Data
───────────────────────────────────────────── */
type AlertLevel = "safe" | "caution" | "danger";

interface HourlyEntry {
  time: string;
  temp: number;
  icon: "sun" | "cloud" | "rain";
  tip: string;
  active?: boolean;
}

interface DayEntry {
  day: string;
  icon: "sun" | "cloud" | "rain";
  high: number;
  low: number;
  tip: string;
}

interface PlantSafety {
  emoji: string;
  name: string;
  status: AlertLevel;
  note: string;
}

const hourlyForecast: HourlyEntry[] = [
  { time: "6 AM",  temp: 24, icon: "sun",   tip: "Best time to water",        active: false },
  { time: "8 AM",  temp: 27, icon: "sun",   tip: "Morning routine care",       active: false },
  { time: "10 AM", temp: 30, icon: "sun",   tip: "Check soil moisture",        active: false },
  { time: "12 PM", temp: 34, icon: "sun",   tip: "Move shade plants indoors",  active: true  },
  { time: "2 PM",  temp: 38, icon: "sun",   tip: "Peak heat – avoid watering", active: false },
  { time: "4 PM",  temp: 36, icon: "cloud", tip: "Slight cloud cover",         active: false },
  { time: "6 PM",  temp: 31, icon: "cloud", tip: "Second watering window",     active: false },
  { time: "8 PM",  temp: 26, icon: "cloud", tip: "Fertilize if needed",        active: false },
];

const weeklyForecast: DayEntry[] = [
  { day: "Today",     icon: "sun",   high: 38, low: 22, tip: "Water deeply in the morning" },
  { day: "Tue",       icon: "sun",   high: 40, low: 24, tip: "Pre-water today — peak heat tomorrow" },
  { day: "Wed",       icon: "cloud", high: 35, low: 21, tip: "Cloudy — great day to transplant" },
  { day: "Thu",       icon: "cloud", high: 33, low: 20, tip: "Reduced sun exposure for seedlings" },
  { day: "Fri",       icon: "rain",  high: 28, low: 18, tip: "Rain expected — skip irrigation" },
  { day: "Sat",       icon: "rain",  high: 26, low: 17, tip: "Check drainage after rainfall" },
  { day: "Sun",       icon: "sun",   high: 30, low: 19, tip: "Post-rain: inspect for fungal signs" },
];

const plantSafetyData: PlantSafety[] = [
  { emoji: "🌵", name: "Succulents",        status: "safe",    note: "Thriving in heat"         },
  { emoji: "🥦", name: "Vegetables",        status: "caution", note: "Water twice daily"         },
  { emoji: "🌴", name: "Tropical Plants",   status: "danger",  note: "Move to shade now"         },
  { emoji: "🌿", name: "Herbs",             status: "safe",    note: "Morning watering only"     },
  { emoji: "🌸", name: "Flowering Plants",  status: "caution", note: "Shield from noon sun"      },
  { emoji: "🌱", name: "Seedlings",         status: "danger",  note: "Bring indoors immediately" },
];

const aiRecommendations = [
  { color: "border-blue-400",   text: "🌊 Increase watering frequency today — plants lose more moisture in 34°C heat." },
  { color: "border-green-400",  text: "🌿 Move shade-loving plants (ferns, pothos) away from direct sun between 11 am–3 pm." },
  { color: "border-cyan-400",   text: "💧 Mist indoor plants twice today to combat the low 45% humidity." },
  { color: "border-yellow-400", text: "🌱 Hold off on fertilizing — heat stress makes plants unable to absorb nutrients properly." },
  { color: "border-amber-400",  text: "☀️ Apply sunscreen mulch to protect soil from drying out rapidly." },
  { color: "border-emerald-400",text: "⏰ Water in the early morning (6–8 am) or evening (6–8 pm) to minimize evaporation." },
];

/* ─────────────────────────────────────────────
   Small Helper Components
───────────────────────────────────────────── */
function WeatherIcon({ type, className = "w-6 h-6" }: { type: "sun" | "cloud" | "rain"; className?: string }) {
  if (type === "sun")   return <Sun       className={`${className} text-yellow-400`} />;
  if (type === "rain")  return <CloudRain className={`${className} text-blue-400`}   />;
  return                       <Cloud     className={`${className} text-slate-400`}  />;
}

function AlertBadge({ level }: { level: AlertLevel }) {
  const cfg = {
    safe:    { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-400", icon: <CheckCircle  className="w-4 h-4" />, label: "✅ All Clear — Ideal plant weather" },
    caution: { bg: "bg-amber-500/15",   border: "border-amber-500/40",   text: "text-amber-400",   icon: <AlertTriangle className="w-4 h-4" />, label: "⚠️ Caution — Monitor sensitive plants" },
    danger:  { bg: "bg-red-500/15",     border: "border-red-500/40",     text: "text-red-400",     icon: <AlertTriangle className="w-4 h-4" />, label: "🔥 Heat Alert — Protect sensitive plants" },
  }[level];

  return (
    <div className="relative inline-flex items-center gap-2.5">
      {level === "danger" && (
        <span className={`absolute inset-0 rounded-full ${cfg.bg} pulse-ring`} />
      )}
      <span className={`relative flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
        {cfg.icon}
        {cfg.label}
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: AlertLevel }) {
  const map = {
    safe:    { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", label: "Safe ✅" },
    caution: { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-400",   label: "Caution ⚠️" },
    danger:  { bg: "bg-red-500/10",     border: "border-red-500/30",     text: "text-red-400",     label: "Danger ❌" },
  }[status];
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${map.bg} ${map.border} ${map.text}`}>
      {map.label}
    </span>
  );
}

/* UV index coloured bar */
function UVBar({ value }: { value: number }) {
  const pct = Math.min((value / 11) * 100, 100);
  const colour =
    value <= 2 ? "from-green-400 to-green-500" :
    value <= 5 ? "from-yellow-400 to-amber-500" :
    value <= 7 ? "from-orange-400 to-orange-500" :
    value <= 10 ? "from-red-400 to-red-500" :
                  "from-violet-500 to-purple-600";

  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${colour}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}

/* Circular SVG humidity ring */
function HumidityRing({ value }: { value: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = circ * (value / 100);

  return (
    <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} stroke="#1e293b" strokeWidth="8" fill="none" />
        <motion.circle
          cx="56" cy="56" r={r}
          stroke="#34d399" strokeWidth="8" fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ - dash }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-emerald-400">{value}%</span>
        <span className="text-[10px] text-slate-400">humidity</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Count-up temperature hook
───────────────────────────────────────────── */
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 20));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
export default function WeatherPage() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const alertLevel: AlertLevel = "danger";
  const displayTemp = useCountUp(34, 1200);

  /* clock tick */
  useEffect(() => {
    const update = () =>
      setCurrentTime(
        new Date().toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit", hour12: true })
      );
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  /* fake refresh */
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((k) => k + 1);
    }, 1800);
  };

  /* stagger variants */
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  } as const;
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  } as const;
  const slideLeft = {
    hidden: { opacity: 0, x: -30 },
    show:   { opacity: 1, x: 0,  transition: { duration: 0.45, ease: "easeOut" } },
  } as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <WeatherStyles />

      {/* ── Ambient Orbs ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Navbar ── */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-10" key={refreshKey}>

        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-400 text-sm font-semibold mb-6">
            🌤️ AI Weather Intelligence
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            Weather &amp;{" "}
            <span className="shimmer-text">Plant Insights</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            Real-time weather analysis with AI-powered plant care recommendations
            tailored to today&apos;s conditions.
          </p>

          {/* Location + time row */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/40 text-slate-300 text-sm font-medium backdrop-blur-md">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Cairo, Egypt
            </span>

            <AnimatePresence mode="wait">
              <motion.span
                key={currentTime}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/40 text-slate-300 text-sm backdrop-blur-md"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                Last updated: {currentTime}
              </motion.span>
            </AnimatePresence>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
              aria-label="Refresh weather data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════
            CURRENT WEATHER HERO CARD
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mb-8 p-7 sm:p-10 bg-gradient-to-br from-slate-900/60 via-amber-950/20 to-slate-900/60 backdrop-blur-md rounded-3xl border border-amber-500/15 relative overflow-hidden"
        >
          {/* decorative glow inside card */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative z-10">

            {/* Left – big temp + condition */}
            <div className="flex items-center gap-6">
              <div className="float-up">
                <Sun className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]" />
              </div>
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-8xl sm:text-9xl font-black text-white leading-none">
                    {displayTemp}
                  </span>
                  <span className="text-4xl font-bold text-amber-400 mb-3">°C</span>
                </div>
                <p className="text-slate-300 text-xl font-semibold mt-1">Mostly Sunny</p>
                <p className="text-slate-500 text-sm">Cairo Governorate</p>
              </div>
            </div>

            {/* Right – metric chips */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: <Thermometer className="w-4 h-4 text-red-400" />,    label: "Feels Like", val: "38°C"    },
                { icon: <Droplets    className="w-4 h-4 text-blue-400" />,   label: "Humidity",   val: "45%"     },
                { icon: <Wind        className="w-4 h-4 text-cyan-400" />,   label: "Wind",       val: "12 km/h" },
                { icon: <Sun         className="w-4 h-4 text-yellow-400" />, label: "UV Index",   val: "8 · High" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/60 rounded-2xl min-w-[130px]">
                  {m.icon}
                  <div>
                    <p className="text-[10px] text-slate-500 leading-none">{m.label}</p>
                    <p className="text-sm font-bold text-white">{m.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Safety Indicator */}
          <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">
                Plant Safety Status
              </p>
              <AlertBadge level={alertLevel} />
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Visibility: <span className="text-white font-medium">10 km</span></span>
              <Zap className="w-4 h-4 text-yellow-400 ml-2" />
              <span>AQI: <span className="text-emerald-400 font-medium">Good (42)</span></span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════
            AI RECOMMENDATIONS PANEL
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 p-6 sm:p-8 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                🤖 AI Plant Care Recommendations for Today
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Based on current Cairo conditions · 34°C · Sunny · UV 8</p>
            </div>
          </div>

          <motion.ul
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {aiRecommendations.map((rec, i) => (
              <motion.li
                key={i}
                variants={slideLeft}
                className={`flex items-start gap-3 p-4 bg-slate-950/40 border-l-2 rounded-xl border border-slate-800/50 ${rec.color} hover:bg-slate-900/50 transition-colors`}
              >
                <span className="text-slate-200 text-sm leading-relaxed">{rec.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ═══════════════════════════════════════
            WEATHER METRICS GRID
        ═══════════════════════════════════════ */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Card 1 – Temperature */}
          <motion.div variants={fadeUp} className="p-5 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <Thermometer className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">Temperature</span>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">34°C</div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
              <span className="flex items-center gap-1 text-red-400">
                <ArrowUp className="w-3 h-3" /> 38°
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <ArrowDown className="w-3 h-3" /> 22°
              </span>
            </div>
            {/* animated thermometer fill */}
            <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "72%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] text-amber-400 font-medium">🌱 High heat — water deeply</p>
          </motion.div>

          {/* Card 2 – Humidity */}
          <motion.div variants={fadeUp} className="p-5 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 self-start">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Droplets className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">Humidity</span>
            </div>
            <HumidityRing value={45} />
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Optimal range: <span className="text-slate-200">50–70%</span>
            </p>
            <p className="text-[11px] text-blue-400 font-medium mt-1">💧 Below optimal — mist plants</p>
          </motion.div>

          {/* Card 3 – Wind */}
          <motion.div variants={fadeUp} className="p-5 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Wind className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">Wind</span>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">12<span className="text-lg font-semibold text-slate-400"> km/h</span></div>
            <p className="text-xs text-slate-400 mb-4">Direction: <span className="text-cyan-300 font-semibold">NW</span></p>
            {/* animated wind lines */}
            <div className="space-y-1.5 mb-4">
              {[{ w: "w-full" }, { w: "w-3/4" }, { w: "w-1/2" }].map((l, i) => (
                <div key={i} className={`h-0.5 rounded-full bg-cyan-500/40 wind-anim ${l.w}`} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <p className="text-[11px] text-cyan-400 font-medium">🍃 Mild — good for ventilation</p>
          </motion.div>

          {/* Card 4 – UV Index */}
          <motion.div variants={fadeUp} className="p-5 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <Sun className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">UV Index</span>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl font-extrabold text-white">8</span>
              <span className="text-red-400 text-sm font-bold mb-1">High</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 mb-0.5">
              <span>Low</span><span>Moderate</span><span>High</span><span>Extreme</span>
            </div>
            <UVBar value={8} />
            <p className="text-[11px] text-yellow-400 font-medium mt-3">🌂 Shield sun-sensitive plants</p>
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════
            HOURLY FORECAST
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            Hourly Forecast
          </h2>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
            <motion.div
              className="flex gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {hourlyForecast.map((h, i) => (
                <motion.div
                  key={i}
                  variants={slideLeft}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all min-w-[100px]
                    ${h.active
                      ? "bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-900/30 border-slate-800/60 hover:border-slate-700/60"
                    }`}
                >
                  <span className={`text-xs font-semibold ${h.active ? "text-emerald-400" : "text-slate-400"}`}>{h.time}</span>
                  <WeatherIcon type={h.icon} className="w-7 h-7" />
                  <span className={`text-xl font-extrabold ${h.active ? "text-white" : "text-slate-200"}`}>{h.temp}°</span>
                  <span className="text-[10px] text-slate-500 text-center leading-tight max-w-[90px]">{h.tip}</span>
                  {h.active && (
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Now
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════
            WEEKLY PLANT TIPS
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            7-Day Plant Forecast
          </h2>

          <div className="p-5 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {weeklyForecast.map((d, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all
                    ${i === 0
                      ? "bg-slate-800/50 border-emerald-500/30"
                      : "bg-slate-950/40 border-slate-800/40 hover:border-slate-700/60"
                    }`}
                >
                  <span className={`text-xs font-bold uppercase tracking-wide ${i === 0 ? "text-emerald-400" : "text-slate-400"}`}>
                    {d.day}
                  </span>
                  <WeatherIcon type={d.icon} className="w-7 h-7" />
                  <div className="flex items-center gap-1 text-xs">
                    <span className="flex items-center text-red-400 font-semibold"><ArrowUp className="w-3 h-3" />{d.high}°</span>
                    <span className="text-slate-600">/</span>
                    <span className="flex items-center text-blue-400 font-semibold"><ArrowDown className="w-3 h-3" />{d.low}°</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center leading-tight">{d.tip}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════
            PLANT SAFETY DASHBOARD
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Plant Safety Dashboard
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            Current risk assessment per plant type based on today&apos;s weather.
          </p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {plantSafetyData.map((p, i) => {
              const ringColor =
                p.status === "safe"    ? "border-emerald-500/30 hover:border-emerald-500/50" :
                p.status === "caution" ? "border-amber-500/30   hover:border-amber-500/50"   :
                                         "border-red-500/30     hover:border-red-500/50";
              const glowColor =
                p.status === "safe"    ? "bg-emerald-500/5 group-hover:bg-emerald-500/10" :
                p.status === "caution" ? "bg-amber-500/5   group-hover:bg-amber-500/10"   :
                                         "bg-red-500/5     group-hover:bg-red-500/10";

              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`group relative flex items-center gap-4 p-5 bg-slate-900/30 backdrop-blur-md rounded-2xl border transition-all ${ringColor}`}
                >
                  <div className={`absolute inset-0 rounded-2xl transition-colors pointer-events-none ${glowColor}`} />
                  <span className="text-4xl relative z-10">{p.emoji}</span>
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white text-base">{p.name}</span>
                      <StatusPill status={p.status} />
                    </div>
                    <p className="text-xs text-slate-400">{p.note}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════
            ADDITIONAL INSIGHT STRIP
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: <Eye      className="w-5 h-5 text-slate-400" />, label: "Visibility",    val: "10 km",      sub: "Clear skies"          },
            { icon: <Cloud    className="w-5 h-5 text-slate-400" />, label: "Cloud Cover",   val: "5%",         sub: "Mostly clear"         },
            { icon: <Zap      className="w-5 h-5 text-yellow-400"/>, label: "Air Quality",   val: "Good",       sub: "AQI 42"               },
            { icon: <Droplets className="w-5 h-5 text-blue-400"  />, label: "Dew Point",     val: "18°C",       sub: "Comfortable"          },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60 text-center hover:border-slate-700/70 transition-all">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-0.5">{s.label}</p>
              <p className="text-lg font-extrabold text-white">{s.val}</p>
              <p className="text-[11px] text-slate-400">{s.sub}</p>
            </div>
          ))}
        </motion.div>

      </div>{/* end max-w-6xl */}

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-extrabold tracking-tight text-lg">Sonbula</span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
              {["Home", "Plants", "Weather", "Assistant", "About"].map((l) => (
                <a
                  key={l}
                  href={l === "Home" ? "/" : `/${l.toLowerCase()}`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {l}
                </a>
              ))}
            </nav>

            {/* Copyright */}
            <p className="text-slate-600 text-xs text-center">
              © {new Date().getFullYear()} Sonbula · AI Plant Intelligence
            </p>
          </div>

          <p className="text-center text-slate-700 text-xs mt-6">
            Weather data is simulated for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
