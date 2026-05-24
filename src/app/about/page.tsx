"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { 
  ArrowLeft, 
  Leaf, 
  Search, 
  Bug, 
  Pill, 
  Zap, 
  Cpu, 
  Code, 
  Layers, 
  Database,
  Mail,
  ExternalLink,
  Users
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Button from "@/components/ui/Button";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const CSSAnimationStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes gradient-shimmer {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .shimmer-text {
      background: linear-gradient(to right, #34d399, #10b981, #6ee7b7, #059669, #34d399);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient-shimmer 6s linear infinite;
    }
    @keyframes line-glow {
      0% { stroke-dashoffset: 24; }
      100% { stroke-dashoffset: 0; }
    }
    .glowing-dashed-line {
      stroke-dasharray: 8, 4;
      animation: line-glow 1.2s linear infinite;
    }
    @keyframes float-slower {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(3deg); }
    }
    .floating-logo {
      animation: float-slower 5s ease-in-out infinite;
    }
    .noise-bg {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
    }
  `}} />
);

function CountUpFloat({ 
  value, 
  decimals = 1, 
  prefix = "", 
  suffix = "", 
  duration = 1.5 
}: { 
  value: number; 
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const multiplier = Math.pow(10, decimals);
    const end = Math.floor(value * multiplier);
    if (start === end) return;

    let totalMilliseconds = duration * 1000;
    let incrementTime = 20;
    
    let timer = setInterval(() => {
      start += Math.ceil(end / (totalMilliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, decimals, duration]);

  return (
    <span ref={ref} className="font-sans">
      {prefix}
      {(count / Math.pow(10, decimals)).toFixed(decimals)}
      {suffix}
    </span>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md transition-all duration-300 ${className}`}
      style={{
        boxShadow: isHovered 
          ? "0 10px 30px -10px rgba(16, 185, 129, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)" 
          : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.02)"
      }}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(16, 185, 129, 0.12), transparent 80%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

function TechCard({ name, desc, icon, tooltip }: { name: string; desc: string; icon: React.ReactNode; tooltip: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/50 hover:border-emerald-500/30 transition-all text-center relative group cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 rounded-2xl blur-md transition-colors duration-500 pointer-events-none" />
      <div className="mx-auto p-2 bg-emerald-500/5 rounded-xl w-fit mb-2.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative">
        {icon}
        <div className="absolute inset-0 rounded-xl border border-emerald-500/0 group-hover:border-emerald-500/20 animate-pulse pointer-events-none" />
      </div>
      <h4 className="font-bold text-white text-sm relative z-10">{name}</h4>
      <p className="text-[10px] text-slate-500 mt-0.5 relative z-10">{desc}</p>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-52 p-3 bg-slate-900/95 border border-slate-800 text-slate-300 text-xs rounded-xl shadow-2xl backdrop-blur-md z-30 pointer-events-none text-center leading-relaxed"
          >
            <div className="font-bold text-emerald-400 mb-1">{name}</div>
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeveloperCard({ name, role, avatar, bio, githubUrl, linkedinUrl }: { 
  name: string; 
  role: string; 
  avatar: string; 
  bio: string; 
  githubUrl: string; 
  linkedinUrl: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-6 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60 text-center relative overflow-hidden group flex flex-col justify-between"
      style={{
        boxShadow: isHovered ? "0 15px 30px -15px rgba(16, 185, 129, 0.08)" : "none"
      }}
    >
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
      
      <div>
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 rounded-2xl blur-sm group-hover:scale-110 transition-transform duration-300" />
          <div className="relative w-full h-full bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:rotate-3 transition-transform duration-300">
            {avatar}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-emerald-400 duration-300">{name}</h3>
        
        <div className="min-h-[28px] mt-1.5">
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-block font-semibold border border-emerald-500/20">
            {role}
          </span>
        </div>

        <p className="text-slate-400 text-sm mt-4 leading-relaxed px-2">
          {bio}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-center gap-3 relative">
        <a 
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-emerald-400 transition-all hover:scale-110"
          aria-label={`${name}'s GitHub`}
        >
          <GithubIcon className="w-4 h-4" />
        </a>
        <a 
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-emerald-400 transition-all hover:scale-110"
          aria-label={`${name}'s LinkedIn`}
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const router = useRouter();
  const { language } = useSettings();
  const isAr = language === "ar";

  const features = [
    {
      icon: <Bug className="w-8 h-8 text-emerald-400 animate-pulse" />,
      title: "AI Disease Detection",
      titleAr: "كشف الأمراض بالذكاء الاصطناعي",
      description: "Our advanced computer vision models analyze leaf patterns to diagnose over 50+ plant diseases instantly with 99% accuracy.",
      descriptionAr: "تقوم نماذج الرؤية الحاسوبية المتقدمة بتحليل أنماط الأوراق لتشخيص أكثر من 50 مرضًا نباتيًا بدقة 99٪."
    },
    {
      icon: <Search className="w-8 h-8 text-emerald-400" />,
      title: "Plant Dictionary",
      titleAr: "قاموس النباتات الشامل",
      description: "Access our rich curated database of Egyptian agricultural crops, detailing growth requirements, seasons, and regional guides.",
      descriptionAr: "تصفح قاعدة بيانات غنية للمحاصيل الزراعية المصرية، توضح احتياجات النمو والمواسم وأماكن زراعتها بالتفصيل."
    },
    {
      icon: <Pill className="w-8 h-8 text-emerald-400" />,
      title: "Smart Recommendations",
      titleAr: "التوصيات الذكية والعلاج",
      description: "Receive customized botanical care plans, active chemical treatments, biological controls, and long-term prevention guidelines.",
      descriptionAr: "احصل على خطط رعاية متكاملة، تشمل العلاجات الكيميائية الفعالة، المكافحة الحيوية، وإرشادات الوقاية طويلة المدى."
    },
    {
      icon: <Zap className="w-8 h-8 text-emerald-400" />,
      title: "Fast Analysis",
      titleAr: "تحليل ذكي فوري",
      description: "Sub-second image processing powered by optimized Edge GPU computing pipelines, delivering answers when time is critical.",
      descriptionAr: "معالجة فائقة السرعة للصور مدعومة بحوسبة الحافة والـ GPU لتقديم إجابات سريعة وفورية في الحقل."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "1. Capture Leaf",
      titleAr: "1. التقاط ورقة النبات",
      desc: "Snap or upload a clear photo of the infected crop leaf from the field.",
      descAr: "قم بتصوير ورقة المحصول المصابة بالهاتف أو رفع صورة واضحة لها من الحقل.",
      icon: "📸"
    },
    {
      num: "02",
      title: "2. AI Diagnostics",
      titleAr: "2. تحليل الذكاء الاصطناعي",
      desc: "Our neural networks process visual features to instantly identify pathogens.",
      descAr: "تقوم شبكاتنا العصبية بتحليل الأنماط البصرية للورقة وتحديد مسببات المرض.",
      icon: "🧠"
    },
    {
      num: "03",
      title: "3. Direct Treatment",
      titleAr: "3. العلاج والوقاية",
      desc: "Get chemical, biological control guidelines, and active crop remedies.",
      descAr: "احصل فوراً على روشتة علاجية كيميائية، حيوية، وطرق وقائية طويلة المدى.",
      icon: "🌱"
    }
  ];

  const techStack = [
    { 
      name: "Next.js 16", 
      desc: "React Framework", 
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      tooltip: "Server-side rendering, fast routing, and SEO-optimized agricultural database delivery.",
      tooltipAr: "إطار عمل يدعم التقديم السحابي، التوجيه فائق السرعة، وتحسين الأداء ومحركات البحث لقاعدة المحاصيل."
    },
    { 
      name: "Gradio Client", 
      desc: "AI Pipeline API", 
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      tooltip: "Secures lightweight, high-performance streaming calls directly to hosted PyTorch CNN model endpoints.",
      tooltipAr: "تأمين تدفق اتصال البيانات السريع والمباشر مع نموذج الذكاء الاصطناعي المستضاف للرؤية الحاسوبية."
    },
    { 
      name: "Tailwind CSS v4", 
      desc: "Modern Glass UI", 
      icon: <Code className="w-5 h-5 text-emerald-400" />,
      tooltip: "Provides optimized rendering of responsive grid modules, fluid layouts, and dark theme variables.",
      tooltipAr: "تقديم وتنسيق الواجهات الزجاجية المتجاوبة تماماً مع مختلف الشاشات، والهواتف، والسمة الداكنة."
    },
    { 
      name: "Framer Motion", 
      desc: "Micro-Animations", 
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      tooltip: "Powering physics-based page transitions, spring layouts, and scroll intersection highlights.",
      tooltipAr: "تشغيل المؤثرات الحركية القائمة على الفيزياء الرياضية، والربط الحركي التفاعلي للعناصر مع الفأرة والتمرير."
    },
    { 
      name: "CNN Models", 
      desc: "AI Vision Classifier", 
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      tooltip: "Custom-trained convolutional networks optimizing leaf-disease detection vectors on regional agricultural crops.",
      tooltipAr: "نماذج شبكات عصبية مدربة خصيصاً على كشف أمراض المحاصيل المصرية والعربية بدقة قياسية."
    }
  ];

  const developers = [
    {
      name: "Abdulrahman",
      role: "Cloud & AI Infrastructure Engineer",
      roleAr: "مهندس البنية التحتية السحابية والـ AI",
      avatar: "🚀",
      bio: "Worked on cloud architecture, GPU server integration, AI deployment, and modern system infrastructure alongside Abdallah.",
      bioAr: "عمل على المعمارية السحابية، ودمج خوادم الـ GPU، ونشر نماذج الذكاء الاصطناعي، وتأسيس البنية التحتية الحديثة للنظام بالتعاون مع عبد الله.",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com"
    },
    {
      name: "Abdallah",
      role: "AI Engineer",
      roleAr: "مهندس ذكاء اصطناعي",
      avatar: "🧠",
      bio: "Responsible for building and training the AI models, integrating disease detection systems, and working on GPU-based AI processing with Abdulrahman.",
      bioAr: "مسؤول عن بناء وتدريب نماذج الذكاء الاصطناعي، ودمج أنظمة الكشف عن الأمراض، والعمل على معالجة الـ AI القائمة على الـ GPU بالتعاون مع عبد الرحمن.",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com"
    },
    {
      name: "Ramadan",
      role: "Frontend Developer",
      roleAr: "مطور واجهات تفاعلية (UI/UX)",
      avatar: "🎨",
      bio: "Responsible for building the frontend interface, UI/UX implementation, animations, responsive layouts, and the modern Sonbula experience using Next.js and React.",
      bioAr: "مسؤول عن بناء الواجهة الأمامية، وتصميم وتطبيق تجربة المستخدم (UI/UX)، وإضافة المؤثرات التفاعلية والتخطيطات المتجاوبة لمنصة سنبلة باستخدام Next.js وReact.",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com"
    },
    {
      name: "Wageeh",
      role: "Backend Developer",
      roleAr: "مطور نظم خلفية (Backend)",
      avatar: "📦",
      bio: "Responsible for backend systems, APIs, database management, authentication, and server-side architecture.",
      bioAr: "مسؤول عن بناء النظم الخلفية للشبكة، وإدارة واجهات البرمجة (APIs)، وإدارة قواعد البيانات، ونظام المصادقة والمعمارية السحابية للخادم.",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white noise-bg" 
      dir={isAr ? "rtl" : "ltr"}
    >
      <CSSAnimationStyles />

      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[70px] md:blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[350px] md:w-[650px] h-[350px] md:h-[650px] bg-emerald-500/5 rounded-full blur-[80px] md:blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: isAr ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")} 
            className="text-slate-400 hover:text-emerald-400 hover:bg-white/5 border border-transparent hover:border-slate-800/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? "ml-2 rotate-180" : "mr-2"}`} />
            {isAr ? "رجوع" : "Back"}
          </Button>
        </motion.div>

        <div className="text-center mb-24">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="floating-logo inline-flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 w-24 h-24 rounded-3xl shadow-2xl shadow-emerald-500/25 mb-8 group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            <Leaf className="w-12 h-12 text-white transform group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-3xl border border-emerald-400/40 animate-ping opacity-20 pointer-events-none" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black tracking-tight mb-6"
          >
            {isAr ? (
              <>
                حول منصة <span className="shimmer-text">سنبلة</span>
              </>
            ) : (
              <>
                About <span className="shimmer-text">Sonbula</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            {isAr 
              ? "منظومة زراعية متطورة مدعومة بالذكاء الاصطناعي (AI). نقدم تشخيصاً فورياً دقيقاً لأمراض النباتات وقاموساً للمحاصيل الإرشادية ليكون دليلك الزراعي الفوري في حقل عملك."
              : "A state-of-the-art agricultural ecosystem powered by Artificial Intelligence. Providing instant plant disease diagnostics and dynamic treatment libraries at your fingertips."
            }
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-24">
          {[
            { 
              number: <CountUpFloat value={99.2} decimals={1} suffix="%" />, 
              label: "Accuracy Rate", 
              labelAr: "دقة التشخيص المئوية" 
            },
            { 
              number: <CountUpFloat value={250} decimals={0} prefix="<" suffix="ms" />, 
              label: "Analysis Latency", 
              labelAr: "سرعة المعالجة والفحص" 
            },
            { 
              number: <CountUpFloat value={50} decimals={0} suffix="+" />, 
              label: "AI Pathologies", 
              labelAr: "الأمراض والآفات المدعومة" 
            },
            { 
              number: <CountUpFloat value={1.2} decimals={1} suffix="M+" />, 
              label: "Processed Scans", 
              labelAr: "إجمالي الفحوصات المنفذة" 
            }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-5 text-center bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60 hover:border-emerald-500/20 hover:bg-slate-900/40 transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                {stat.number}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1">
                {isAr ? stat.labelAr : stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? "قدرات المنظومة الأساسية" : "Platform Core Capabilities"}
            </h2>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm">
              {isAr ? "تقنيات متقدمة مدمجة لتلبية متطلبات المزارعين في مصر والشرق الأوسط." : "Engineered with high performance and interactive responsive layouts."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <SpotlightCard key={idx} className="p-6 flex flex-col justify-between group">
                <div>
                  <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                    <span>{isAr ? feature.titleAr : feature.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wider hidden sm:inline">
                      {isAr ? feature.title : feature.titleAr}
                    </span>
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {isAr ? feature.descriptionAr : feature.description}
                  </p>
                </div>
                <div className="pt-3.5 border-t border-slate-800/60 mt-2">
                  <p className="text-xs text-slate-400 leading-relaxed font-sans" dir={isAr ? "ltr" : "rtl"}>
                    {isAr ? feature.description : feature.descriptionAr}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? "كيف تعمل منظومة سنبلة؟" : "How Sonbula Works"}
            </h2>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm">
              {isAr ? "تكامل فوري في ثلاث خطوات للحصول على روشتة العلاج والمكافحة." : "Three direct modular pipelines delivering instant crop care diagnostic sheets."}
            </p>
          </div>

          <div className="p-8 bg-slate-900/20 backdrop-blur-md rounded-3xl border border-slate-800/50 relative overflow-hidden">
            <div className="hidden md:block absolute top-[64px] left-[16%] right-[16%] h-0.5 z-0 pointer-events-none">
              <svg className="w-full h-4 overflow-visible" fill="none">
                <path 
                  d="M 0 2 L 600 2"
                  stroke="url(#line-glow-grad)" 
                  strokeWidth="2.5" 
                  className="glowing-dashed-line"
                />
                <defs>
                  <linearGradient id="line-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="w-16 h-16 bg-slate-950 border border-slate-800 group-hover:border-emerald-500/40 rounded-2xl flex items-center justify-center text-2xl shadow-lg relative z-10 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 rounded-2xl transition-colors" />
                    {step.icon}
                  </motion.div>
                  
                  <h3 className="text-white font-extrabold text-base mt-4 mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                    {isAr ? step.titleAr : step.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-[240px]">
                    {isAr ? step.descAr : step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="p-8 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/60 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center md:flex justify-between items-center gap-8 mb-8 pb-6 border-b border-slate-800/60">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                  ⚙️ {isAr ? "البيئة والتقنيات المستخدمة" : "Modern Botanical Tech Stack"}
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  {isAr ? "تم بناء المنصة باستخدام أحدث تقنيات المعالجة السحابية الفورية للأداء العالي." : "Built using professional edge-technologies for maximum performance."}
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20 inline-block mt-4 md:mt-0">
                {isAr ? "إصدار v1.0.0 مستقر" : "v1.0.0 Stable Build"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {techStack.map((tech, idx) => (
                <TechCard 
                  key={idx}
                  name={tech.name}
                  desc={tech.desc}
                  icon={tech.icon}
                  tooltip={isAr ? tech.tooltipAr : tech.tooltip}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 justify-center">
              <Users className="w-6 h-6 text-emerald-400" /> 
              {isAr ? "فريق عمل سنبلة الهندسي" : "Botanical Engineering Team"}
            </h2>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm">
              {isAr ? "المهندسون المسؤولون عن تدريب نماذج الرؤية الحاسوبية وتطوير واجهات المحاصيل." : "The engineers behind the AI diagnostics model and Egyptian crops platform."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {developers.map((dev, idx) => (
              <DeveloperCard
                key={idx}
                name={dev.name}
                role={isAr ? dev.roleAr : dev.role}
                avatar={dev.avatar}
                bio={isAr ? dev.bioAr : dev.bio}
                githubUrl={dev.githubUrl}
                linkedinUrl={dev.linkedinUrl}
              />
            ))}
          </div>
        </div>

        <div className="p-8 bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-emerald-950/40 backdrop-blur-md rounded-3xl border border-emerald-500/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {isAr ? "هل لديك أي استفسار أو ترغب بالتعاون؟" : "Have questions or want to collaborate?"}
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {isAr 
              ? "يسعدنا دائماً استقبال استفساراتك حول المنظومة الزراعية، الدعم الفني، أو إتاحة أبحاث الآفات المشتركة."
              : "Reach out to our agricultural technical support or botanical research desk. We'd love to hear from you."
            }
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center relative z-10">
            <a 
              href="mailto:support@sonbula.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/10 hover:scale-102 active:scale-98 transition-all text-sm gap-2"
            >
              <Mail className="w-4 h-4" />
              {isAr ? "راسلنا بالبريد" : "Email Support Desk"}
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl hover:scale-102 active:scale-98 transition-all text-sm gap-2 border border-slate-700"
            >
              <GithubIcon className="w-4 h-4" />
              {isAr ? "مستودع الكود (GitHub)" : "GitHub Repository"}
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
