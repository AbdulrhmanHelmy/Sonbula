"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Stethoscope,
  Eye,
  Loader2,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Send,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSettings } from "@/context/SettingsContext";
import { api, type User as ApiUser } from "@/lib/api";

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

// ─── UI Translations ──────────────────────────────────────────────────────────

const UI = {
  en: {
    back: "Back",
    unknownUser: "User",
    doctor: "Doctor",
    postsLabel: "Posts",
    totalLikes: "Total Likes",
    loadingComments: "Loading comments...",
    noComments: "No comments yet. Be the first to reply!",
    replyPlaceholder: "Write a reply...",
    you: "You",
    errorTitle: "Couldn't load posts",
    errorSub: "Check your connection and try again",
    retry: "Try Again",
    noPostsTitle: "This user hasn't posted anything yet",
    justNow: "now",
    minuteAgo: "1m ago",
    minutesAgo: "m ago",
    hourAgo: "1h ago",
    hoursAgo: "h ago",
    dayAgo: "1d ago",
    daysAgo: "d ago",
  },
  ar: {
    back: "رجوع",
    unknownUser: "مستخدم",
    doctor: "طبيب",
    postsLabel: "المنشورات",
    totalLikes: "إجمالي الإعجابات",
    loadingComments: "جارٍ تحميل التعليقات...",
    noComments: "لا توجد تعليقات بعد. كن أول من يرد!",
    replyPlaceholder: "اكتب رداً...",
    you: "أنت",
    errorTitle: "حدث خطأ أثناء تحميل المنشورات",
    errorSub: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
    retry: "إعادة المحاولة",
    noPostsTitle: "لا توجد منشورات لهذا المستخدم بعد",
    justNow: "الآن",
    minuteAgo: "منذ دقيقة",
    minutesAgo: "د",
    hourAgo: "منذ ساعة",
    hoursAgo: "س",
    dayAgo: "منذ يوم",
    daysAgo: "ي",
  },
};

type Dict = (typeof UI)["en"];

// ─── Helpers (shared look with /profile and /community) ──────────────────────

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

function UserAvatar({
  username,
  size = "md",
  isDoctor = false,
}: {
  username: string;
  size?: "sm" | "md" | "lg";
  isDoctor?: boolean;
}) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-16 h-16 text-2xl",
  };
  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br ${getAvatarGradient(
          username,
        )} rounded-2xl flex items-center justify-center font-black text-white shadow-xl shrink-0`}>
        {getInitials(username)}
      </div>
      {isDoctor && (
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
          <Stethoscope className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(dateStr: string, t: Dict): string {
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
        <img
          src={src}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
        />
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
  comment,
  currentUserId,
  t,
  onVote,
}: {
  comment: Comment;
  currentUserId: string | null;
  t: Dict;
  onVote: (commentId: string, voteType: "upvote" | "downvote") => void;
}) {
  const score =
    (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0);
  const hasUpvoted = currentUserId
    ? comment.upvotes?.includes(currentUserId)
    : false;
  const hasDownvoted = currentUserId
    ? comment.downvotes?.includes(currentUserId)
    : false;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-2.5">
      <Link href={`/profile/${comment.author?._id}`}>
        <UserAvatar
          username={comment.author?.username || "U"}
          size="sm"
          isDoctor={comment.author?.role === "DOCTOR"}
        />
      </Link>
      <div className="flex-1">
        <div className="bg-slate-800/40 rounded-xl px-3.5 py-2.5 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <Link
              href={`/profile/${comment.author?._id}`}
              className="text-xs font-bold text-white hover:text-emerald-400 transition-colors">
              {comment.author?.username || "User"}
            </Link>
            {comment.author?.role === "DOCTOR" && (
              <span className="text-[9px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded-full">
                {t.doctor}
              </span>
            )}
            <span className="text-[10px] text-slate-600">
              {formatRelativeTime(comment.createdAt, t)}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {comment.content}
          </p>
        </div>
        <div className="flex items-center gap-0.5 mt-1 px-1">
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={() => onVote(comment._id, "upvote")}
            className={`p-1 rounded-md transition-all ${
              hasUpvoted
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-slate-600 hover:text-emerald-400"
            }`}>
            <ThumbsUp className="w-3 h-3" />
          </motion.button>
          <span
            className={`text-[10px] font-bold min-w-[14px] text-center ${
              score > 0
                ? "text-emerald-400"
                : score < 0
                  ? "text-red-400"
                  : "text-slate-600"
            }`}>
            {score}
          </span>
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={() => onVote(comment._id, "downvote")}
            className={`p-1 rounded-md transition-all ${
              hasDownvoted
                ? "text-red-400 bg-red-500/10"
                : "text-slate-600 hover:text-red-400"
            }`}>
            <ThumbsDown className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function ProfilePostCard({
  post,
  currentUserId,
  t,
  onUpvote,
}: {
  post: Post;
  currentUserId: string | null;
  t: Dict;
  onUpvote: (postId: string) => void;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const hasUpvoted = currentUserId
    ? post.upvotes?.includes(currentUserId)
    : false;
  const isDoctor = post.author?.role === "DOCTOR";

  const loadComments = useCallback(async () => {
    if (commentsLoaded) return;
    setLoadingComments(true);
    try {
      const res = await api.getPostComments(post._id);
      if (res.success && res.data) setComments(res.data);
    } finally {
      setCommentsLoaded(true);
      setLoadingComments(false);
    }
  }, [post._id, commentsLoaded]);

  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) loadComments();
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await api.addComment(post._id, commentInput.trim());
      if (res.success && res.data) {
        const user = api.getUser();
        setComments((prev) => [
          ...prev,
          {
            ...res.data,
            author: {
              _id: user?._id || res.data.author,
              username: user?.username || t.you,
              role: "USER" as const,
            },
          },
        ]);
        setCommentInput("");
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVoteComment = async (
    commentId: string,
    voteType: "upvote" | "downvote",
  ) => {
    if (!currentUserId) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;
        const up = [...(c.upvotes || [])];
        const down = [...(c.downvotes || [])];
        const upIdx = up.indexOf(currentUserId);
        if (upIdx > -1) up.splice(upIdx, 1);
        const downIdx = down.indexOf(currentUserId);
        if (downIdx > -1) down.splice(downIdx, 1);
        if (voteType === "upvote") up.push(currentUserId);
        else down.push(currentUserId);
        return { ...c, upvotes: up, downvotes: down };
      }),
    );
    await api.voteComment(commentId, voteType);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-slate-900/50 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
          isDoctor
            ? "border-blue-500/20 hover:shadow-blue-500/10 ring-1 ring-blue-500/10"
            : "border-slate-800/60 hover:border-emerald-500/20 hover:shadow-emerald-500/5"
        }`}>
        {isDoctor && (
          <div className="h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
        )}

        <div className="p-5">
          {/* Author header */}
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/profile/${post.author?._id}`}>
              <UserAvatar
                username={post.author?.username || "U"}
                isDoctor={isDoctor}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${post.author?._id}`}
                  className="font-bold text-white text-sm hover:text-emerald-400 transition-colors">
                  {post.author?.username || "Unknown"}
                </Link>
                {isDoctor && (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                    <Stethoscope className="w-2.5 h-2.5" /> {t.doctor}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{formatRelativeTime(post.createdAt, t)}</span>
                {post.author?.governorate && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> {post.author.governorate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-slate-200 text-[14px] leading-relaxed mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Media */}
          {post.media && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setLightboxSrc(post.media)}
              className="relative w-full rounded-xl overflow-hidden mb-3 cursor-pointer group border border-slate-700/30">
              <img
                src={post.media}
                alt="Post media"
                className="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 pt-3 border-t border-slate-700/30">
            <motion.button
              whileTap={{ scale: 1.4 }}
              onClick={() => onUpvote(post._id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                hasUpvoted
                  ? "text-rose-400 bg-rose-500/15"
                  : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/5"
              }`}>
              <Heart
                className={`w-[18px] h-[18px] transition-all ${
                  hasUpvoted ? "fill-rose-400 stroke-rose-400" : ""
                }`}
              />
              <span>{post.upvotes?.length || 0}</span>
            </motion.button>

            <button
              onClick={handleToggleComments}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                showComments
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5"
              }`}>
              <MessageCircle className="w-[18px] h-[18px]" />
              <span>{commentsLoaded ? comments.length : ""}</span>
            </button>

            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-sky-400 hover:bg-sky-500/5 transition-all mr-auto">
              <Share2 className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-700/30 bg-slate-900/30">
                {loadingComments ? (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-xs text-slate-500">
                      {t.loadingComments}
                    </span>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    {t.noComments}
                  </p>
                ) : (
                  comments.map((c) => (
                    <CommentItem
                      key={c._id}
                      comment={c}
                      currentUserId={currentUserId}
                      t={t}
                      onVote={handleVoteComment}
                    />
                  ))
                )}

                {/* Reply input — only for signed-in users */}
                {currentUserId && (
                  <div className="flex gap-2 mt-2">
                    <UserAvatar
                      username={api.getUser()?.username || t.you}
                      size="sm"
                    />
                    <div className="flex-1 flex items-center bg-slate-800/40 rounded-xl px-3 py-2 gap-2 focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all">
                      <input
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                        placeholder={t.replyPlaceholder}
                        className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none"
                      />
                      <motion.button
                        whileTap={{ scale: 1.2 }}
                        onClick={handleAddComment}
                        disabled={!commentInput.trim() || submittingComment}
                        className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition-all p-1">
                        {submittingComment ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightboxSrc && (
          <ImageLightbox
            src={lightboxSrc}
            onClose={() => setLightboxSrc(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Post Skeleton ────────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-3 animate-pulse">
      <div className="w-24 h-2.5 bg-slate-800 rounded-lg" />
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-800 rounded-lg" />
        <div className="w-4/5 h-3 bg-slate-800 rounded-lg" />
        <div className="w-3/5 h-3 bg-slate-800/60 rounded-lg" />
      </div>
      <div className="flex gap-4 pt-3 border-t border-slate-800/40">
        <div className="w-12 h-5 bg-slate-800 rounded-lg" />
        <div className="w-12 h-5 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 text-center">
      <div className={`flex justify-center mb-1.5 ${color}`}>{icon}</div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const { language } = useSettings();
  const isAr = language === "ar";
  const t = UI[isAr ? "ar" : "en"];

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // The profile being viewed — derived from the posts we fetch, since there's
  // no dedicated "get user by id" usage assumed here. We pull the author info
  // off of their first post. If the API exposes api.getUserById later, swap
  // this for a direct call.
  const [profileUser, setProfileUser] = useState<PostAuthor | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [postsError, setPostsError] = useState(false);

  useEffect(() => {
    const userInfo = api.getUser();
    setCurrentUserId(userInfo?._id || null);
  }, []);

  // If the viewer is looking at their own profile, send them to the
  // full account page instead (it has logout / edit account actions).
  useEffect(() => {
    if (currentUserId && userId && currentUserId === userId) {
      router.replace("/profile");
    }
  }, [currentUserId, userId, router]);

  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;
    setLoadingPosts(true);
    setPostsError(false);
    try {
      const res = await api.getPosts();
      if (res.success && res.data) {
        const userPosts = (res.data as Post[]).filter(
          (p) => p.author?._id === userId,
        );
        setPosts(userPosts);
        if (userPosts.length > 0) setProfileUser(userPosts[0].author);
      } else {
        setPostsError(true);
      }
    } catch {
      setPostsError(true);
    } finally {
      setLoadingPosts(false);
      setPostsLoaded(true);
    }
  }, [userId]);

  useEffect(() => {
    if (!postsLoaded) {
      fetchUserPosts();
    }
  }, [postsLoaded, fetchUserPosts]);

  const handleRetry = () => {
    setPostsLoaded(false);
  };

  const handleUpvote = useCallback(
    async (postId: string) => {
      if (!currentUserId) return;
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;
          const alreadyUpvoted = post.upvotes.includes(currentUserId);
          return {
            ...post,
            upvotes: alreadyUpvoted
              ? post.upvotes.filter((id) => id !== currentUserId)
              : [...post.upvotes, currentUserId],
          };
        }),
      );
      await api.togglePostUpvote(postId);
    },
    [currentUserId],
  );

  const totalUpvotes = posts.reduce(
    (sum, p) => sum + (p.upvotes?.length || 0),
    0,
  );

  const isDoctor = profileUser?.role === "DOCTOR";

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden"
      dir={isAr ? "rtl" : "ltr"}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10 relative z-10">
        {/* ─── Back ─── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors mb-5">
          <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "" : "rotate-180"}`} />{" "}
          {t.back}
        </button>

        {/* ─── Profile Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden mb-5">
          <div
            className={`h-20 relative ${
              isDoctor
                ? "bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-blue-500/10"
                : "bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-emerald-500/10"
            }`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
          </div>

          <div className="px-6 pb-6 -mt-8 relative">
            {loadingPosts && !profileUser ? (
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border-4 border-slate-900 animate-pulse mb-3" />
            ) : (
              <div className="mb-3">
                <UserAvatar
                  username={profileUser?.username || "U"}
                  size="lg"
                  isDoctor={isDoctor}
                />
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-white truncate">
                    {profileUser?.username ||
                      (loadingPosts ? "..." : t.unknownUser)}
                  </h1>
                  {isDoctor && (
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1 shrink-0">
                      <Stethoscope className="w-2.5 h-2.5" /> {t.doctor}
                    </span>
                  )}
                </div>
                {profileUser?.governorate && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {profileUser.governorate}
                  </p>
                )}
              </div>
            </div>

            {/* Stats row */}
            {posts.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-5">
                <StatCard
                  icon={<FileText className="w-4 h-4" />}
                  value={posts.length}
                  label={t.postsLabel}
                  color="text-emerald-400"
                />
                <StatCard
                  icon={<Heart className="w-4 h-4" />}
                  value={totalUpvotes}
                  label={t.totalLikes}
                  color="text-rose-400"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* ─── Posts ─── */}
        <div className="space-y-4">
          {loadingPosts && (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {!loadingPosts && postsError && (
            <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-10 text-center">
              <AlertCircle className="w-12 h-12 text-red-400/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300 mb-1">
                {t.errorTitle}
              </p>
              <p className="text-xs text-slate-600 mb-5">{t.errorSub}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-all">
                <RefreshCw className="w-4 h-4" /> {t.retry}
              </button>
            </div>
          )}

          {!loadingPosts && !postsError && posts.length === 0 && (
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-10 text-center">
              <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400 mb-1">
                {t.noPostsTitle}
              </p>
            </div>
          )}

          {!loadingPosts &&
            !postsError &&
            posts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}>
                <ProfilePostCard
                  post={post}
                  currentUserId={currentUserId}
                  t={t}
                  onUpvote={handleUpvote}
                />
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  );
}
