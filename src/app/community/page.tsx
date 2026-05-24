"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Star,
  Users,
  Leaf,
  Plus,
  Search,
  Filter,
  Bell,
  CheckCircle,
  Crown,
  Flame,
  ThumbsUp,
  Send,
} from "lucide-react";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: number;
  user: string;
  avatar: string;
  badge: string;
  badgeColor: string;
  time: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  featured?: boolean;
  trending?: boolean;
  aiAssisted?: boolean;
  imageEmoji?: string;
  imageGradient?: string;
  commentsData?: { user: string; avatar: string; text: string }[];
}

// ─── Shimmer CSS ─────────────────────────────────────────────────────────────

const ShimmerStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
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
        animation: gradient-shimmer 5s linear infinite;
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin-slow { animation: spin-slow 1s linear infinite; }
    `
  }} />
);

// ─── Badge Component ──────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  const colorMap: Record<string, string> = {
    expert: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    leader: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    verified: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    newcomer: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorMap[color] ?? "text-slate-400 bg-slate-500/10 border-slate-500/20"}`}>
      {label}
    </span>
  );
}

// ─── Progress Bar Component ───────────────────────────────────────────────────

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
      />
    </div>
  );
}

// ─── Post Card Component ──────────────────────────────────────────────────────

function PostCard({
  post,
  liked,
  bookmarked,
  onLike,
  onBookmark,
}: {
  post: Post;
  liked: boolean;
  bookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-slate-900/40 backdrop-blur-md rounded-2xl border p-5 transition-all duration-300 ${
        post.featured
          ? "border-emerald-500/40 shadow-lg shadow-emerald-500/5"
          : "border-slate-800/60 hover:border-slate-700/80"
      }`}
    >
      {/* Featured glow */}
      {post.featured && (
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/3 pointer-events-none" />
      )}

      {/* Trending / Featured labels */}
      <div className="flex items-center gap-2 mb-3">
        {post.trending && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3" /> Trending
          </span>
        )}
        {post.featured && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3" /> Featured
          </span>
        )}
        {post.aiAssisted && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> AI Diagnosed
          </span>
        )}
      </div>

      {/* User row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl border border-slate-700/60 shrink-0">
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{post.user}</span>
            <Badge label={post.badge} color={post.badgeColor} />
          </div>
          <span className="text-xs text-slate-500">{post.time}</span>
        </div>
        <button className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>

      {/* Image placeholder */}
      {post.imageEmoji && (
        <div
          className={`w-full h-36 rounded-xl flex items-center justify-center text-5xl mb-3 ${post.imageGradient ?? "bg-slate-800/60"} border border-slate-700/40`}
        >
          {post.imageEmoji}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-1 pt-3 border-t border-slate-800/60">
        {/* Like */}
        <motion.button
          whileTap={{ scale: 1.35 }}
          onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            liked
              ? "text-red-400 bg-red-500/10"
              : "text-slate-400 hover:text-red-400 hover:bg-red-500/5"
          }`}
        >
          <Heart className={`w-4 h-4 transition-all ${liked ? "fill-red-400 stroke-red-400 scale-110" : ""}`} />
          {liked ? post.likes + 1 : post.likes}
        </motion.button>

        {/* Comments */}
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          {post.comments}
        </button>

        {/* Bookmark */}
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={onBookmark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            bookmarked
              ? "text-amber-400 bg-amber-500/10"
              : "text-slate-400 hover:text-amber-400 hover:bg-amber-500/5"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-amber-400 stroke-amber-400" : ""}`} />
          {bookmarked ? post.bookmarks + 1 : post.bookmarks}
        </motion.button>

        {/* Share */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-blue-400 hover:bg-blue-500/5 transition-all ml-auto">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-3">
              {(post.commentsData ?? [
                { user: "PlantFan_Ali", avatar: "🌳", text: "Amazing tip! I'll try this on my roses too." },
                { user: "GreenThumb_Nora", avatar: "🌸", text: "Thanks for sharing! How long did it take to see results?" },
                { user: "FarmBot_Hassan", avatar: "🤖", text: "Sanbola's AI is really accurate. Saved my pepper crop last season!" },
              ]).map((c, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-sm shrink-0 border border-slate-700/50">
                    {c.avatar}
                  </div>
                  <div className="flex-1 bg-slate-950/40 rounded-xl px-3 py-2">
                    <span className="text-xs font-semibold text-emerald-400">{c.user} </span>
                    <span className="text-xs text-slate-300">{c.text}</span>
                  </div>
                </div>
              ))}

              {/* Reply input */}
              <div className="flex gap-2 mt-2">
                <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex-1 flex items-center bg-slate-950/50 rounded-xl border border-slate-700/40 px-3 py-1.5 gap-2">
                  <input
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none"
                  />
                  <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page Data ────────────────────────────────────────────────────────────────

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    user: "GardenGuru_Ahmed",
    avatar: "🌱",
    badge: "Expert",
    badgeColor: "expert",
    time: "2 hours ago",
    content:
      "Finally defeated the spider mite infestation on my roses! 🌹 Used neem oil spray every 3 days for 2 weeks. The Sanbola AI diagnosis was spot-on! Sharing my full treatment log so the community can benefit from this approach.",
    tags: ["#SpiderMites", "#RoseCare", "#AIdiagnosis"],
    likes: 234,
    comments: 45,
    bookmarks: 12,
    aiAssisted: true,
    imageEmoji: "🌹",
    imageGradient: "bg-gradient-to-br from-rose-950/60 to-pink-950/60",
    commentsData: [
      { user: "RoseLover_Dina", avatar: "🌸", text: "This saved my garden! Neem oil works wonders." },
      { user: "PestPro_Yusuf", avatar: "🔬", text: "Perfect timing on the spray schedule. 3 days is optimal." },
      { user: "GardenHelper_Rana", avatar: "🌿", text: "Did you dilute it? What ratio did you use?" },
    ],
  },
  {
    id: 2,
    user: "PlantMom_Sara",
    avatar: "🌺",
    badge: "Community Leader",
    badgeColor: "leader",
    time: "5 hours ago",
    content:
      "Does anyone know why my tomato leaves are turning yellow from the bottom? I've been watering every 2 days 🍅 Uploaded to Sanbola and it suggested a possible nitrogen deficiency — anyone had this before? Any organic solutions?",
    tags: ["#Tomatoes", "#YellowLeaves", "#Help"],
    likes: 89,
    comments: 31,
    bookmarks: 5,
    aiAssisted: true,
    commentsData: [
      { user: "OrganicFarm_Fatima", avatar: "🌾", text: "Nitrogen deficiency! Add compost tea every 2 weeks." },
      { user: "GardenGuru_Ahmed", avatar: "🌱", text: "Also check if you're overwatering — yellowing can be both!" },
      { user: "TomatoKing_Basem", avatar: "🍅", text: "Fish emulsion fertilizer worked for me. Try it!" },
      { user: "SoilSage_Laila", avatar: "🌍", text: "Add blood meal to the soil for a quick nitrogen boost." },
      { user: "PlantDoc_Amr", avatar: "🩺", text: "Sanbola diagnosis is accurate. Nitrogen is the culprit here." },
      { user: "GreenThumb_Nora", avatar: "🌸", text: "Coffee grounds also help as a slow-release nitrogen source." },
      { user: "HydroHero_Karim", avatar: "💧", text: "Make sure the pH is between 6.0-6.8 for nutrient uptake." },
      { user: "BalconyFarm_Yara", avatar: "🪴", text: "I had the same issue! Compost fixed it in 2 weeks." },
    ],
  },
  {
    id: 3,
    user: "UrbanFarmer_Khalid",
    avatar: "🥬",
    badge: "Verified",
    badgeColor: "verified",
    time: "1 day ago",
    content:
      "My rooftop garden in Cairo survived the 40°C heat wave! 🔥 Secret weapon: shade cloth + early morning watering at 5am + heavy mulching. Here's my complete heat survival setup — 24 different crops made it through!",
    tags: ["#HeatWave", "#UrbanGardening", "#Cairo"],
    likes: 445,
    comments: 67,
    bookmarks: 89,
    featured: true,
    imageEmoji: "🏙️",
    imageGradient: "bg-gradient-to-br from-orange-950/50 to-amber-950/50",
    commentsData: [
      { user: "HeatSurvivor_Dalia", avatar: "☀️", text: "The shade cloth trick is a game changer in Egyptian summer!" },
      { user: "RooftopFarmer_Tarek", avatar: "🌇", text: "What percentage shade cloth did you use? 30% or 50%?" },
      { user: "CairoGarden_Noha", avatar: "🏙️", text: "5am watering is the real secret. Plants absorb it before heat sets in." },
    ],
  },
  {
    id: 4,
    user: "SeedlingStarter",
    avatar: "🌻",
    badge: "Newcomer",
    badgeColor: "newcomer",
    time: "2 days ago",
    content:
      "First time growing sunflowers! 🌻 3 weeks in and they're already 30cm tall — so exciting! Using Sanbola to monitor for any diseases. So far so good! Any tips from experienced growers on how to get the biggest blooms?",
    tags: ["#Sunflowers", "#Beginner", "#GrowthUpdate"],
    likes: 156,
    comments: 23,
    bookmarks: 8,
    commentsData: [
      { user: "SunflowerPro_Maya", avatar: "🌼", text: "Make sure they get 6+ hours of direct sun daily!" },
      { user: "GardenGuru_Ahmed", avatar: "🌱", text: "Welcome to the community! Water deeply but infrequently." },
      { user: "SeedSaver_Hana", avatar: "🌾", text: "Add a balanced fertilizer once they're 50cm. Huge difference!" },
    ],
  },
  {
    id: 5,
    user: "OrganicFarm_Fatima",
    avatar: "🌾",
    badge: "Expert",
    badgeColor: "expert",
    time: "3 days ago",
    content:
      "Organic pest control that actually works in the Egyptian climate: 1️⃣ Neem oil spray (weekly) 2️⃣ Garlic water spray (bi-weekly) 3️⃣ Companion planting — basil near tomatoes 4️⃣ Hand-picking at dawn when pests are slow. No chemicals needed! 🌿",
    tags: ["#OrganicFarming", "#PestControl", "#Egypt"],
    likes: 678,
    comments: 134,
    bookmarks: 234,
    trending: true,
    commentsData: [
      { user: "ChemFree_Salwa", avatar: "💚", text: "Garlic spray is underrated! Works on aphids amazingly well." },
      { user: "CompanionPlanter_Adel", avatar: "🌿", text: "Basil and tomatoes is a perfect pair. Also try marigolds!" },
      { user: "OrganicOnly_Reem", avatar: "🌱", text: "Thank you! Sharing this with my farming group right now." },
    ],
  },
  {
    id: 6,
    user: "HerbGarden_Mona",
    avatar: "🌿",
    badge: "Community Leader",
    badgeColor: "leader",
    time: "4 days ago",
    content:
      "Herb garden update 🌿 Mint, basil, parsley, and coriander are all thriving in pots on my balcony! Pro tips: keep the mint separate (it's invasive!), water basil from the bottom to prevent fungal issues, and always harvest in the morning for the best flavor and essential oils.",
    tags: ["#HerbGarden", "#BalconyGarden", "#Herbs"],
    likes: 312,
    comments: 56,
    bookmarks: 78,
    commentsData: [
      { user: "HerbLover_Dalia", avatar: "🫚", text: "The mint tip saved my garden — it tried to take over everything!" },
      { user: "ChefGardener_Wael", avatar: "👨‍🍳", text: "Morning harvest is SO true. Night-harvested herbs have less flavor." },
      { user: "BalconyFarmer_Ghada", avatar: "🪴", text: "What pot size do you use for mint? Does it matter?" },
    ],
  },
];

const TRENDING_TOPICS = [
  { tag: "#HeatStress", count: "234 posts" },
  { tag: "#OrganicPestControl", count: "189 posts" },
  { tag: "#RootRot", count: "145 posts" },
  { tag: "#Tomatoes", count: "432 posts" },
  { tag: "#WateringTips", count: "98 posts" },
  { tag: "#AIdiagnosis", count: "567 posts" },
];

const TOP_CONTRIBUTORS = [
  { user: "GardenGuru_Ahmed", avatar: "🌱", stat: "1,234 helpful answers", badge: "Expert", badgeColor: "expert", icon: <Crown className="w-3 h-3 text-amber-400" /> },
  { user: "OrganicFarm_Fatima", avatar: "🌾", stat: "987 posts", badge: "Expert", badgeColor: "expert", icon: <Award className="w-3 h-3 text-emerald-400" /> },
  { user: "PlantMom_Sara", avatar: "🌺", stat: "756 helpful", badge: "Community Leader", badgeColor: "leader", icon: <Star className="w-3 h-3 text-purple-400" /> },
  { user: "UrbanFarmer_Khalid", avatar: "🥬", stat: "543 posts", badge: "Verified", badgeColor: "verified", icon: <CheckCircle className="w-3 h-3 text-blue-400" /> },
  { user: "HerbGarden_Mona", avatar: "🌿", stat: "432 posts", badge: "Community Leader", badgeColor: "leader", icon: <ThumbsUp className="w-3 h-3 text-purple-400" /> },
];

const ACHIEVEMENTS = [
  { emoji: "🌱", title: "Plant Doctor", desc: "Help 10 community members", current: 7, max: 10 },
  { emoji: "🔬", title: "Disease Detective", desc: "Report 5 diseases", current: 3, max: 5 },
  { emoji: "🌿", title: "Green Thumb", desc: "Share 20 plant updates", current: 12, max: 20 },
];

const TABS = ["Trending", "Recent", "Following", "Saved"];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("Trending");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [followedMembers, setFollowedMembers] = useState<Set<number>>(new Set());
  const [loadingMore, setLoadingMore] = useState(false);
  const [postCount, setPostCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFollow = (idx: number) => {
    setFollowedMembers((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setPostCount((p) => p + 3);
      setLoadingMore(false);
    }, 1500);
  };

  const visiblePosts = INITIAL_POSTS.slice(0, postCount);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <ShimmerStyles />

      {/* Ambient gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-10">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 mb-5"
          >
            <span>🌿</span> Plant Lovers Community
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight mb-4"
          >
            Grow Together{" "}
            <span className="shimmer-text">Share &amp; Learn</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8"
          >
            Join thousands of plant enthusiasts sharing knowledge, diagnoses, and success stories
          </motion.p>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8"
          >
            {[
              { icon: <Users className="w-4 h-4" />, value: "12,400+", label: "Members" },
              { icon: <Leaf className="w-4 h-4" />, value: "3,200+", label: "Posts" },
              { icon: <ThumbsUp className="w-4 h-4" />, value: "98%", label: "Helpful Responses" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-emerald-400">{stat.icon}</span>
                <span className="font-bold text-white">{stat.value}</span>
                <span className="text-slate-400">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── SEARCH BAR ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-2 mb-8"
        >
          <div className="flex-1 flex items-center bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-xl px-4 py-2.5 gap-3">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, topics, or members..."
              className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setComposeOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
          </motion.button>
        </motion.div>

        {/* ── MAIN LAYOUT ──────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT: MAIN FEED (2/3) ────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Category Tabs */}
            <div className="flex gap-1 bg-slate-900/30 backdrop-blur-md rounded-xl border border-slate-800/60 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "text-white bg-slate-800/80"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-400 rounded-full"
                    />
                  )}
                  {tab === "Trending" && <Flame className="w-3.5 h-3.5 inline mr-1 text-orange-400" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Compose Card */}
            <div className="p-4 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Leaf className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <button
                  onClick={() => setComposeOpen((v) => !v)}
                  className="flex-1 text-left text-sm text-slate-500 bg-slate-950/40 rounded-xl px-4 py-2.5 border border-slate-800/40 hover:border-slate-700/60 hover:text-slate-400 transition-all"
                >
                  What's happening in your garden?
                </button>
              </div>

              <AnimatePresence>
                {composeOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-3">
                      <textarea
                        value={composeText}
                        onChange={(e) => setComposeText(e.target.value)}
                        placeholder="Share your plant journey, ask questions, or post a success story..."
                        className="w-full bg-slate-950/50 rounded-xl border border-slate-700/50 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-emerald-500/40 transition-colors"
                        rows={4}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-emerald-400 bg-slate-800/60 rounded-lg transition-colors">
                            📷 Photo
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-emerald-400 bg-slate-800/60 rounded-lg transition-colors">
                            <Leaf className="w-3.5 h-3.5" /> Tag Plant
                          </button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => { setComposeOpen(false); setComposeText(""); }}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all"
                        >
                          <Send className="w-3.5 h-3.5" /> Post
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Posts Feed */}
            <AnimatePresence mode="popLayout">
              {visiblePosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <PostCard
                    post={post}
                    liked={likedPosts.has(post.id)}
                    bookmarked={bookmarkedPosts.has(post.id)}
                    onLike={() => toggleLike(post.id)}
                    onBookmark={() => toggleBookmark(post.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/30 rounded-xl text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-all disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full spin-slow" />
                    Loading posts...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Load More Posts
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* ── RIGHT: SIDEBAR (1/3) ─────────────────────────────────── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60"
            >
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                🔥 Trending This Week
              </h3>
              <div className="space-y-2.5">
                {TRENDING_TOPICS.map((t, i) => (
                  <motion.button
                    key={t.tag}
                    whileHover={{ x: 3 }}
                    className="w-full flex items-center justify-between group"
                  >
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors font-medium">
                      {t.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{t.count}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60"
            >
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                ⭐ Top Contributors
              </h3>
              <div className="space-y-3">
                {TOP_CONTRIBUTORS.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-lg border border-slate-700/60 shrink-0">
                        {member.avatar}
                      </div>
                      {i === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                          <Crown className="w-2.5 h-2.5 text-amber-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white truncate">{member.user}</span>
                        <span className="shrink-0">{member.icon}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{member.stat}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => toggleFollow(i)}
                      className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        followedMembers.has(i)
                          ? "text-slate-400 bg-slate-800/60 border-slate-700/60"
                          : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                      }`}
                    >
                      {followedMembers.has(i) ? "Following" : "Follow"}
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Community Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="p-5 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60"
            >
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                🏆 Community Milestones
              </h3>
              <div className="space-y-4">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{a.emoji}</span>
                        <div>
                          <div className="text-xs font-semibold text-white">{a.title}</div>
                          <div className="text-[10px] text-slate-500">{a.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {a.current}/{a.max}
                      </span>
                    </div>
                    <ProgressBar value={a.current} max={a.max} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60"
            >
              <h3 className="text-sm font-bold text-white mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "🔬 Analyze a Plant", href: "/auth" },
                  { label: "📖 Plant Care Guide", href: "/care-guide" },
                  { label: "🦠 Disease Database", href: "/diseases" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between w-full px-3 py-2.5 bg-slate-950/40 rounded-xl border border-slate-800/40 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-all group"
                  >
                    {link.label}
                    <span className="text-slate-600 group-hover:text-emerald-500 transition-colors">→</span>
                  </a>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-white text-sm">Sonbula</span>
              <span className="text-slate-600 text-xs">/ سنبلة</span>
            </div>
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} Sonbula Plant AI Community — Grow Together.
            </p>
            <div className="flex gap-4 text-xs text-slate-500">
              <a href="/about" className="hover:text-emerald-400 transition-colors">About</a>
              <a href="/auth" className="hover:text-emerald-400 transition-colors">Sign In</a>
              <a href="/community" className="hover:text-emerald-400 transition-colors">Community</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
