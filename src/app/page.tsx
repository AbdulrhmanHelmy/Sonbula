"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./home-page.css";
import { useSettings } from "@/context/SettingsContext";

// ─── Static UI Strings (bilingual) ───────────────────────────────────────────

const UI = {
  en: {
    heroGradient: "AI Plant Disease ",
    heroSolid: "Detection",
    heroSub:
      "Upload plant images and let AI detect diseases instantly. Get accurate diagnosis and actionable insights.",
    btnAnalyze: "Analyze Plant",
    btnDictionary: "Plants Dictionary 🌿",
    btnAssistant: "AI Assistant 🤖",
    stat1Value: "99%",
    stat1Label: "Detection Accuracy",
    stat2Value: "<2s",
    stat2Label: "Analysis Time",
    stat3Value: "500+",
    stat3Label: "Plant Diseases",
    whyTitle: "Why Choose Sanbula?",
    whySub: "Advanced AI technology for modern agriculture",
    card1Title: "Upload Plant Images",
    card1Desc:
      "Easily upload photos of your plants. Supports multiple formats including JPG, PNG, and WebP for maximum compatibility.",
    card1Li1: "Quick upload",
    card1Li2: "Drag & drop support",
    card2Title: "AI Disease Diagnosis",
    card2Desc:
      "Our advanced AI analyzes plant images and identifies diseases with high accuracy. Get detailed information about detected issues.",
    card2Li1: "ML-powered detection",
    card2Li2: "Confidence scores",
    card3Title: "Fast & Accurate Results",
    card3Desc:
      "Get instant results with detailed treatment recommendations. Our system provides actionable insights to save your crops.",
    card3Li1: "Real-time processing",
    card3Li2: "Treatment guides",
    ctaTitle: "Ready to Protect Your Plants?",
    ctaSub:
      "Start analyzing plant diseases with our AI-powered platform today. Get instant diagnosis and treatment recommendations.",
    ctaBtn: "Get Started Now",
    footerAbout: "About",
    footerSupport: "Support",
    footerSettings: "Settings",
    footerCopy: "© 2026 Sonbula. Plant disease detection powered by AI.",
  },
  ar: {
    heroGradient: "كشف أمراض النباتات ",
    heroSolid: "بالذكاء الاصطناعي",
    heroSub:
      "ارفع صور نباتاتك ودع الذكاء الاصطناعي يكشف الأمراض فوراً. احصل على تشخيص دقيق ورؤى قابلة للتنفيذ.",
    btnAnalyze: "تحليل نبات",
    btnDictionary: "قاموس النباتات 🌿",
    btnAssistant: "مساعد الذكاء الاصطناعي 🤖",
    stat1Value: "99%",
    stat1Label: "دقة الكشف",
    stat2Value: "أقل من 2 ث",
    stat2Label: "وقت التحليل",
    stat3Value: "+500",
    stat3Label: "مرض نباتي",
    whyTitle: "لماذا تختار سنبلة؟",
    whySub: "تقنية ذكاء اصطناعي متقدمة للزراعة الحديثة",
    card1Title: "ارفع صور نباتاتك",
    card1Desc:
      "ارفع صور نباتاتك بسهولة. يدعم النظام صيغ متعددة منها JPG وPNG وWebP لتوافق أقصى.",
    card1Li1: "رفع سريع",
    card1Li2: "دعم السحب والإفلات",
    card2Title: "تشخيص أمراض بالذكاء الاصطناعي",
    card2Desc:
      "يحلل ذكاؤنا الاصطناعي المتقدم صور النباتات ويحدد الأمراض بدقة عالية. احصل على معلومات تفصيلية عن المشكلات المكتشفة.",
    card2Li1: "كشف مدعوم بالتعلم الآلي",
    card2Li2: "درجات الثقة",
    card3Title: "نتائج سريعة ودقيقة",
    card3Desc:
      "احصل على نتائج فورية مع توصيات علاجية مفصّلة. يقدم نظامنا رؤى قابلة للتنفيذ لإنقاذ محاصيلك.",
    card3Li1: "معالجة فورية",
    card3Li2: "أدلة علاجية",
    ctaTitle: "هل أنت مستعد لحماية نباتاتك؟",
    ctaSub:
      "ابدأ تحليل أمراض النباتات بمنصتنا المدعومة بالذكاء الاصطناعي اليوم. تشخيص فوري وتوصيات علاجية.",
    ctaBtn: "ابدأ الآن",
    footerAbout: "عن المنصة",
    footerSupport: "الدعم",
    footerSettings: "الإعدادات",
    footerCopy: "© 2026 سنبلة. كشف أمراض النباتات بالذكاء الاصطناعي.",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { language } = useSettings();
  const isAr = language === "ar";
  const t = UI[isAr ? "ar" : "en"];

  return (
    <div className="home-root min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                {t.heroGradient}
              </span>
              <span className="block text-gray-900">{t.heroSolid}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.heroSub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group">
              <span>{t.btnAnalyze}</span>
              <svg
                className={`w-5 h-5 ${isAr ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2 group-hover:translate-x-1"} transition-transform`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/plants"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-xl shadow-md transition-all hover:scale-105 border border-emerald-200">
              {t.btnDictionary}
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-xl transition-all">
              {t.btnAssistant}
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-green-200">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-green-600">
                {t.stat1Value}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {t.stat1Label}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-green-600">
                {t.stat2Value}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {t.stat2Label}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-green-600">
                {t.stat3Value}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {t.stat3Label}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t.whyTitle}
          </h2>
          <p className="text-xl text-gray-600">{t.whySub}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              emoji: "📸",
              title: t.card1Title,
              desc: t.card1Desc,
              li1: t.card1Li1,
              li2: t.card1Li2,
            },
            {
              emoji: "🤖",
              title: t.card2Title,
              desc: t.card2Desc,
              li1: t.card2Li1,
              li2: t.card2Li2,
            },
            {
              emoji: "⚡",
              title: t.card3Title,
              desc: t.card3Desc,
              li1: t.card3Li1,
              li2: t.card3Li2,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:translate-y-[-4px]">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {card.emoji}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0" />
                    {card.li1}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0" />
                    {card.li2}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            {t.ctaSub}
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 shadow-lg transition-all transform hover:scale-105 group">
            <span>{t.ctaBtn}</span>
            <svg
              className={`w-5 h-5 ${isAr ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2 group-hover:translate-x-1"} transition-transform`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">🌱</span>
              <span className="font-bold text-white text-lg">
                {isAr ? "سنبلة" : "Sonbula"}
              </span>
            </div>

            <div className="flex items-center gap-6 justify-center flex-wrap">
              <Link
                href="/about"
                className="text-gray-400 hover:text-green-500 font-medium transition-colors text-sm">
                {t.footerAbout}
              </Link>
              <Link
                href="/support"
                className="text-gray-400 hover:text-green-500 font-medium transition-colors text-sm">
                {t.footerSupport}
              </Link>
              <Link
                href="/settings"
                className="text-gray-400 hover:text-green-500 font-medium transition-colors text-sm">
                {t.footerSettings}
              </Link>
            </div>

            <p className="text-sm flex-shrink-0 text-center sm:text-right">
              {t.footerCopy}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
