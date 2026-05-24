"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  Leaf,
  Zap,
  Brain,
  HelpCircle,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Category = "All" | "Accuracy" | "Plants" | "Security" | "Usage" | "Technology";

interface FAQItem {
  id: number;
  category: Exclude<Category, "All">;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    category: "Accuracy",
    question: "How accurate is the AI diagnosis?",
    answer:
      "Our AI model achieves 99%+ accuracy on common plant diseases, trained on over 1.2 million plant images from diverse agricultural environments across Egypt and the Middle East.",
  },
  {
    id: 2,
    category: "Accuracy",
    question: "What image quality does the AI need?",
    answer:
      "For best results, upload clear, well-lit photos focusing on the affected leaf or stem. Blurry or dark images may reduce accuracy, though our system handles moderate variations well.",
  },
  {
    id: 3,
    category: "Plants",
    question: "Does the AI support indoor plants?",
    answer:
      "Yes! Sanbola supports both outdoor crops and indoor ornamental plants. Our database covers over 200 plant species including popular houseplants like pothos, ficus, and succulents.",
  },
  {
    id: 4,
    category: "Plants",
    question: "Can I use Sanbola for beginner plant care?",
    answer:
      "Absolutely. Sanbola is designed to be beginner-friendly with clear, actionable guidance. The AI explains results in simple language with step-by-step treatment plans.",
  },
  {
    id: 5,
    category: "Plants",
    question: "Does it work for all plant types?",
    answer:
      "We cover most common crops (tomatoes, wheat, corn, potatoes), fruit trees, herbs, and ornamental plants. We continuously expand our database based on user demand.",
  },
  {
    id: 6,
    category: "Plants",
    question: "Can the AI detect multiple diseases in one image?",
    answer:
      "Yes. Our multi-label detection system can identify up to 3 simultaneous conditions in a single plant image, ranked by confidence level.",
  },
  {
    id: 7,
    category: "Usage",
    question: "How does the AI analyze plant diseases?",
    answer:
      "Our convolutional neural network (CNN) analyzes visual patterns in leaf textures, color variations, and spot morphology. It compares against a trained dataset of 50+ disease signatures to provide instant diagnosis.",
  },
  {
    id: 8,
    category: "Usage",
    question: "How do I get started with Sanbola?",
    answer:
      "Simply create a free account, navigate to the analysis tool, upload a clear photo of your plant, and receive your AI diagnosis within seconds. No special equipment needed.",
  },
  {
    id: 9,
    category: "Usage",
    question: "Can I track my plant's health history?",
    answer:
      "Yes. Your diagnosis history is saved in your profile, allowing you to monitor disease progression, track treatment effectiveness, and receive personalized care recommendations over time.",
  },
  {
    id: 10,
    category: "Security",
    question: "Is my uploaded data secure?",
    answer:
      "All images are encrypted using AES-256 during upload and processing. We never sell or share your plant data with third parties. Images are automatically deleted from our servers after 30 days unless you choose to save them.",
  },
  {
    id: 11,
    category: "Security",
    question: "Do you store my personal information?",
    answer:
      "We only store the minimum data needed (email and username). All plant images are processed ephemerally and are not linked to your identity unless you explicitly save them to your profile.",
  },
  {
    id: 12,
    category: "Technology",
    question: "What AI technology powers Sanbola?",
    answer:
      "Sanbola uses custom-trained Convolutional Neural Networks (CNNs) built with PyTorch, hosted on GPU-accelerated cloud infrastructure. The frontend communicates with the AI via our Gradio API pipeline.",
  },
  {
    id: 13,
    category: "Technology",
    question: "How fast is the analysis?",
    answer:
      "Most analyses complete in under 2 seconds. Our edge-optimized pipeline ensures minimal latency regardless of your internet connection speed.",
  },
  {
    id: 14,
    category: "Technology",
    question: "Can I use Sanbola offline?",
    answer:
      "Currently, Sanbola requires an internet connection for AI analysis. We are working on a lightweight offline mode for basic plant identification in areas with poor connectivity.",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Accuracy",
  "Plants",
  "Security",
  "Usage",
  "Technology",
];

const categoryIcon = (cat: Exclude<Category, "All">, size = 16) => {
  switch (cat) {
    case "Accuracy":
      return <Brain size={size} />;
    case "Plants":
      return <Leaf size={size} />;
    case "Security":
      return <Shield size={size} />;
    case "Usage":
      return <Zap size={size} />;
    case "Technology":
      return <HelpCircle size={size} />;
    default:
      return <HelpCircle size={size} />;
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
} as const;

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Navbar />

      <section className="relative pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-[40vw] max-w-[600px] h-[40vw] max-h-[600px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35vw] max-w-[500px] h-[35vw] max-h-[500px] bg-emerald-700/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 mb-6"
          >
            <span>✦ Got Questions?</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4"
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mx-auto mb-10"
          >
            Everything you need to know about the Sanbola AI plant intelligence
            platform — from diagnosis accuracy to data privacy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <motion.input
              whileFocus={{ boxShadow: "0 0 0 2px rgba(34,197,94,0.35)" }}
              type="text"
              placeholder="Search questions…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenId(null);
              }}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all duration-200 text-sm"
            />
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenId(null);
                  }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-slate-900/40 border-slate-700/50 text-slate-400 hover:border-slate-600/60 hover:text-slate-300"
                  }`}
                >
                  {cat !== "All" && (
                    <span className={isActive ? "text-emerald-400" : "text-slate-500"}>
                      {categoryIcon(cat as Exclude<Category, "All">, 13)}
                    </span>
                  )}
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center">
                <Leaf size={28} className="text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg font-medium">
                No questions match your search
              </p>
              <p className="text-slate-600 text-sm max-w-xs">
                Try a different keyword or browse all categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-2 text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 rounded-full hover:bg-emerald-500/20 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              {filteredFAQs.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <motion.li key={item.id} variants={itemVariants} whileHover={{ y: -2 }}>
                    <div
                      className={`p-5 bg-slate-900/30 backdrop-blur-md rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                        isOpen
                          ? "border-emerald-500/30"
                          : "border-slate-800/60 hover:border-slate-700/60"
                      }`}
                      onClick={() => toggle(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center ${
                            isOpen
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-800/60 text-slate-500"
                          } transition-colors duration-200`}
                        >
                          {categoryIcon(item.category, 15)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug pr-6">
                            {item.question}
                          </p>
                          <span className="inline-block mt-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {item.category}
                          </span>
                        </div>

                        <div
                          className={`flex-shrink-0 mt-0.5 transition-colors duration-200 ${
                            isOpen ? "text-emerald-400" : "text-slate-500"
                          }`}
                        >
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 ml-0 sm:ml-11 pr-2 sm:pr-6">
                              <div className="h-px bg-slate-800/60 mb-4" />
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden p-6 sm:p-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/60 via-emerald-950/30 to-slate-900/60 backdrop-blur-md text-center"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-700/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 mb-5">
                <HelpCircle size={26} className="text-emerald-400" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Still have questions?
              </h2>
              <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
                Contact our plant AI support team — we're here to help you get
                the most out of Sanbola.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors duration-200"
                >
                  <Leaf size={16} />
                  Analyze a Plant
                </Link>
                <Link
                  href="/assistant"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/60 text-slate-100 font-semibold text-sm transition-colors duration-200"
                >
                  <Brain size={16} />
                  Ask AI Assistant
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Leaf size={14} className="text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-slate-200">Sanbola</span>
          </div>

          <p className="text-xs text-slate-600 text-center">
            © {new Date().getFullYear()} Sanbola AI. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <Lock size={11} />
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <Shield size={11} />
              Terms
            </Link>
            <Link
              href="/faq"
              className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <HelpCircle size={11} />
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
