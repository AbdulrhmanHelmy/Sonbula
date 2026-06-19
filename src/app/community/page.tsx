"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  Star,
  Users,
  Leaf,
  Plus,
  Search,
  Filter,
  Crown,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Send,
  ImagePlus,
  X,
  Loader2,
  AlertCircle,
  Stethoscope,
  LogIn,
  MapPin,
  Sparkles,
  Camera,
  ChevronUp,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostAuthor {
  _id: string;
  username: string;
  role: "USER" | "DOCTOR";
  governorate?: string;
}

interface Post {
  _id: string;
  author: PostAuthor;
  content: string;
  media: string | null;
  upvotes: string[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  post: string;
  author: PostAuthor;
  content: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── UI Translations ─────────────────────────────────────────────────────────

const UI = {
  en: {
    badge: "🌿 Plant Lovers Community",
    heroTitle1: "Grow Together,",
    heroTitle2: "Share & Learn",
    heroSub:
      "Join thousands of plant enthusiasts sharing knowledge, diagnoses, and success stories",
    statMembers: "Members",
    statPosts: "Posts",
    statHelpful: "Helpful",
    searchPlaceholder: "Search posts, topics, or members...",
    filter: "Filter",
    newPost: "New Post",
    tabs: ["🔥 Trending", "🕐 Recent", "👥 Following", "📌 Saved"],
    composePrompt: "What's happening in your garden? 🌱",
    composePlaceholder:
      "Share your plant journey, ask questions, or post a success story...",
    photo: "Photo",
    tagPlant: "Tag Plant",
    post: "Post",
    posting: "Posting...",
    loadMore: "Load More Posts",
    loading: "Loading posts...",
    trendingTitle: "Trending This Week",
    topContributors: "Top Contributors",
    milestones: "Your Milestones",
    quickLinks: "Quick Links",
    follow: "Follow",
    following: "Following",
    replyPlaceholder: "Write a reply...",
    share: "Share",
    doctor: "Doctor",
    noComments: "No comments yet. Be the first to reply!",
    loadingComments: "Loading comments...",
    noPosts: "No posts yet. Be the first to share something!",
    noPostsSub: "Start a conversation about your plants — the community is waiting!",
    loadingPosts: "Loading community posts...",
    loginRequired: "Join Our Garden Community",
    loginBtn: "Sign In to Join",
    loginSub: "Sign in to create posts, share your garden stories, and interact with fellow plant lovers.",
    errorLoad: "Couldn't load posts right now.",
    errorSub: "Check your connection and try again.",
    retry: "Try Again",
    justNow: "just now",
    minuteAgo: "1m ago",
    minutesAgo: "m ago",
    hourAgo: "1h ago",
    hoursAgo: "h ago",
    dayAgo: "1d ago",
    daysAgo: "d ago",
    noTrending: "Add #hashtags in your posts to see trends!",
    quickLinksItems: [
      { label: "🔬 Analyze a Plant", href: "/assistant" },
      { label: "📖 Plant Care Guide", href: "/care-guide" },
      { label: "🦠 Disease Database", href: "/diseases" },
    ],
    footerTagline: `© ${new Date().getFullYear()} Sonbula Plant AI Community — Grow Together.`,
    footerLinks: [
      { label: "About", href: "/about" },
      { label: "Sign In", href: "/auth" },
      { label: "Community", href: "/community" },
    ],
  },
  ar: {
    badge: "🌿 مجتمع عشاق النباتات",
    heroTitle1: "انمُ معاً،",
    heroTitle2: "شارك وتعلّم",
    heroSub: "انضم لآلاف عشاق النباتات يتشاركون المعرفة والتشخيصات وقصص النجاح",
    statMembers: "عضو",
    statPosts: "منشور",
    statHelpful: "مفيد",
    searchPlaceholder: "ابحث في المنشورات أو المواضيع أو الأعضاء...",
    filter: "تصفية",
    newPost: "منشور جديد",
    tabs: ["🔥 الأكثر تداولاً", "🕐 الأحدث", "👥 المتابَعون", "📌 المحفوظات"],
    composePrompt: "ماذا يحدث في حديقتك؟ 🌱",
    composePlaceholder:
      "شارك رحلتك مع النباتات، اطرح أسئلة، أو انشر قصة نجاح...",
    photo: "صورة",
    tagPlant: "تصنيف نبات",
    post: "نشر",
    posting: "جارٍ النشر...",
    loadMore: "تحميل المزيد",
    loading: "جارٍ التحميل...",
    trendingTitle: "الأكثر تداولاً هذا الأسبوع",
    topContributors: "أبرز المساهمين",
    milestones: "إنجازاتك",
    quickLinks: "روابط سريعة",
    follow: "متابعة",
    following: "تتابع",
    replyPlaceholder: "اكتب رداً...",
    share: "مشاركة",
    doctor: "طبيب",
    noComments: "لا توجد تعليقات بعد. كن أول من يرد!",
    loadingComments: "جارٍ تحميل التعليقات...",
    noPosts: "لا توجد منشورات بعد. كن أول من يشارك!",
    noPostsSub: "ابدأ محادثة عن نباتاتك — المجتمع ينتظرك!",
    loadingPosts: "جارٍ تحميل منشورات المجتمع...",
    loginRequired: "انضم إلى مجتمع الحديقة",
    loginBtn: "سجّل دخولك للانضمام",
    loginSub: "سجّل دخولك لإنشاء منشورات ومشاركة قصص حديقتك والتفاعل مع محبي النباتات.",
    errorLoad: "تعذّر تحميل المنشورات حالياً.",
    errorSub: "تحقق من اتصالك وحاول مرة أخرى.",
    retry: "إعادة المحاولة",
    justNow: "الآن",
    minuteAgo: "منذ دقيقة",
    minutesAgo: "د",
    hourAgo: "منذ ساعة",
    hoursAgo: "س",
    dayAgo: "منذ يوم",
    daysAgo: "ي",
    noTrending: "أضف #هاشتاقات في منشوراتك لرؤية الاتجاهات!",
    quickLinksItems: [
      { label: "🔬 تحليل نبات", href: "/assistant" },
      { label: "📖 دليل العناية بالنبات", href: "/care-guide" },
      { label: "🦠 قاعدة بيانات الأمراض", href: "/diseases" },
    ],
    footerTagline: `© ${new Date().getFullYear()} سنبلة — منصة الذكاء الاصطناعي للنباتات. انمُ معاً.`,
    footerLinks: [
      { label: "عن المنصة", href: "/about" },
      { label: "تسجيل الدخول", href: "/auth" },
      { label: "المجتمع", href: "/community" },
    ],
  },
};

// ─── Global Styles ────────────────────────────────────────────────────────────

const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
      @keyframes gradient-shimmer {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .shimmer-text {
        background: linear-gradient(90deg, #34d399, #6ee7b7, #a7f3d0, #34d399);
        background-size: 300% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient-shimmer 4s linear infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .float-anim { animation: float 3s ease-in-out infinite; }
      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      .pulse-ring::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: inherit;
        border: 2px solid currentColor;
        animation: pulse-ring 2s ease-out infinite;
      }
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
      }
      .skeleton-pulse { animation: skeleton-pulse 1.5s ease-in-out infinite; }
      .hero-overlay {
        background: linear-gradient(180deg, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.85) 50%, rgba(2,6,23,1) 100%);
      }
      .glass-card {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(148, 163, 184, 0.1);
      }
      .glass-card-light {
        background: rgba(30, 41, 59, 0.4);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(148, 163, 184, 0.08);
      }
      .gradient-border {
        border-image: linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6) 1;
      }
    `,
    }}
  />
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string, t: (typeof UI)["en"]): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return t.justNow;
  if (diffMin === 1) return t.minuteAgo;
  if (diffMin < 60) return `${diffMin}${t.minutesAgo}`;
  if (diffHr === 1) return t.hourAgo;
  if (diffHr < 24) return `${diffHr}${t.hoursAgo}`;
  if (diffDay === 1) return t.dayAgo;
  return `${diffDay}${t.daysAgo}`;
}

const AVATAR_GRADIENTS = [
  "from-emerald-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-teal-400 to-green-500",
  "from-fuchsia-400 to-pink-500",
  "from-lime-400 to-emerald-500",
];

function getAvatarGradient(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

function UserAvatar({ username, size = "md", isDoctor = false }: { username: string; size?: "sm" | "md" | "lg"; isDoctor?: boolean }) {
  const sizeClasses = { sm: "w-7 h-7 text-[10px]", md: "w-10 h-10 text-xs", lg: "w-12 h-12 text-sm" };
  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-br ${getAvatarGradient(username)} rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0`}>
        {getInitials(username)}
      </div>
      {isDoctor && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
          <Stethoscope className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = "emerald" }: { value: number; max: number; color?: string }) {
  const pct = Math.round((value / max) * 100);
  const completed = value >= max;
  const gradients: Record<string, string> = {
    emerald: "from-emerald-500 to-teal-400",
    amber: "from-amber-500 to-yellow-400",
    violet: "from-violet-500 to-purple-400",
    rose: "from-rose-500 to-pink-400",
  };
  return (
    <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full bg-gradient-to-r ${gradients[color] || gradients.emerald} rounded-full ${completed ? "shadow-lg shadow-emerald-500/30" : ""}`}
      />
    </div>
  );
}

// ─── Post Skeleton ────────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-700/50 rounded-xl skeleton-pulse" />
        <div className="flex-1 space-y-2">
          <div className="w-32 h-3.5 bg-slate-700/50 rounded-lg skeleton-pulse" />
          <div className="w-20 h-2.5 bg-slate-800/50 rounded-lg skeleton-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-700/50 rounded-lg skeleton-pulse" />
        <div className="w-4/5 h-3 bg-slate-700/50 rounded-lg skeleton-pulse" />
        <div className="w-2/3 h-3 bg-slate-800/50 rounded-lg skeleton-pulse" />
      </div>
      <div className="w-full h-44 bg-slate-700/30 rounded-xl skeleton-pulse" />
      <div className="flex gap-4 pt-3 border-t border-slate-800/40">
        <div className="w-20 h-8 bg-slate-700/40 rounded-xl skeleton-pulse" />
        <div className="w-20 h-8 bg-slate-700/40 rounded-xl skeleton-pulse" />
        <div className="w-20 h-8 bg-slate-700/40 rounded-xl skeleton-pulse ml-auto" />
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────

function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Full size" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Comment Item ─────────────────────────────────────────────────────────────

function CommentItem({
  comment, currentUserId, t, onVote,
}: {
  comment: Comment; currentUserId: string | null; t: (typeof UI)["en"];
  onVote: (commentId: string, voteType: "upvote" | "downvote") => void;
}) {
  const score = (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0);
  const hasUpvoted = currentUserId ? comment.upvotes?.includes(currentUserId) : false;
  const hasDownvoted = currentUserId ? comment.downvotes?.includes(currentUserId) : false;

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2.5 group">
      <UserAvatar username={comment.author?.username || "U"} size="sm" isDoctor={comment.author?.role === "DOCTOR"} />
      <div className="flex-1">
        <div className="bg-slate-800/40 rounded-xl px-3.5 py-2.5 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-white">{comment.author?.username || "User"}</span>
            {comment.author?.role === "DOCTOR" && (
              <span className="text-[9px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded-full">{t.doctor}</span>
            )}
            <span className="text-[10px] text-slate-600">{formatRelativeTime(comment.createdAt, t)}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
        </div>
        <div className="flex items-center gap-0.5 mt-1 px-1">
          <motion.button whileTap={{ scale: 1.3 }} onClick={() => onVote(comment._id, "upvote")}
            className={`p-1 rounded-md transition-all ${hasUpvoted ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 hover:text-emerald-400"}`}>
            <ThumbsUp className="w-3 h-3" />
          </motion.button>
          <span className={`text-[10px] font-bold min-w-[14px] text-center ${score > 0 ? "text-emerald-400" : score < 0 ? "text-red-400" : "text-slate-600"}`}>{score}</span>
          <motion.button whileTap={{ scale: 1.3 }} onClick={() => onVote(comment._id, "downvote")}
            className={`p-1 rounded-md transition-all ${hasDownvoted ? "text-red-400 bg-red-500/10" : "text-slate-600 hover:text-red-400"}`}>
            <ThumbsDown className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
  post, currentUserId, t, onUpvote,
}: {
  post: Post; currentUserId: string | null; t: (typeof UI)["en"];
  onUpvote: (postId: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const hasUpvoted = currentUserId ? post.upvotes?.includes(currentUserId) : false;
  const isDoctor = post.author?.role === "DOCTOR";

  const loadComments = useCallback(async () => {
    if (commentsLoaded) return;
    setLoadingComments(true);
    const res = await api.getPostComments(post._id);
    if (res.success && res.data) setComments(res.data);
    setCommentsLoaded(true);
    setLoadingComments(false);
  }, [post._id, commentsLoaded]);

  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) loadComments();
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || submittingComment) return;
    setSubmittingComment(true);
    const res = await api.addComment(post._id, commentInput.trim());
    if (res.success && res.data) {
      const user = api.getUser();
      setComments((prev) => [...prev, { ...res.data, author: { _id: user?._id || res.data.author, username: user?.username || "You", role: "USER" as const } }]);
      setCommentInput("");
    }
    setSubmittingComment(false);
  };

  const handleVoteComment = async (commentId: string, voteType: "upvote" | "downvote") => {
    if (!currentUserId) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;
        const up = [...(c.upvotes || [])], down = [...(c.downvotes || [])];
        const upIdx = up.indexOf(currentUserId); if (upIdx > -1) up.splice(upIdx, 1);
        const downIdx = down.indexOf(currentUserId); if (downIdx > -1) down.splice(downIdx, 1);
        if (voteType === "upvote") up.push(currentUserId); else down.push(currentUserId);
        return { ...c, upvotes: up, downvotes: down };
      })
    );
    await api.voteComment(commentId, voteType);
  };

  return (
    <>
      <motion.div
        layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
          isDoctor ? "hover:shadow-blue-500/10 ring-1 ring-blue-500/20" : "hover:shadow-emerald-500/5"
        }`}>

        {/* Doctor highlight bar */}
        {isDoctor && <div className="h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />}

        <div className="p-5">
          {/* Author header */}
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar username={post.author?.username || "U"} isDoctor={isDoctor} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{post.author?.username || "Unknown"}</span>
                {isDoctor && (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                    <Stethoscope className="w-2.5 h-2.5" /> {t.doctor}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{formatRelativeTime(post.createdAt, t)}</span>
                {post.author?.governorate && (
                  <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {post.author.governorate}</span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-slate-200 text-[14px] leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

          {/* Media */}
          {post.media && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setLightboxSrc(post.media)}
              className="relative w-full rounded-xl overflow-hidden mb-3 cursor-pointer group border border-slate-700/30">
              <img src={post.media} alt="Post media" className="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 pt-3 border-t border-slate-700/30">
            <motion.button whileTap={{ scale: 1.4 }} onClick={() => onUpvote(post._id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                hasUpvoted ? "text-rose-400 bg-rose-500/15" : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/5"
              }`}>
              <Heart className={`w-[18px] h-[18px] transition-all ${hasUpvoted ? "fill-rose-400 stroke-rose-400" : ""}`} />
              <span>{post.upvotes?.length || 0}</span>
            </motion.button>

            <button onClick={handleToggleComments}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                showComments ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5"
              }`}>
              <MessageCircle className="w-[18px] h-[18px]" />
              <span>{commentsLoaded ? comments.length : ""}</span>
            </button>

            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-sky-400 hover:bg-sky-500/5 transition-all ml-auto">
              <Share2 className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">{t.share}</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-700/30 bg-slate-900/30">
                {loadingComments ? (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-xs text-slate-500">{t.loadingComments}</span>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">{t.noComments}</p>
                ) : (
                  comments.map((c) => (
                    <CommentItem key={c._id} comment={c} currentUserId={currentUserId} t={t} onVote={handleVoteComment} />
                  ))
                )}
                {currentUserId && (
                  <div className="flex gap-2 mt-2">
                    <UserAvatar username={api.getUser()?.username || "Y"} size="sm" />
                    <div className="flex-1 flex items-center bg-slate-800/40 rounded-xl px-3 py-2 gap-2 focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all">
                      <input value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                        placeholder={t.replyPlaceholder} className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none" />
                      <motion.button whileTap={{ scale: 1.2 }} onClick={handleAddComment} disabled={!commentInput.trim() || submittingComment}
                        className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition-all p-1">
                        {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Achievement Definitions ──────────────────────────────────────────────────

const ACHIEVEMENT_DEFS = [
  { id: "first_post", emoji: "🌱", color: "emerald", title_en: "First Sprout", title_ar: "البرعم الأول", desc_en: "Create your first post", desc_ar: "أنشئ أول منشور لك", max: 1, compute: (p: number) => Math.min(p, 1) },
  { id: "active_poster", emoji: "🌿", color: "emerald", title_en: "Green Thumb", title_ar: "الإبهام الأخضر", desc_en: "Share 10 posts", desc_ar: "شارك ١٠ منشورات", max: 10, compute: (p: number) => Math.min(p, 10) },
  { id: "popular", emoji: "⭐", color: "amber", title_en: "Rising Star", title_ar: "نجم صاعد", desc_en: "Get 25 upvotes", desc_ar: "احصل على ٢٥ تأييد", max: 25, compute: (_p: number, u: number) => Math.min(u, 25) },
  { id: "prolific", emoji: "🏆", color: "violet", title_en: "Plant Expert", title_ar: "خبير النباتات", desc_en: "Create 25 posts", desc_ar: "أنشئ ٢٥ منشوراً", max: 25, compute: (p: number) => Math.min(p, 25) },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const { language } = useSettings();
  const isAr = language === "ar";
  const t = UI[isAr ? "ar" : "en"];

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeMedia, setComposeMedia] = useState<File | null>(null);
  const [composeMediaPreview, setComposeMediaPreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = api.isAuthenticated();
    setIsAuthenticated(auth);
    if (auth) setCurrentUserId(api.getUser()?._id || null);
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setErrorPosts(false);
    const res = await api.getPosts();
    if (res.success && res.data) setPosts(res.data);
    else setErrorPosts(true);
    setLoadingPosts(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchPosts();
    else setLoadingPosts(false);
  }, [isAuthenticated, fetchPosts]);

  const handleCreatePost = async () => {
    if (!composeText.trim() || isPosting) return;
    setIsPosting(true);
    const res = await api.createPost(composeText.trim(), composeMedia || undefined);
    if (res.success && res.data) {
      const user = api.getUser();
      setPosts((prev) => [{ ...res.data, author: { _id: user?._id || res.data.author, username: user?.username || "You", role: "USER" as const, governorate: user?.governorate }, upvotes: [] }, ...prev]);
      setComposeText(""); setComposeMedia(null); setComposeMediaPreview(null); setComposeOpen(false);
    }
    setIsPosting(false);
  };

  const handleUpvote = async (postId: string) => {
    if (!currentUserId) return;
    setPosts((prev) => prev.map((p) => {
      if (p._id !== postId) return p;
      const upvotes = [...(p.upvotes || [])];
      const idx = upvotes.indexOf(currentUserId);
      idx > -1 ? upvotes.splice(idx, 1) : upvotes.push(currentUserId);
      return { ...p, upvotes };
    }));
    await api.togglePostUpvote(postId);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComposeMedia(file);
      const reader = new FileReader();
      reader.onload = (ev) => setComposeMediaPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filteredPosts = searchQuery.trim()
    ? posts.filter((p) => p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.author?.username?.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts;

  // Dynamic sidebar data
  const trendingTopics = (() => {
    const tagCounts = new Map<string, number>();
    posts.forEach((p) => {
      const hashtags = p.content.match(/#[\w\u0600-\u06FF\u00c0-\u00ff]+/g);
      hashtags?.forEach((tag) => { const n = tag.toLowerCase(); tagCounts.set(n, (tagCounts.get(n) || 0) + 1); });
    });
    return Array.from(tagCounts.entries()).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  })();

  const topContributors = (() => {
    const m = new Map<string, { username: string; role: string; governorate?: string; postCount: number; totalUpvotes: number }>();
    posts.forEach((p) => {
      if (!p.author?._id) return;
      const e = m.get(p.author._id);
      const u = p.upvotes?.length || 0;
      if (e) { e.postCount++; e.totalUpvotes += u; }
      else m.set(p.author._id, { username: p.author.username, role: p.author.role, governorate: p.author.governorate, postCount: 1, totalUpvotes: u });
    });
    return Array.from(m.values()).map((a) => ({ ...a, score: a.postCount * 2 + a.totalUpvotes })).sort((a, b) => b.score - a.score).slice(0, 5);
  })();

  const achievements = (() => {
    if (!currentUserId) return [];
    const my = posts.filter((p) => p.author?._id === currentUserId);
    const pc = my.length, pu = my.reduce((s, p) => s + (p.upvotes?.length || 0), 0);
    return ACHIEVEMENT_DEFS.map((d) => ({ ...d, current: d.compute(pc, pu) }));
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden" dir={isAr ? "rtl" : "ltr"}>
      <GlobalStyles />
      <Navbar />

      {/* ═══ HERO WITH BACKGROUND IMAGE ═══ */}
      <div className="relative w-full h-[420px] sm:h-[480px] overflow-hidden -mt-[1px]">
        <Image src="/community-hero.png" alt="Community" fill className="object-cover" priority />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-4 z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/15 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/20 mb-5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" /> {t.badge}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-center mb-4 drop-shadow-2xl">
            {t.heroTitle1} <span className="shimmer-text">{t.heroTitle2}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto text-center mb-8">{t.heroSub}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6">
            {[
              { icon: <Users className="w-4 h-4" />, value: "12,400+", label: t.statMembers, color: "text-emerald-400" },
              { icon: <Leaf className="w-4 h-4" />, value: loadingPosts ? "..." : `${posts.length}`, label: t.statPosts, color: "text-cyan-400" },
              { icon: <ThumbsUp className="w-4 h-4" />, value: "98%", label: t.statHelpful, color: "text-amber-400" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm glass-card-light px-4 py-2 rounded-full">
                <span className={stat.color}>{stat.icon}</span>
                <span className="font-bold text-white">{stat.value}</span>
                <span className="text-slate-400 text-xs">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-10">

        {/* ═══ AUTH GUARD ═══ */}
        {!isAuthenticated && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mb-10 -mt-16 relative z-20">
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
              <div className="relative h-48 overflow-hidden">
                <Image src="/community-join.png" alt="Join community" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              </div>
              <div className="px-8 pb-8 -mt-8 relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{t.loginRequired}</h2>
                <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">{t.loginSub}</p>
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href="/auth"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-xl text-white font-bold transition-all shadow-xl shadow-emerald-500/25">
                  <LogIn className="w-4 h-4" /> {t.loginBtn}
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ SEARCH BAR ═══ */}
        {isAuthenticated && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex gap-2 mb-8">
            <div className="flex-1 flex items-center glass-card rounded-xl px-4 py-3 gap-3 focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none" />
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setComposeOpen((v) => !v)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t.newPost}</span>
            </motion.button>
          </motion.div>
        )}

        {/* ═══ MAIN LAYOUT ═══ */}
        {isAuthenticated && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* FEED */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Tabs */}
              <div className="flex gap-1 glass-card rounded-xl p-1">
                {t.tabs.map((tab, idx) => (
                  <button key={tab} onClick={() => setActiveTab(idx)}
                    className={`relative flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                      activeTab === idx ? "text-white bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 shadow-sm" : "text-slate-500 hover:text-slate-300"
                    }`}>
                    {activeTab === idx && <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Compose */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <UserAvatar username={api.getUser()?.username || "Y"} />
                  <button onClick={() => setComposeOpen((v) => !v)}
                    className="flex-1 text-left text-sm text-slate-500 bg-slate-800/40 rounded-xl px-4 py-3 hover:bg-slate-800/60 hover:text-slate-400 transition-all">
                    {t.composePrompt}
                  </button>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 text-slate-500 hover:text-emerald-400 bg-slate-800/40 rounded-xl hover:bg-slate-800/60 transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <AnimatePresence>
                  {composeOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="mt-3 space-y-3">
                        <textarea value={composeText} onChange={(e) => setComposeText(e.target.value)} placeholder={t.composePlaceholder}
                          className="w-full bg-slate-800/30 rounded-xl border border-slate-700/40 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                          rows={4} autoFocus />
                        {composeMediaPreview && (
                          <div className="relative rounded-xl overflow-hidden border border-slate-700/30">
                            <img src={composeMediaPreview} alt="Preview" className="w-full max-h-48 object-cover" />
                            <button onClick={() => { setComposeMedia(null); setComposeMediaPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                              className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMediaSelect} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-emerald-400 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-all">
                              <ImagePlus className="w-4 h-4" /> {t.photo}
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-emerald-400 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-all">
                              <Leaf className="w-4 h-4" /> {t.tagPlant}
                            </button>
                          </div>
                          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleCreatePost}
                            disabled={!composeText.trim() || isPosting}
                            className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20">
                            {isPosting ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.posting}</> : <><Send className="w-4 h-4" /> {t.post}</>}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Loading */}
              {loadingPosts && <div className="space-y-5"><PostSkeleton /><PostSkeleton /><PostSkeleton /></div>}

              {/* Error */}
              {errorPosts && !loadingPosts && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-10 text-center border border-red-500/10">
                  <AlertCircle className="w-14 h-14 text-red-400/40 mx-auto mb-4" />
                  <p className="text-sm font-semibold text-slate-300 mb-1">{t.errorLoad}</p>
                  <p className="text-xs text-slate-500 mb-6">{t.errorSub}</p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchPosts}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white text-sm font-bold transition-all shadow-lg">
                    <TrendingUp className="w-4 h-4" /> {t.retry}
                  </motion.button>
                </motion.div>
              )}

              {/* Empty */}
              {!loadingPosts && !errorPosts && filteredPosts.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-8 text-center overflow-hidden">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <Image src="/community-empty.png" alt="No posts yet" fill className="object-contain float-anim" />
                  </div>
                  <p className="text-base font-semibold text-slate-300 mb-1">{t.noPosts}</p>
                  <p className="text-xs text-slate-500">{t.noPostsSub}</p>
                </motion.div>
              )}

              {/* Posts */}
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, idx) => (
                  <motion.div key={post._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                    <PostCard post={post} currentUserId={currentUserId} t={t} onUpvote={handleUpvote} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ═══ SIDEBAR ═══ */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">
              {/* Trending */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="glass-card rounded-2xl p-5 overflow-hidden">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  {t.trendingTitle}
                </h3>
                {trendingTopics.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-3">{t.noTrending}</p>
                ) : (
                  <div className="space-y-2">
                    {trendingTopics.map((topic, i) => (
                      <motion.button key={topic.tag} whileHover={{ x: 4 }} onClick={() => setSearchQuery(topic.tag)}
                        className="w-full flex items-center justify-between group px-3 py-2 rounded-xl hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-600 w-4">{i + 1}</span>
                          <span className="text-xs text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">{topic.tag}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 bg-slate-800/60 px-2 py-0.5 rounded-full font-medium">
                          {topic.count} {isAr ? "منشور" : topic.count === 1 ? "post" : "posts"}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Top Contributors */}
              {topContributors.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    {t.topContributors}
                  </h3>
                  <div className="space-y-3">
                    {topContributors.map((member, i) => (
                      <motion.div key={i} whileHover={{ x: 3 }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/30 transition-all cursor-pointer">
                        <div className="relative">
                          <UserAvatar username={member.username} size="md" isDoctor={member.role === "DOCTOR"} />
                          {i === 0 && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white truncate block">{member.username}</span>
                          <span className="text-[10px] text-slate-500">
                            {member.postCount} {isAr ? "منشور" : "posts"} · {member.totalUpvotes} {isAr ? "تأييد" : "upvotes"}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                          #{i + 1}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                  className="glass-card rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    {t.milestones}
                  </h3>
                  <div className="space-y-4">
                    {achievements.map((a) => (
                      <motion.div key={a.id} whileHover={{ scale: 1.01 }} className={`p-3 rounded-xl transition-all ${a.current >= a.max ? "bg-emerald-500/5 ring-1 ring-emerald-500/20" : "hover:bg-slate-800/30"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-xl ${a.current >= a.max ? "" : "grayscale opacity-50"}`}>{a.emoji}</span>
                            <div>
                              <div className={`text-xs font-bold ${a.current >= a.max ? "text-emerald-400" : "text-white"}`}>
                                {isAr ? a.title_ar : a.title_en}
                                {a.current >= a.max && <span className="ml-1 text-emerald-400">✓</span>}
                              </div>
                              <div className="text-[10px] text-slate-500">{isAr ? a.desc_ar : a.desc_en}</div>
                            </div>
                          </div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${a.current >= a.max ? "text-emerald-400 bg-emerald-500/15" : "text-slate-500 bg-slate-800/60"}`}>
                            {a.current}/{a.max}
                          </span>
                        </div>
                        <ProgressBar value={a.current} max={a.max} color={a.color} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Links */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">{t.quickLinks}</h3>
                <div className="space-y-2">
                  {t.quickLinksItems.map((link) => (
                    <motion.a key={link.href} href={link.href} whileHover={{ x: 4 }}
                      className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-slate-800/40 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-all group">
                      {link.label}
                      <span className="text-slate-700 group-hover:text-emerald-500 transition-colors">{isAr ? "←" : "→"}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow">
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/40 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">{isAr ? "سنبلة" : "Sonbula"}</span>
            </div>
            <p className="text-slate-500 text-xs">{t.footerTagline}</p>
            <div className="flex gap-4 text-xs text-slate-500">
              {t.footerLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-emerald-400 transition-colors">{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
