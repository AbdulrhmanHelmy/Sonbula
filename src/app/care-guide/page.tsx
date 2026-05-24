"use client";

import Navbar from "@/components/Navbar";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Droplets,
  Sun,
  Sprout,
  Scissors,
  FlaskConical,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Star,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// ─── Sidebar nav config ───────────────────────────────────────────────────────
const navItems: NavItem[] = [
  { id: "watering", label: "Watering Guide", icon: <Droplets className="w-4 h-4" /> },
  { id: "fertilizer", label: "Fertilizer Guide", icon: <FlaskConical className="w-4 h-4" /> },
  { id: "lighting", label: "Lighting Guide", icon: <Sun className="w-4 h-4" /> },
  { id: "soil", label: "Soil Guide", icon: <Sprout className="w-4 h-4" /> },
  { id: "pruning", label: "Pruning Guide", icon: <Scissors className="w-4 h-4" /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="scroll-mt-24"
    >
      {children}
    </motion.section>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          {icon}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{label}</h2>
      </div>
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
}

function ProTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
      <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
      <p className="text-slate-300 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function WarningTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-amber-500/8 border border-amber-500/20 rounded-xl">
      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-slate-300 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

// 1. Watering
function WateringSection() {
  const wateringTypes = [
    {
      title: "Indoor Plants",
      emoji: "🪴",
      freq: "Every 7–10 days",
      color: "emerald",
      tips: [
        "Water when top 2 cm of soil is dry",
        "Mist leaves weekly to raise humidity",
        "Use room-temperature water",
        "Ensure pot has proper drainage",
      ],
    },
    {
      title: "Outdoor Crops",
      emoji: "🌽",
      freq: "2–3 times / week",
      color: "sky",
      tips: [
        "Water deeply to encourage root growth",
        "Avoid wetting foliage — invite disease",
        "Early morning watering is best",
        "Mulch to retain soil moisture",
      ],
    },
    {
      title: "Succulents & Cacti",
      emoji: "🌵",
      freq: "Once every 2–3 weeks",
      color: "orange",
      tips: [
        "Let soil dry completely between waterings",
        "Never let roots sit in standing water",
        "Reduce watering in winter dormancy",
        "Use terracotta pots for faster drying",
      ],
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  const seasonCalendar = [
    { season: "Spring", freq: "Moderate", note: "Resume regular watering as growth picks up" },
    { season: "Summer", freq: "High", note: "Water frequently; heat accelerates evaporation" },
    { season: "Autumn", freq: "Low–Moderate", note: "Gradually reduce as growth slows" },
    { season: "Winter", freq: "Minimal", note: "Most plants need very little — check soil first" },
  ];

  return (
    <SectionWrapper id="watering">
      <SectionTitle
        icon={<Droplets className="w-5 h-5" />}
        label="Watering Guide"
        description="Proper watering is the single most impactful care habit. Learn the right frequency, method, and seasonal adjustments for every plant type."
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {wateringTypes.map((type, i) => (
          <motion.div
            key={type.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            <GlassCard className="p-5 h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{type.emoji}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${colorMap[type.color]}`}
                >
                  {type.freq}
                </span>
              </div>
              <h3 className="font-bold text-white mb-3">{type.title}</h3>
              <ul className="space-y-1.5">
                {type.tips.map((t) => (
                  <li key={t} className="flex gap-2 text-slate-400 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mb-6">
        <WarningTip>
          <strong className="text-amber-300">Overwatering</strong> is the #1 killer of houseplants.
          Yellow leaves, mushy stems, and a sour soil smell are classic signs. Always check soil
          moisture before reaching for the watering can.
        </WarningTip>
      </div>

      {/* Seasonal calendar */}
      <GlassCard className="p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-400" /> Seasonal Watering Calendar
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-800/60">
                <th className="pb-2 pr-4 font-semibold">Season</th>
                <th className="pb-2 pr-4 font-semibold">Frequency</th>
                <th className="pb-2 font-semibold">Guidance</th>
              </tr>
            </thead>
            <tbody>
              {seasonCalendar.map((row, i) => (
                <tr key={row.season} className={i % 2 === 0 ? "bg-white/2" : ""}>
                  <td className="py-2 pr-4 text-emerald-400 font-medium">{row.season}</td>
                  <td className="py-2 pr-4 text-slate-300">{row.freq}</td>
                  <td className="py-2 text-slate-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}

// 2. Fertilizer
function FertilizerSection() {
  const npk = [
    { letter: "N", name: "Nitrogen", color: "text-green-400 bg-green-500/10 border-green-500/20", desc: "Drives leafy, vegetative growth" },
    { letter: "P", name: "Phosphorus", color: "text-purple-400 bg-purple-500/10 border-purple-500/20", desc: "Supports root & flower development" },
    { letter: "K", name: "Potassium", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", desc: "Boosts overall plant health & resilience" },
  ];

  const fertTypes = [
    {
      title: "Organic",
      emoji: "🌿",
      when: "Throughout growing season",
      benefits: ["Feeds soil microbes", "Long-lasting effect", "Low burn risk", "Improves soil structure"],
    },
    {
      title: "Liquid",
      emoji: "💧",
      when: "Every 2–4 weeks when actively growing",
      benefits: ["Fast-acting results", "Easy to apply", "Precise dosing", "Great for container plants"],
    },
    {
      title: "Granular",
      emoji: "🪨",
      when: "Start of growing season",
      benefits: ["Slow-release option", "Covers large areas", "Cost-effective", "Reduces application frequency"],
    },
    {
      title: "Slow-Release",
      emoji: "⏱️",
      when: "Every 3–6 months",
      benefits: ["Feeds for months", "Minimal risk of over-feeding", "Convenient", "Ideal for busy gardeners"],
    },
  ];

  const schedule = [
    { type: "Tropical Houseplants", spring: "Bi-weekly liquid", summer: "Weekly liquid", fall: "Monthly", winter: "None" },
    { type: "Vegetables", spring: "Starter granular", summer: "Weekly liquid", fall: "Light potassium", winter: "None" },
    { type: "Flowering Plants", spring: "High-P liquid", summer: "High-P liquid", fall: "Reduce gradually", winter: "None" },
    { type: "Succulents", spring: "Diluted liquid ×1", summer: "Monthly diluted", fall: "None", winter: "None" },
  ];

  return (
    <SectionWrapper id="fertilizer">
      <SectionTitle
        icon={<FlaskConical className="w-5 h-5" />}
        label="Fertilizer Guide"
        description="Plants need macro and micro nutrients to thrive. Understanding NPK ratios and fertilizer types lets you feed your plants smarter, not harder."
      />

      {/* NPK */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {npk.map((n, i) => (
          <motion.div
            key={n.letter}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-4 text-center">
              <span className={`inline-block text-2xl font-extrabold mb-1 px-3 py-1 rounded-lg border ${n.color}`}>
                {n.letter}
              </span>
              <p className="font-semibold text-white text-sm mb-1">{n.name}</p>
              <p className="text-slate-400 text-xs">{n.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Fertilizer cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {fertTypes.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
          >
            <GlassCard className="p-5 h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{f.emoji}</span>
                <div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-emerald-400">{f.when}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {f.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-slate-400 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mb-6">
        <ProTip>
          Fertilize during the <strong className="text-emerald-300">active growing season</strong> (spring
          and summer). Most plants enter dormancy in winter — feeding them then wastes fertilizer and
          can burn roots.
        </ProTip>
      </div>

      {/* Schedule grid */}
      <GlassCard className="p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-emerald-400" /> Fertilizer Schedule by Plant Type
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-800/60">
                <th className="pb-2 pr-3 font-semibold">Plant Type</th>
                <th className="pb-2 pr-3 font-semibold text-green-400">Spring</th>
                <th className="pb-2 pr-3 font-semibold text-yellow-400">Summer</th>
                <th className="pb-2 pr-3 font-semibold text-orange-400">Fall</th>
                <th className="pb-2 font-semibold text-blue-400">Winter</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr key={row.type} className={i % 2 === 0 ? "bg-white/2" : ""}>
                  <td className="py-2 pr-3 text-white font-medium">{row.type}</td>
                  <td className="py-2 pr-3 text-slate-400">{row.spring}</td>
                  <td className="py-2 pr-3 text-slate-400">{row.summer}</td>
                  <td className="py-2 pr-3 text-slate-400">{row.fall}</td>
                  <td className="py-2 text-slate-500">{row.winter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}

// 3. Lighting
function LightingSection() {
  const lightLevels = [
    { label: "Deep Shade", lux: "< 500 lux", color: "bg-slate-700", textColor: "text-slate-300", plants: "Pothos, Cast Iron Plant, Peace Lily" },
    { label: "Partial Shade", lux: "500–2,000 lux", color: "bg-slate-600", textColor: "text-slate-200", plants: "Ferns, Snake Plant, ZZ Plant" },
    { label: "Indirect Light", lux: "2,000–10,000 lux", color: "bg-emerald-800", textColor: "text-emerald-200", plants: "Monsteras, Philodendrons, Orchids" },
    { label: "Bright Indirect", lux: "10,000–20,000 lux", color: "bg-emerald-600", textColor: "text-white", plants: "Fiddle Leaf Fig, Bird of Paradise" },
    { label: "Full Sun", lux: "> 20,000 lux", color: "bg-yellow-500", textColor: "text-yellow-950", plants: "Tomatoes, Cacti, Lavender, Basil" },
  ];

  const lightCards = [
    { title: "Low-Light Lovers", emoji: "🌑", desc: "Thrive in north-facing rooms or far from windows. Perfect for offices.", examples: ["Pothos", "Cast Iron Plant", "Dracaena", "Chinese Evergreen"] },
    { title: "Medium-Light Plants", emoji: "🌤️", desc: "Need a few feet from a bright window or near east-facing glass.", examples: ["Snake Plant", "Ferns", "Peace Lily", "Spider Plant"] },
    { title: "Bright Indirect", emoji: "⛅", desc: "Best near south or west windows with a sheer curtain as diffuser.", examples: ["Monstera", "Fiddle Leaf Fig", "Anthuriums", "Calathea"] },
    { title: "Full-Sun Lovers", emoji: "☀️", desc: "Require 6+ hours of direct sun. Ideal on south-facing windowsills or outdoors.", examples: ["Succulents", "Cacti", "Herbs", "Tomatoes"] },
  ];

  const growLights = [
    { type: "Seedling Trays", watts: "20–40 W", note: "LED panel, 16 h/day" },
    { type: "Small Houseplants", watts: "40–80 W", note: "Full-spectrum LED, 14 h/day" },
    { type: "Medium Tropicals", watts: "100–200 W", note: "LED or T5 fluorescent, 12 h/day" },
    { type: "Fruiting Crops", watts: "300–600 W", note: "High-output LED, 18 h/day" },
  ];

  return (
    <SectionWrapper id="lighting">
      <SectionTitle
        icon={<Sun className="w-5 h-5" />}
        label="Lighting Guide"
        description="Light is plant food. Getting the light level right prevents leggy growth, leaf burn, and poor flowering. Every plant has a sweet spot on the spectrum."
      />

      {/* Spectrum bar */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm mb-3 font-medium">Light Level Spectrum</p>
        <div className="flex rounded-xl overflow-hidden h-10 border border-slate-800/60">
          {lightLevels.map((l) => (
            <div
              key={l.label}
              className={`flex-1 flex items-center justify-center text-[10px] font-semibold ${l.color} ${l.textColor} px-1 text-center leading-tight`}
            >
              {l.label}
            </div>
          ))}
        </div>
        <div className="flex mt-1">
          {lightLevels.map((l) => (
            <div key={l.label} className="flex-1 text-center text-[9px] text-slate-500 px-0.5">
              {l.lux}
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {lightCards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
          >
            <GlassCard className="p-5 h-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{c.emoji}</span>
                <h3 className="font-bold text-white">{c.title}</h3>
              </div>
              <p className="text-slate-400 text-xs mb-3 leading-relaxed">{c.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {c.examples.map((e) => (
                  <span key={e} className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {e}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <WarningTip>
          <strong className="text-amber-300">Too much light:</strong> Bleached, faded, or scorched patches on leaves. Move plant further from direct sun or add a sheer curtain.
        </WarningTip>
        <div className="flex gap-3 p-4 bg-slate-800/30 border border-slate-700/40 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 text-sm leading-relaxed">
            <strong className="text-purple-300">Too little light (etiolation):</strong> Pale, stretched stems reaching toward the window. Rotate plants 90° weekly for even growth.
          </p>
        </div>
      </div>

      {/* Grow light guide */}
      <GlassCard className="p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Sun className="w-4 h-4 text-yellow-400" /> Indoor Grow Light Recommendations
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {growLights.map((g, i) => (
            <div key={g.type} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-slate-800/40">
              <span className="text-lg font-black text-yellow-400">{i + 1}</span>
              <div>
                <p className="text-white text-sm font-semibold">{g.type}</p>
                <p className="text-emerald-400 text-xs font-medium">{g.watts}</p>
                <p className="text-slate-400 text-xs">{g.note}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}

// 4. Soil
function SoilSection() {
  const soilTypes = [
    { name: "Sandy Soil", swatch: "bg-amber-200", char: "Fast-draining, low nutrients", ideal: ["Cacti", "Lavender", "Carrots"] },
    { name: "Clay Soil", swatch: "bg-orange-400", char: "High nutrients, waterlogged risk", ideal: ["Willows", "Asters", "Sedges"] },
    { name: "Loamy Soil", swatch: "bg-amber-700", char: "Balanced drainage & nutrients", ideal: ["Vegetables", "Roses", "Fruit trees"] },
    { name: "Peat-based", swatch: "bg-amber-900", char: "Moisture-retaining, acidic", ideal: ["Blueberries", "Orchids", "Ferns"] },
    { name: "Cactus Mix", swatch: "bg-yellow-200", char: "Ultra-porous, mineral-rich", ideal: ["Succulents", "Cacti", "Agave"] },
  ];

  const phLevels = [
    { range: "4.0 – 5.5", label: "Strongly Acidic", color: "text-red-400 bg-red-500/10 border-red-500/20", plants: "Blueberries, Azaleas, Rhododendrons" },
    { range: "5.5 – 6.5", label: "Mildly Acidic", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", plants: "Most vegetables, Roses, Strawberries" },
    { range: "6.5 – 7.0", label: "Neutral", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", plants: "Lawns, most houseplants, herbs" },
    { range: "7.0 – 8.0", label: "Alkaline", color: "text-sky-400 bg-sky-500/10 border-sky-500/20", plants: "Lavender, Clematis, Dianthus" },
  ];

  const diyMixes = [
    { plant: "Tropical Houseplants", recipe: "2 parts potting soil + 1 part perlite + 1 part coco coir" },
    { plant: "Succulents & Cacti", recipe: "1 part potting soil + 1 part coarse sand + 1 part perlite" },
    { plant: "Vegetables", recipe: "3 parts compost + 2 parts garden soil + 1 part perlite" },
  ];

  return (
    <SectionWrapper id="soil">
      <SectionTitle
        icon={<Sprout className="w-5 h-5" />}
        label="Soil Guide"
        description="Soil is more than just dirt — it's the living foundation of your plant's health. The right mix determines drainage, aeration, pH, and nutrient availability."
      />

      {/* Soil types */}
      <div className="grid sm:grid-cols-5 gap-3 mb-6">
        {soilTypes.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            <GlassCard className="p-4 h-full flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full ${s.swatch} mb-2 border-2 border-white/10`} />
              <p className="font-bold text-white text-xs mb-1">{s.name}</p>
              <p className="text-slate-400 text-[10px] mb-2 leading-tight">{s.char}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {s.ideal.map((p) => (
                  <span key={p} className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                    {p}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* pH Chart */}
      <GlassCard className="p-5 mb-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-emerald-400" /> Soil pH Chart
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {phLevels.map((ph, i) => (
            <motion.div
              key={ph.range}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`p-3 rounded-xl border text-center ${ph.color}`}
            >
              <p className="text-lg font-extrabold mb-0.5">{ph.range}</p>
              <p className="text-xs font-semibold mb-1">{ph.label}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{ph.plants}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <div className="mb-6">
        <ProTip>
          Good drainage prevents root rot. Always use pots with drainage holes and consider a layer of
          gravel at the bottom for particularly moisture-sensitive plants.
        </ProTip>
      </div>

      {/* DIY mixes */}
      <GlassCard className="p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-400" /> DIY Soil Mix Recipes
        </h3>
        <div className="space-y-3">
          {diyMixes.map((mix, i) => (
            <div key={mix.plant} className="flex items-start gap-3 p-3 bg-white/3 rounded-xl border border-slate-800/40">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-white text-sm font-semibold mb-0.5">{mix.plant}</p>
                <p className="text-slate-400 text-xs">{mix.recipe}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}

// 5. Pruning
function PruningSection() {
  const seasonPruning = [
    { season: "🌸 Spring", action: "Growth Pruning", desc: "Shape plants, encourage branching and new shoots" },
    { season: "☀️ Summer", action: "Maintenance", desc: "Deadhead flowers, remove spent blooms & suckers" },
    { season: "🍂 Fall", action: "Prep & Cleanup", desc: "Remove dead material before dormancy sets in" },
    { season: "❄️ Winter", action: "Minimal", desc: "Only remove dead or diseased wood on hardy plants" },
  ];

  const tools = [
    { name: "Bypass Pruners", emoji: "✂️", desc: "Best for stems up to 1.5 cm. Clean, precise cuts with scissor-like blades." },
    { name: "Garden Scissors", emoji: "🪚", desc: "Ideal for herbs, deadheading flowers, and delicate houseplant trimming." },
    { name: "Pruning Saw", emoji: "🔧", desc: "For branches over 2.5 cm. Use on woody shrubs and small trees." },
  ];

  const steps = [
    { num: 1, title: "Sterilize Your Tools", desc: "Wipe blades with 70% isopropyl alcohol or diluted bleach solution before starting." },
    { num: 2, title: "Identify Target Growth", desc: "Look for dead, diseased, crossing, or inward-facing branches first." },
    { num: 3, title: "Cut at a 45° Angle", desc: "Angled cuts shed water and direct new growth outward from the plant." },
    { num: 4, title: "Seal Large Cuts", desc: "Apply pruning paste or wound sealant to cuts wider than 2.5 cm to prevent disease entry." },
    { num: 5, title: "Dispose of Diseased Material", desc: "Never compost diseased clippings — bag and bin them to stop pathogen spread." },
  ];

  const mistakes = [
    { warning: "Pruning too late in fall can stimulate growth that gets killed by frost." },
    { warning: "Leaving stubs invites disease and insect infestation — always cut flush to the branch collar." },
    { warning: "Removing more than 1/3 of the plant at once causes severe stress." },
    { warning: "Dull blades crush rather than cut — sharpen or replace tools regularly." },
  ];

  return (
    <SectionWrapper id="pruning">
      <SectionTitle
        icon={<Scissors className="w-5 h-5" />}
        label="Pruning Guide"
        description="Strategic pruning keeps plants healthy, shapely, and productive. The right cut at the right time makes all the difference between flourishing and failure."
      />

      {/* Season chart */}
      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        {seasonPruning.map((s, i) => (
          <motion.div
            key={s.season}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
          >
            <GlassCard className="p-4 text-center h-full">
              <p className="text-xl mb-1">{s.season.split(" ")[0]}</p>
              <p className="text-white font-bold text-sm mb-1">{s.action}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Tools */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {tools.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
          >
            <GlassCard className="p-5">
              <span className="text-2xl mb-2 block">{t.emoji}</span>
              <h3 className="font-bold text-white mb-1">{t.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Step-by-step */}
      <GlassCard className="p-5 mb-6">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step-by-Step Pruning Method
        </h3>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4 p-3 bg-white/3 rounded-xl border border-slate-800/40"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black text-sm shrink-0">
                {step.num}
              </span>
              <div>
                <p className="text-white font-semibold text-sm">{step.title}</p>
                <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Common mistakes */}
      <div className="space-y-3">
        <h3 className="font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Common Pruning Mistakes
        </h3>
        {mistakes.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <WarningTip>{m.warning}</WarningTip>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── AI PANEL ─────────────────────────────────────────────────────────────────
function AIPanel() {
  const chips = [
    "💧 Water alert: 3 plants need watering",
    "☀️ Optimal sunlight detected",
    "🌿 Fertilizer due in 5 days",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mt-20"
    >
      <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 sm:p-12 text-center">
        {/* Glow */}
        <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl pointer-events-none" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-block text-4xl mb-4">🤖</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            AI Plant Care <span className="text-emerald-400">Assistant</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Get personalized care recommendations for your specific plants. Our AI analyses your
            plant collection, local climate, and growth history to deliver targeted, actionable advice.
          </p>

          {/* Chip row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {chips.map((chip, i) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                viewport={{ once: true }}
                className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full font-medium"
              >
                {chip}
              </motion.span>
            ))}
          </div>

          <Link href="/assistant">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
            >
              Try AI Assistant
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CareGuidePage() {
  const [activeSection, setActiveSection] = useState("watering");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const quickStats = [
    { label: "Plants Covered", value: "200+" },
    { label: "Care Categories", value: "5" },
    { label: "AI-Powered Tips", value: "∞" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-700/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
              ✦ Expert Plant Care
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Complete Plant{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Care Guide
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-slate-400 text-lg max-w-xl mx-auto"
          >
            Master the art of plant care with AI-backed guidance on watering, nutrition, light, soil,
            and pruning.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex items-center justify-center gap-6 sm:gap-12 flex-wrap"
          >
            {quickStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── MAIN LAYOUT ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:w-56 shrink-0"
            >
              <div className="lg:sticky lg:top-24 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">
                  Sections
                </p>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeSection === item.id
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/4"
                      }`}
                    >
                      <span
                        className={
                          activeSection === item.id ? "text-emerald-400" : "text-slate-500"
                        }
                      >
                        {item.icon}
                      </span>
                      {item.label}
                      {activeSection === item.id && (
                        <ChevronRight className="w-3 h-3 ml-auto text-emerald-400" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Content */}
            <div className="flex-1 space-y-20">
              <WateringSection />
              <FertilizerSection />
              <LightingSection />
              <SoilSection />
              <PruningSection />
              <AIPanel />
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Sonbula
                </span>
              </div>
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Sonbula. AI-powered plant care, always growing.
              </p>
              <div className="flex items-center gap-5 text-sm text-slate-500">
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                <Link href="/assistant" className="hover:text-emerald-400 transition-colors">Assistant</Link>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
