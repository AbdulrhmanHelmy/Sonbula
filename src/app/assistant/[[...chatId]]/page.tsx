"use client";

// ============================================================================
// IMPORTS & DEPENDENCIES
// ============================================================================
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  MessageSquare,
  Plus,
  Home,
  Activity,
  Users,
  User,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Trash2,
  Send,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Paperclip,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export type ChatMessage = {
  _id: string;
  role: "user" | "assistant";
  type: "text" | "image";
  content?: string;
  source?: "llm" | "cnn";
  imageUrl?: string;
  createdAt?: string;
  status?: "sending" | "sent" | "error";
  metadata?: {
    disease?: string;
    confidence?: number;
    rawText?: string;
    rawFile?: File;
  };
};

export type Conversation = {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
};

type AuthState = "checking" | "authenticated" | "unauthenticated";

type ToastTone = "error" | "info";
type ToastState = { id: number; message: string; tone: ToastTone } | null;

type SendMessageArgs = {
  convId: string;
  text?: string;
  file?: File;
  previewUrl?: string;
  retryMsgId?: string;
};
type SendMessageContext = {
  previousMessages: ChatMessage[] | undefined;
  tempId: string;
};
type SendMessageResponse = { userMessage: ChatMessage; assistantMessage: ChatMessage };

// ============================================================================
// LOCALIZATION & CONSTANTS
// ============================================================================
const i18n = {
  ar: {
    appTitle: "سنبلة",
    newChat: "محادثة جديدة",
    oldChats: "الرسايل القديمة",
    noChats: "مفيش محادثات قبل كده.",
    startFirstChat: "ابدأ أول محادثة ليك مع سنبلة دلوقتي!",
    confirmDelete: "متأكد إنك عايز تمسح المحادثة دي؟",
    home: "الرئيسية",
    diseasesMap: "خريطة الأمراض",
    community: "مجتمع المزارعين",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    openSidebar: "فتح القائمة",
    closeSidebar: "إغلاق القائمة",
    logout: "تسجيل خروج",
    defaultGreeting: "أهلاً بيك! أنا مساعدك الزراعي من سنبلة. تقدر تسألني أي سؤال أو ترفع صورة لفحص النبات.",
    thinking: "سنبلة بتفكر",
    inputPlaceholder: "اسأل سنبلة أي حاجة...",
    fileTooLarge: "معلش، مساحة الصورة لازم تكون أقل من 5 ميجا.",
    invalidFileType: "صيغة الملف غير مدعومة. يرجى رفع صورة (JPG, PNG, WEBP).",
    readyToScan: "صورة جاهزة للفحص",
    detectedDisease: "المرض اللي اكتشفناه",
    confidenceRatio: "النسبة",
    errorNetwork: "حصلت مشكلة في الاتصال، جرب تاني.",
    dropHere: "افلت الصورة هنا...",
    retry: "إعادة الإرسال",
    failed: "فشل الإرسال",
    errorBoundaryTitle: "عذراً، حدث خطأ غير متوقع",
    errorBoundaryAction: "تحديث الصفحة",
    closeToast: "إغلاق",
  },
};
const t = i18n.ar;

const SIDEBAR_STORAGE_KEY = "sonbola_sidebar";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

// ============================================================================
// UTILS
// ============================================================================
function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Strips a JSON-wrapped `{ answer: ... }` payload down to plain markdown text,
 *  and normalises all variations of `<br>` into line breaks. */
function getCleanContent(content?: string): string {
  if (!content) return "";
  let cleanText = content;

  // Unwrap JSON { answer: "..." }
  try {
    if (content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (typeof parsed?.answer === "string") cleanText = parsed.answer;
    }
  } catch {
    // Not JSON — treat as plain text.
  }

  // Unescape escaped sequences
  cleanText = cleanText.replace(/\\n/g, "\n").replace(/\\"/g, '"');

  // Replace all <br> variants with double newline
  cleanText = cleanText.replace(/<br\s*\/?>/gi, "\n\n");

  // Remove stray pipe separators that aren't part of a real markdown table:
  // Lines that are ONLY pipes and dashes (like |---|---|---| or |----|) — keep them
  // Lines with ||| or pipes mixed into non-table prose — clean up
  // Strategy: detect real markdown tables vs stray pipes

  // First, fix "broken" markdown tables that are missing the separator row.
  // A markdown table needs: header row | separator row (|---|) | data rows
  // If we have pipe rows WITHOUT a separator row, insert one.
  cleanText = fixMalformedTables(cleanText);

  // Remove lines that are ONLY pipes, dashes, and spaces (leftover separators not inside a table)
  cleanText = cleanText.replace(/^\s*\|[\s|–\-]+\|\s*$/gm, (line) => {
    // Keep it if it looks like a valid table separator (has actual --- not just spaces)
    if (/\|[\s]*[-–]{2,}[\s]*\|/.test(line)) return line;
    return "";
  });

  // Clean up |||  (triple+ pipes that appear as text artifacts)
  cleanText = cleanText.replace(/\|{2,}/g, "|");

  // Fix BiDi issue: English numbers/percent next to Arabic text
  // Add RTL mark around numeric sequences so BiDi algorithm doesn't displace them
  cleanText = cleanText.replace(/(\d[\d\s,.\-–%\/]*\d|\d)/g, "\u200F$1\u200F");

  // Clean up multiple blank lines
  cleanText = cleanText.replace(/\n{3,}/g, "\n\n");

  return cleanText.trim();
}

/**
 * Detects markdown pipe tables that are missing their separator row
 * and inserts one so ReactMarkdown can parse them correctly.
 *
 * A valid GFM table looks like:
 *   | col1 | col2 |
 *   |------|------|   <-- separator row (required)
 *   | val1 | val2 |
 *
 * The model sometimes skips the separator row, producing:
 *   | col1 | col2 |
 *   | val1 | val2 |
 *
 * This function inserts the missing separator.
 */
function fixMalformedTables(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if current line looks like a table header row
    const isTableRow = /^\s*\|.+\|\s*$/.test(line);
    const nextIsTableRow = nextLine ? /^\s*\|.+\|\s*$/.test(nextLine) : false;
    const nextIsSeparator = nextLine ? /^\s*\|[\s|–\-:]+\|\s*$/.test(nextLine) : false;

    result.push(line);

    // If current line is a table row, next line is also a table row (not a separator),
    // and this is the first table row (previous line was NOT a table row)
    if (
      isTableRow &&
      nextIsTableRow &&
      !nextIsSeparator
    ) {
      const prevLine = result[result.length - 2];
      const prevIsTableRow = prevLine ? /^\s*\|.+\|\s*$/.test(prevLine) : false;

      // Only insert separator after the FIRST row (the header)
      if (!prevIsTableRow) {
        // Count columns from the header row
        const cols = (line.match(/\|/g)?.length ?? 2) - 1;
        const separator = "|" + Array(cols).fill("---").join("|") + "|";
        result.push(separator);
      }
    }
  }

  return result.join("\n");
}

/** Keeps the chat feed chronologically stable regardless of mutation race conditions. */
function sortMessagesByDate(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
}

/** localStorage reads can throw (privacy mode, quota, corrupted JSON) — never let that crash the page. */
function readStoredBoolean(key: string): boolean | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === "boolean" ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredBoolean(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — sidebar preference simply won't persist this session.
  }
}

// ============================================================================
// ERROR HANDLING & BOUNDARY
// ============================================================================
class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ChatErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-gray-800 p-6">
          <AlertCircle size={40} className="text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t.errorBoundaryTitle}</h2>
          <p className="text-gray-500 mb-6 max-w-md text-center text-sm">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition"
          >
            {t.errorBoundaryAction}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// SERVICES (API layer)
// ============================================================================
const chatService = {
  getGreeting: async (): Promise<string> => {
    try {
      const res = await api.getUserGreeting();
      return res.success && res.data?.message ? res.data.message : t.defaultGreeting;
    } catch {
      return t.defaultGreeting;
    }
  },
  getConversations: async (): Promise<Conversation[]> => {
    const res = await api.getConversations();
    if (!res?.success) throw new ApiError(res?.message || "Failed to fetch conversations");
    return (res.data as Conversation[]) ?? [];
  },
  getMessages: async (convId: string, signal?: AbortSignal): Promise<ChatMessage[]> => {
    const res = await api.getConversationById(convId, { signal } as RequestInit);
    if (!res?.success) throw new ApiError(res?.message || "Failed to fetch messages");
    return (res.data?.messages || []) as ChatMessage[];
  },
  deleteConversation: async (convId: string): Promise<string> => {
    const res = await api.deleteConversation(convId);
    if (!res?.success) throw new ApiError(res?.message || "Failed to delete conversation");
    return convId;
  },
  createConversation: async (title: string): Promise<Conversation> => {
    const res = await api.createConversation(title);
    if (!res?.success || !res.data) throw new ApiError(res?.message || "Failed to create conversation");
    return res.data;
  },
    sendMessage: async ({
    convId,
    text,
    file,
    signal,
  }: {
    convId: string;
    text?: string;
    file?: File;
    signal?: AbortSignal;
  }): Promise<SendMessageResponse> => {
    
    const res = file
      ? await api.sendImageToConversation(convId, file, text, { signal })
      : await api.sendTextToConversation(convId, text ?? "", { signal });
      
    if (!res?.success || !res.data) throw new ApiError(res?.message || "Failed to send message");
    return res.data;
  },
};

// ============================================================================
// HOOKS
// ============================================================================

/** Synchronous-as-possible auth gate: avoids flashing protected content before redirecting.
 *  Initial state is "checking" on both server and client; only after mount do we check the token. */
function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");

  // Check authentication only after mounting (client‑side)
  useEffect(() => {
    try {
      if (api.isAuthenticated()) {
        setAuthState("authenticated");
      } else {
        setAuthState("unauthenticated");
      }
    } catch {
      setAuthState("unauthenticated");
    }
  }, []);

  useEffect(() => {
    if (authState === "unauthenticated") {
      router.replace("/auth");
    }
  }, [authState, router]);

  const logout = useCallback(() => {
    api.clearToken();
    setAuthState("unauthenticated");
  }, []);

  return { authState, logout };
}

/** Lightweight inline toast queue — replaces alert() with a non-blocking, dismissible banner. */
function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = "error") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const id = Date.now();
    setToast({ id, message, tone });
    timeoutRef.current = setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}

/**
 * Manages the pending image attachment. Owns the lifecycle of its object URL:
 * - `clearFile` revokes immediately (user cancelled the attachment).
 * - `releaseFile` hands the file + URL off to a caller (e.g. a send action) WITHOUT
 *   revoking, since the URL is still needed for the optimistic message preview.
 */
function useFileUpload(onError: (message: string) => void) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateAndSetFile = useCallback(
    (selectedFile: File): boolean => {
      if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
        onError(t.invalidFileType);
        return false;
      }
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        onError(t.fileTooLarge);
        return false;
      }
      setFile(selectedFile);
      setPreview((prevPreview) => {
        if (prevPreview) URL.revokeObjectURL(prevPreview);
        return URL.createObjectURL(selectedFile);
      });
      return true;
    },
    [onError]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setPreview((prevPreview) => {
      if (prevPreview) URL.revokeObjectURL(prevPreview);
      return null;
    });
  }, []);

  /** Hands ownership of the current file/preview to the caller without revoking the URL. */
  const releaseFile = useCallback((): { file: File; previewUrl: string } | null => {
    if (!file || !preview) return null;
    const released = { file, previewUrl: preview };
    setFile(null);
    setPreview(null);
    return released;
  }, [file, preview]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) setIsDragging(true);
  }, []);

  // Using relatedTarget (the element the pointer is moving into) instead of an enter/leave
  // counter — it tells us definitively whether we've actually left the drop zone.
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const next = e.relatedTarget as Node | null;
    if (!next || !e.currentTarget.contains(next)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) validateAndSetFile(dropped);
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return {
    file,
    preview,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver,
    validateAndSetFile,
    clearFile,
    releaseFile,
  };
}

/** React Query is the single source of truth for both conversations and messages. */
function useChatData(activeConvId: string | null, onSendError: (message: string) => void) {
  const queryClient = useQueryClient();
  // Tracks blob: URLs created for optimistic image messages so we can revoke them exactly
  // once — right after the server's real URL takes over — instead of leaking or revoking early.
  const pendingBlobUrls = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const blobUrls = pendingBlobUrls.current;
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []);

  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
  } = useQuery({
    queryKey: ["messages", activeConvId],
    queryFn: async ({ signal }) => {
      if (!activeConvId) return [];
      return chatService.getMessages(activeConvId, signal);
    },
    enabled: Boolean(activeConvId),
    staleTime: 1000 * 60 * 2,
  });

  const { data: greetingMsg } = useQuery({
    queryKey: ["greeting"],
    queryFn: chatService.getGreeting,
    staleTime: Infinity,
  });

  const sendMutation = useMutation<SendMessageResponse, Error, SendMessageArgs, SendMessageContext>({
    mutationFn: ({ convId, text, file, signal }: SendMessageArgs & { signal?: AbortSignal }) =>
      chatService.sendMessage({ convId, text, file, signal }),
    onMutate: async ({ convId, text, file, previewUrl, retryMsgId }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", convId] });
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(["messages", convId]);

      const tempId = retryMsgId || `temp-${Date.now()}`;
      if (previewUrl) pendingBlobUrls.current.set(tempId, previewUrl);

      const optimisticMsg: ChatMessage = {
        _id: tempId,
        role: "user",
        type: file ? "image" : "text",
        content: text,
        imageUrl: previewUrl,
        createdAt: new Date().toISOString(),
        status: "sending",
        metadata: { rawText: text, rawFile: file },
      };

      queryClient.setQueryData<ChatMessage[]>(["messages", convId], (old = []) => {
        const next = retryMsgId
          ? old.map((msg) => (msg._id === retryMsgId ? optimisticMsg : msg))
          : [...old, optimisticMsg];
        return sortMessagesByDate(next);
      });

      return { previousMessages, tempId };
    },
    onError: (err, variables, context) => {
      if (!context?.tempId) return;
      queryClient.setQueryData<ChatMessage[]>(["messages", variables.convId], (old = []) =>
        old.map((msg) => (msg._id === context.tempId ? { ...msg, status: "error" } : msg))
      );
      onSendError(err instanceof Error ? err.message : t.errorNetwork);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<ChatMessage[]>(["messages", variables.convId], (old = []) => {
        const next = old
          .map((msg) => (msg._id === context?.tempId ? { ...data.userMessage, status: "sent" as const } : msg))
          .concat(data.assistantMessage);
        return sortMessagesByDate(next);
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // The real message now carries its own (server-hosted) image URL — safe to revoke ours.
      const tempId = context?.tempId;
      if (tempId) {
        const blobUrl = pendingBlobUrls.current.get(tempId);
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          pendingBlobUrls.current.delete(tempId);
        }
      }
    },
  });

  return { messages, isLoadingMessages, isFetchingMessages, greetingMsg, sendMutation };
}

// ============================================================================
// COMPONENTS (internal — kept in this file by design)
// ============================================================================

const Toast = ({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
        role="alert"
        className="fixed top-4 inset-x-0 z-[80] flex justify-center px-4"
      >
        <div
          className={cx(
            "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg shadow-black/10 border",
            toast.tone === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-900 text-white border-gray-900"
          )}
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{toast.message}</span>
          <button
            onClick={onDismiss}
            aria-label={t.closeToast}
            className="shrink-0 rounded-full p-0.5 hover:bg-black/10 transition focus:outline-none focus:ring-2 focus:ring-current"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Sidebar = ({
  isOpen,
  setIsOpen,
  activeId,
  onSelect,
  onNew,
  onLogout,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onLogout: () => void;
}) => {
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: chatService.getConversations,
    staleTime: 1000 * 30,
  });

  const deleteMutation = useMutation<string, Error, string>({
    mutationFn: chatService.deleteConversation,
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Conversation[]>(["conversations"], (old = []) => old.filter((c) => c._id !== deletedId));
      if (activeId === deletedId) onNew();
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.confirmDelete)) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const navVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/40 z-[50] lg:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        id="sidebar"
        className={cx(
          "fixed lg:relative inset-y-0 start-0 z-[60] h-full bg-white flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 border-e border-gray-100",
          isOpen ? "translate-x-0 w-72 lg:w-72" : "translate-x-full lg:translate-x-0 w-72 lg:w-16"
        )}
        aria-label="Sidebar Navigation"
      >
        {isOpen ? (
        <div className="w-72 flex flex-col h-full bg-white overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">🌱</span>
              <span className="font-bold text-xl text-gray-900 tracking-tight">{t.appTitle}</span>
            </div>
            <button
              aria-label="Close menu"
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <button
              onClick={() => {
                onNew();
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all font-medium text-sm focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
            >
              <Plus size={18} /> {t.newChat}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1" aria-label="Chat History">
            <p className="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wider">{t.oldChats}</p>

            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-11 bg-gray-100 animate-pulse rounded-xl mb-2" />)
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 opacity-70">
                <MessageSquare size={28} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-medium">{t.noChats}</p>
                <p className="text-xs text-gray-400 mt-1">{t.startFirstChat}</p>
              </div>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={navVariants}>
                {conversations.map((conv) => (
                  <motion.div key={conv._id} variants={itemVariants}>
                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onSelect(conv._id);
                          if (window.innerWidth < 1024) setIsOpen(false);
                        }
                      }}
                      className={cx(
                        "group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer border border-transparent",
                        activeId === conv._id ? "bg-gray-100 text-gray-900 font-medium" : "hover:bg-gray-50 text-gray-600"
                      )}
                      onClick={() => {
                        onSelect(conv._id);
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare size={16} className={cx("shrink-0", activeId === conv._id ? "text-gray-900" : "text-gray-400")} />
                        <span className="truncate text-sm">{conv.title || t.newChat}</span>
                      </div>
                      <button
                        aria-label="Delete chat"
                        onClick={(e) => handleDelete(conv._id, e)}
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg shrink-0 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:ring-2 focus:ring-red-200 focus:outline-none"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-1">
            <Link href="/" className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 p-2.5 rounded-lg hover:bg-gray-50 transition focus:ring-2 focus:ring-gray-400 focus:outline-none">
              <Home size={17} className="text-gray-400" /> {t.home}
            </Link>
            <Link href="/diseases" className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 p-2.5 rounded-lg hover:bg-gray-50 transition focus:ring-2 focus:ring-gray-400 focus:outline-none">
              <Activity size={17} className="text-gray-400" /> {t.diseasesMap}
            </Link>
            <Link href="/community" className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 p-2.5 rounded-lg hover:bg-gray-50 transition focus:ring-2 focus:ring-gray-400 focus:outline-none">
              <Users size={17} className="text-gray-400" /> {t.community}
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 p-2.5 rounded-lg transition mt-2 focus:ring-2 focus:ring-red-400 focus:outline-none font-medium"
            >
              <LogOut size={17} /> {t.logout}
            </button>
          </div>
        </div>
        ) : (
          // Collapsed state: a slim icon-only rail. Clicking anywhere on it re-opens the
          // full sidebar; individual icons also perform their own action on the way.
          <div
            role="button"
            tabIndex={0}
            aria-label={t.openSidebar}
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsOpen(true);
            }}
            className="hidden lg:flex w-16 flex-col items-center h-full bg-white py-4 gap-1 cursor-pointer"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNew();
                setIsOpen(true);
              }}
              aria-label={t.newChat}
              className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              <Plus size={20} />
            </button>

            <div className="flex-1" />

            <Link
              href="/profile"
              aria-label={t.profile}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              <User size={19} />
            </Link>
            <Link
              href="/settings"
              aria-label={t.settings}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              <Settings size={19} />
            </Link>
            <Link
              href="/community"
              aria-label={t.community}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              <Users size={19} />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

const FormattedTime = ({ dateString }: { dateString: string }) => {
  const formatted = useMemo(
    () => new Intl.DateTimeFormat("ar-EG", { hour: "numeric", minute: "numeric", hour12: true }).format(new Date(dateString)),
    [dateString]
  );
  return <span>{formatted}</span>;
};

// Tuned markdown components: quiet typography, subtle (not boxed) code styling,
// with RTL support and full GFM table rendering.
const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="leading-7 mb-3 last:mb-0" dir="auto">{children}</p>
  ),

  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc ps-5 mb-3 space-y-1" dir="auto">{children}</ul>
  ),

  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal ps-5 mb-3 space-y-1" dir="auto">{children}</ol>
  ),

  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-gray-50 text-[13px] font-mono px-1.5 py-0.5 rounded" dir="ltr">
      {children}
    </code>
  ),

  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 overflow-x-auto text-[13px] font-mono mb-3" dir="ltr">
      {children}
    </pre>
  ),

  // ✅ FIXED TABLE
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 w-full overflow-x-auto rounded-xl border border-gray-200">
      <table
        className="w-full border-collapse text-sm table-fixed"
        dir="rtl"
        style={{ borderSpacing: 0 }}
      >
        {children}
      </table>
    </div>
  ),

  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gray-50 border-b border-gray-200">
      {children}
    </thead>
  ),

  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-gray-100 bg-white">
      {children}
    </tbody>
  ),

  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="transition-colors hover:bg-gray-50/60">
      {children}
    </tr>
  ),

  // ✅ FIX: remove nowrap + allow wrapping
  th: ({ children }: { children?: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide break-words whitespace-normal"
      dir="auto"
    >
      {children}
    </th>
  ),

  // ✅ FIX: force text wrapping
  td: ({ children }: { children?: React.ReactNode }) => (
    <td
      className="px-4 py-3 text-sm text-gray-700 align-top break-words whitespace-normal max-w-[200px]"
      dir="auto"
    >
      {children}
    </td>
  ),
};

/** A single ChatGPT-style row: full-width, no bubble, plain aligned text. */
const MessageRow = React.memo(({ msg, onRetry }: { msg: ChatMessage; onRetry: (m: ChatMessage) => void }) => {
  const isUser = msg.role === "user";
  const isError = msg.status === "error";
  const isSending = msg.status === "sending";
  const align = isUser ? "text-right" : "text-left";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} layout="position" className="w-full py-3.5">
      <div className={cx("max-w-[680px] mx-auto px-2", align)}>
        {msg.type === "image" && msg.imageUrl && (
          <img
            src={msg.imageUrl}
            alt="مرفق المستخدم"
            className={cx("rounded-2xl w-44 sm:w-56 object-cover mb-2.5 border border-gray-100 inline-block", isSending && "opacity-70")}
            loading="lazy"
          />
        )}

        {!isUser && msg.source === "cnn" && msg.metadata?.disease && (
          <div className="mb-3 border-s-2 border-red-300 ps-3 py-1 inline-block text-start">
            <p className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-0.5">{t.detectedDisease}</p>
            <p className="text-base font-bold text-red-700">
              {msg.metadata.disease}
              {typeof msg.metadata.confidence === "number" && (
                <span className="ms-2 text-sm font-medium text-red-400">
                  ({msg.metadata.confidence}% {t.confidenceRatio})
                </span>
              )}
            </p>
          </div>
        )}

        {msg.content && (
          <div
            className={cx("prose prose-sm max-w-none", isUser ? "text-gray-900 font-medium" : "text-gray-600 font-normal")}
            dir="auto"
          >
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {getCleanContent(msg.content)}
            </ReactMarkdown>
          </div>
        )}

        <div className={cx("flex items-center gap-2 mt-1.5 text-[11px] text-gray-400", isUser ? "justify-end" : "justify-start")}>
          {msg.createdAt && !isSending && !isError && <FormattedTime dateString={msg.createdAt} />}
          {isSending && <span className="animate-pulse">جاري الإرسال...</span>}
          {isError && (
            <button
              onClick={() => onRetry(msg)}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors focus:outline-none focus:underline"
            >
              <AlertCircle size={12} /> {t.failed} · <RotateCcw size={11} /> {t.retry}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});
MessageRow.displayName = "MessageRow";

const ThinkingIndicator = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full py-3.5">
    <div className="max-w-[680px] mx-auto px-2 text-left flex items-center gap-2 text-sm text-gray-400">
      <span>{t.thinking}</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </span>
    </div>
  </motion.div>
);

const MessageSkeleton = () => (
  <div className="max-w-[680px] mx-auto w-full px-2 flex flex-col gap-6 py-6">
    <div className="flex flex-col items-end gap-2">
      <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-2/3" />
      <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-1/3" />
    </div>
    <div className="flex flex-col items-start gap-2">
      <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-5/6" />
      <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-3/4" />
      <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-1/2" />
    </div>
  </div>
);

const EmptyState = ({ greeting }: { greeting?: string }) => (
  <div className="h-full flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto">
    <span className="text-4xl mb-5">🌿</span>
    <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.appTitle}</h2>
    <p className="text-gray-500 leading-relaxed text-[15px]">{greeting || t.defaultGreeting}</p>
  </div>
);

/** Floating, ChatGPT-style pill composer. Layout stays physically left-to-right
 *  (attachment · input · send) while the input itself respects the typed language. */
const ComposerBar = ({
  question,
  setQuestion,
  onSubmit,
  file,
  preview,
  onPickFile,
  onClearFile,
  disabled,
}: {
  question: string;
  setQuestion: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  file: File | null;
  preview: string | null;
  onPickFile: (file: File) => void;
  onClearFile: () => void;
  disabled: boolean;
}) => (
  <div className="bg-white/95 backdrop-blur-md px-4 pb-5 pt-2 sticky bottom-0">
    <div className="max-w-[680px] mx-auto w-full relative">
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            className="absolute -top-[4.5rem] start-0 bg-white shadow-md shadow-black/5 p-2 rounded-2xl border border-gray-100 flex items-center gap-3 w-fit"
          >
            <img src={preview} alt="مرفق" className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
            <div className="pe-5">
              <p className="font-medium text-gray-800 text-xs flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-500" /> {t.readyToScan}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[140px]">{file?.name}</p>
            </div>
            <button
              onClick={onClearFile}
              type="button"
              aria-label="Remove image"
              className="absolute -top-2 -end-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700 transition shadow-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={onSubmit}
        dir="ltr"
        className={cx(
          "flex items-center gap-1.5 bg-gray-100 border border-transparent rounded-full p-1.5 transition-all",
          disabled ? "opacity-70" : "focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-md"
        )}
      >
        <label
          aria-label="Upload image"
          className="cursor-pointer text-gray-500 hover:text-gray-900 transition p-2.5 rounded-full hover:bg-gray-200/70 shrink-0 focus-within:ring-2 focus-within:ring-gray-400"
        >
          <input
            type="file"
            accept={ACCEPTED_FILE_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.[0]) onPickFile(e.target.files[0]);
              e.target.value = "";
            }}
            disabled={disabled}
          />
          <Paperclip size={20} />
        </label>

        <input
          type="text"
          dir="auto"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full bg-transparent border-none text-gray-900 px-1 py-2.5 focus:outline-none focus:ring-0 font-normal placeholder:text-gray-400 disabled:cursor-not-allowed text-[15px]"
          disabled={disabled}
          aria-label="Message input"
        />

        <button
          type="submit"
          disabled={disabled || (!question.trim() && !file)}
          aria-label="Send message"
          className="bg-gray-900 text-white p-2.5 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:outline-none"
        >
          <Send size={18} />
        </button>
      </form>

      <p className="text-center text-[11px] text-gray-400 mt-2.5">سنبلة ممكن تغلط، يرجى التأكد من المعلومات الزراعية من مهندس مختص.</p>
    </div>
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const AssistantPageInner = () => {
  const router = useRouter();
  const params = useParams<{ chatId?: string[] }>();
  const activeConvId = params?.chatId?.[0] || null;

  const { authState, logout } = useAuth();
  const { toast, showToast, dismissToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const saved = readStoredBoolean(SIDEBAR_STORAGE_KEY);
    setSidebarOpen(saved ?? window.innerWidth >= 1024);
  }, []);

  const toggleSidebar = useCallback((state: boolean) => {
    setSidebarOpen(state);
    writeStoredBoolean(SIDEBAR_STORAGE_KEY, state);
  }, []);

  const { messages, isLoadingMessages, isFetchingMessages, greetingMsg, sendMutation } = useChatData(activeConvId, showToast);
  const { file, preview, isDragging, handleDragEnter, handleDragLeave, handleDrop, handleDragOver, validateAndSetFile, clearFile, releaseFile } =
    useFileUpload(showToast);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => chatContainerRef.current,
    estimateSize: () => 110,
    overscan: 8,
    getItemKey: (index) => messages[index]?._id ?? index,
  });

  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
  }, []);

  // Smart auto-scroll: only follow new content when the user was already near the bottom.
  useEffect(() => {
    if (!messages.length || !isNearBottomRef.current) return;
    const frame = requestAnimationFrame(() => {
      rowVirtualizer.scrollToIndex(messages.length - 1, { align: "end", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages.length, sendMutation.isPending, rowVirtualizer]);

  const handleSend = useCallback(
    async (retryMsg?: ChatMessage) => {
      // Guard against duplicate/overlapping sends while one is already in flight.
      if (sendMutation.isPending) return;

      const textToSend = retryMsg ? retryMsg.metadata?.rawText : question.trim();
      const fileToSend = retryMsg ? retryMsg.metadata?.rawFile : file;
      const previewToSend = retryMsg ? retryMsg.imageUrl : undefined;

      if (!textToSend && !fileToSend) return;

      let releasedPreviewUrl = previewToSend;

      if (!retryMsg) {
        setQuestion("");
        if (fileToSend) {
          const released = releaseFile();
          releasedPreviewUrl = released?.previewUrl;
        }
      }

      let targetConvId = activeConvId;

      if (!targetConvId) {
        try {
          const newTitle = fileToSend ? "فحص صورة جديد" : (textToSend ?? "").substring(0, 30) || t.newChat;
          const newConv = await chatService.createConversation(newTitle);
          targetConvId = newConv._id;
          router.replace(`/assistant/${targetConvId}`);
        } catch (err: unknown) {
          showToast(err instanceof Error ? err.message : t.errorNetwork);
          return;
        }
      }

      sendMutation.mutate({
        convId: targetConvId,
        text: textToSend,
        file: fileToSend || undefined,
        previewUrl: releasedPreviewUrl,
        retryMsgId: retryMsg?._id,
      });
    },
    [sendMutation, question, file, releaseFile, activeConvId, router, showToast]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!sendMutation.isPending && (question.trim() || file)) {
        handleSend();
      }
    },
    [sendMutation.isPending, question, file, handleSend]
  );

  if (authState !== "authenticated") {
    return (
      <div className="h-screen bg-white flex items-center justify-center" aria-busy="true">
        <span className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isInputDisabled = sendMutation.isPending || isFetchingMessages;
  const showEmptyState = !activeConvId || (!isLoadingMessages && messages.length === 0);

  return (
    <div dir="rtl" className="flex h-screen bg-white overflow-hidden text-gray-900 font-sans selection:bg-gray-200">
      <Toast toast={toast} onDismiss={dismissToast} />

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={toggleSidebar}
        activeId={activeConvId}
        onSelect={(id) => router.push(`/assistant/${id}`)}
        onNew={() => router.push(`/assistant`)}
        onLogout={logout}
      />

      <main
        className="flex-1 flex flex-col relative w-full h-full min-w-0 bg-white transition-all duration-300"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[70] bg-gray-900/85 backdrop-blur-md flex flex-col items-center justify-center text-white border-2 border-dashed border-white/60 m-4 rounded-3xl"
            >
              <UploadCloud size={64} className="mb-5" />
              <h2 className="text-2xl font-semibold">{t.dropHere}</h2>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 p-3.5 flex items-center gap-3 z-[40] sticky top-0">
          <button
            onClick={() => toggleSidebar(!sidebarOpen)}
            className={cx(
              "text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2.5 rounded-xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400",
              sidebarOpen && "bg-gray-100"
            )}
            aria-label={sidebarOpen ? t.closeSidebar : t.openSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
          >
            {sidebarOpen ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
          </button>
        </header>

        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {isLoadingMessages ? (
            <MessageSkeleton />
          ) : showEmptyState ? (
            <EmptyState greeting={greetingMsg} />
          ) : (
            <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const msg = messages[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${virtualRow.start}px)` }}
                  >
                    <MessageRow msg={msg} onRetry={handleSend} />
                  </div>
                );
              })}
            </div>
          )}

          <AnimatePresence>{sendMutation.isPending && <ThinkingIndicator />}</AnimatePresence>
        </div>

        <ComposerBar
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleFormSubmit}
          file={file}
          preview={preview}
          onPickFile={validateAndSetFile}
          onClearFile={clearFile}
          disabled={isInputDisabled}
        />
      </main>
    </div>
  );
};

// ============================================================================
// EXPORT WITH PROVIDERS
// ============================================================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 60,
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => console.error(`[Query Error]: ${error.message}`),
  }),
  mutationCache: new MutationCache({
    onError: (error) => console.error(`[Mutation Error]: ${error.message}`),
  }),
});

export default function AssistantPage() {
  return (
    <ChatErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AssistantPageInner />
      </QueryClientProvider>
    </ChatErrorBoundary>
  );
}