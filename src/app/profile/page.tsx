"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Fingerprint,
  LogOut,
  ArrowLeft,
  Sparkles,
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    lg: "w-12 h-12 text-sm",
  };
  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br ${getAvatarGradient(
          username,
        )} rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0`}>
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

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "الآن";
  if (diffMin === 1) return "منذ دقيقة";
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  if (diffHr === 1) return "منذ ساعة";
  if (diffHr < 24) return `منذ ${diffHr} ساعة`;
  if (diffDay === 1) return "منذ يوم";
  return `منذ ${diffDay} يوم`;
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
  onVote,
}: {
  comment: Comment;
  currentUserId: string;
  onVote: (commentId: string, voteType: "upvote" | "downvote") => void;
}) {
  const score =
    (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0);
  const hasUpvoted = comment.upvotes?.includes(currentUserId);
  const hasDownvoted = comment.downvotes?.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-2.5">
      <UserAvatar
        username={comment.author?.username || "U"}
        size="sm"
        isDoctor={comment.author?.role === "DOCTOR"}
      />
      <div className="flex-1">
        <div className="bg-slate-800/40 rounded-xl px-3.5 py-2.5 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-white">
              {comment.author?.username || "User"}
            </span>
            {comment.author?.role === "DOCTOR" && (
              <span className="text-[9px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded-full">
                طبيب
              </span>
            )}
            <span className="text-[10px] text-slate-600">
              {formatRelativeTime(comment.createdAt)}
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
  onUpvote,
}: {
  post: Post;
  currentUserId: string;
  onUpvote: (postId: string) => void;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const hasUpvoted = post.upvotes?.includes(currentUserId);
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
      setComments((prev) => [
        ...prev,
        {
          ...res.data,
          author: {
            _id: user?._id || res.data.author,
            username: user?.username || "أنت",
            role: "USER" as const,
          },
        },
      ]);
      setCommentInput("");
    }
    setSubmittingComment(false);
  };

  const handleVoteComment = async (
    commentId: string,
    voteType: "upvote" | "downvote",
  ) => {
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
            <UserAvatar
              username={post.author?.username || "U"}
              isDoctor={isDoctor}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">
                  {post.author?.username || "Unknown"}
                </span>
                {isDoctor && (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                    <Stethoscope className="w-2.5 h-2.5" /> طبيب
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{formatRelativeTime(post.createdAt)}</span>
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
                      جارٍ تحميل التعليقات...
                    </span>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    لا توجد تعليقات بعد. كن أول من يرد!
                  </p>
                ) : (
                  comments.map((c) => (
                    <CommentItem
                      key={c._id}
                      comment={c}
                      currentUserId={currentUserId}
                      onVote={handleVoteComment}
                    />
                  ))
                )}

                {/* Reply input */}
                <div className="flex gap-2 mt-2">
                  <UserAvatar
                    username={api.getUser()?.username || "أنت"}
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
                      placeholder="اكتب رداً..."
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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "posts">("info");

  useEffect(() => {
    const token = api.getToken();
    const userInfo = api.getUser();
    if (!token || !userInfo) {
      router.push("/auth");
      return;
    }
    setUser(userInfo);
    setLoading(false);
  }, [router]);

  const fetchMyPosts = useCallback(async () => {
    if (!user?._id) return;
    setLoadingPosts(true);
    const res = await api.getPosts();
    if (res.success && res.data) {
      const myPosts = (res.data as Post[]).filter(
        (p) => p.author?._id === user._id,
      );
      setPosts(myPosts);
    }
    setLoadingPosts(false);
  }, [user?._id]);

  useEffect(() => {
    if (activeTab === "posts" && posts.length === 0 && !loadingPosts) {
      fetchMyPosts();
    }
  }, [activeTab, fetchMyPosts, posts.length, loadingPosts]);

  const handleLogout = () => {
    api.clearToken();
    router.push("/");
  };

  // ✅ handleUpvote قبل الـ if (loading) عشان يكون في scope الـ return الرئيسي
  const handleUpvote = useCallback(
    async (postId: string) => {
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;
          const alreadyUpvoted = post.upvotes.includes(user?._id || "");
          return {
            ...post,
            upvotes: alreadyUpvoted
              ? post.upvotes.filter((id) => id !== user?._id)
              : [...post.upvotes, user?._id || ""],
          };
        }),
      );
      await api.togglePostUpvote(postId);
    },
    [user?._id],
  );

  const totalUpvotes = posts.reduce(
    (sum, p) => sum + (p.upvotes?.length || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500">جار التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden"
      dir="rtl">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10 relative z-10">
        {/* ─── Profile Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden mb-5">
          {/* Top banner */}
          <div className="h-20 bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-emerald-500/10 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
          </div>

          <div className="px-6 pb-6 -mt-8 relative">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-emerald-500/30 mb-3 border-4 border-slate-900">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-bold text-white">
                  {user?.username}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold text-red-400 rounded-lg transition-all">
                <LogOut className="w-3.5 h-3.5" /> خروج
              </button>
            </div>

            {/* Stats row */}
            {posts.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                <StatCard
                  icon={<FileText className="w-4 h-4" />}
                  value={posts.length}
                  label="منشوراتي"
                  color="text-emerald-400"
                />
                <StatCard
                  icon={<Heart className="w-4 h-4" />}
                  value={totalUpvotes}
                  label="إجمالي الإعجابات"
                  color="text-rose-400"
                />
                <StatCard
                  icon={<ThumbsUp className="w-4 h-4" />}
                  value={
                    posts.length
                      ? (totalUpvotes / posts.length).toFixed(1)
                      : "0"
                  }
                  label="متوسط التفاعل"
                  color="text-amber-400"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-1 bg-slate-900/50 border border-slate-800/60 rounded-xl p-1 mb-5">
          {(
            [
              { key: "info", label: "معلومات الحساب" },
              { key: "posts", label: "منشوراتي" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? "text-white bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="profileTabIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Tab: Account Info ─── */}
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 space-y-4">
              {[
                {
                  icon: <User className="w-3.5 h-3.5" />,
                  label: "اسم المستخدم",
                  value: user?.username,
                },
                {
                  icon: <Mail className="w-3.5 h-3.5" />,
                  label: "البريد الإلكتروني",
                  value: user?.email,
                },
              ].map((f) => (
                <div key={f.label}>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                    {f.icon} {f.label}
                  </div>
                  <div className="px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/50 rounded-xl text-sm text-slate-300">
                    {f.value || "—"}
                  </div>
                </div>
              ))}

              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
                  <Fingerprint className="w-3.5 h-3.5" /> معرف المستخدم
                </div>
                <div className="px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/50 rounded-xl text-xs font-mono text-slate-600 break-all">
                  {user?._id || "—"}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-400">
                    مميزات قريباً
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    تعديل الملف الشخصي، تغيير كلمة المرور، والإعدادات
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-all">
                  <ArrowLeft className="w-4 h-4" /> الرئيسية
                </Link>
              </div>
            </motion.div>
          )}

          {/* ─── Tab: My Posts ─── */}
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4">
              {/* Loading */}
              {loadingPosts && (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              )}

              {/* Empty */}
              {!loadingPosts && posts.length === 0 && (
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-10 text-center">
                  <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-400 mb-1">
                    لم تنشر أي شيء بعد
                  </p>
                  <p className="text-xs text-slate-600 mb-5">
                    شارك تجربتك مع نباتاتك في صفحة المجتمع!
                  </p>
                  <Link
                    href="/community"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-all">
                    اذهب للمجتمع
                  </Link>
                </div>
              )}

              {/* Posts list */}
              {!loadingPosts &&
                posts.map((post, idx) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}>
                    <ProfilePostCard
                      post={post}
                      currentUserId={user?._id || ""}
                      onUpvote={handleUpvote}
                    />
                  </motion.div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
