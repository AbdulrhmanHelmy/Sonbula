"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

const IMAGE_API = "https://abdallah110-cnnn.hf.space/predict";
const CHAT_API = "https://ahmedsaeed111-agrirag-pro.hf.space/ask";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type TextMessage = { role: "user" | "bot"; type: "text"; text: string; time: string };
type ImageMessage = { role: "user" | "bot"; type: "image"; src: string; time: string };
type DetectionMessage = { role: "bot"; type: "detection"; disease: string; time: string };
type Message = TextMessage | ImageMessage | DetectionMessage;

type PendingImageState = {
  preview: string;
  file: File;
  status: "analyzing" | "ready" | "error";
  prediction: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<PendingImageState | null>(null);

  // ✅ AbortController للطلبات
  const abortControllerRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ تنظيف الـ object URLs لمنع memory leak
  useEffect(() => {
    return () => {
      if (pendingImage?.preview) {
        URL.revokeObjectURL(pendingImage.preview);
      }
    };
  }, [pendingImage?.preview]);

  // ✅ إلغاء الطلبات عند unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const typeMessage = async (text: string, signal?: AbortSignal) => {
    const placeholder: TextMessage = { role: "bot", type: "text", text: "", time: getTime() };
    setMessages((prev) => [...prev, placeholder]);

    let current = "";
    for (const char of text) {
      if (signal?.aborted) break;
      current += char;
      const snapshot = current;
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.type === "text" && last.role === "bot") {
          updated[updated.length - 1] = { ...last, text: snapshot };
        }
        return updated;
      });
      await new Promise((r) => setTimeout(r, 15));
    }
  };

  // ✅ تحليل الصورة بـ Promise نظيفة بدون polling
  const analyzeImage = useCallback(async (file: File, signal: AbortSignal): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(IMAGE_API, { method: "POST", body: formData, signal });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const data: { prediction: string; confidence: number } = await res.json();
    return data.prediction;
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    // ✅ رفع حجم الصورة (5MB كحد أقصى)
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`❌ Image size must be less than ${MAX_SIZE_MB}MB`);
      return;
    }

    // ✅ تنظيف الـ URL القديم قبل إنشاء واحد جديد
    if (pendingImage?.preview) {
      URL.revokeObjectURL(pendingImage.preview);
    }

    const preview = URL.createObjectURL(file);
    setPendingImage({ preview, file, status: "analyzing", prediction: "" });

    const controller = new AbortController();
    try {
      const prediction = await analyzeImage(file, controller.signal);
      setPendingImage((prev) =>
        prev ? { ...prev, status: "ready", prediction } : null
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Image analysis error:", err);
      setPendingImage((prev) =>
        prev ? { ...prev, status: "error", prediction: "" } : null
      );
    }
  };

  const cancelPendingImage = useCallback(() => {
    if (pendingImage?.preview) {
      URL.revokeObjectURL(pendingImage.preview);
    }
    setPendingImage(null);
  }, [pendingImage]);

  const sendMessage = async () => {
    const trimmed = question.trim();
    // ✅ السماح بالإرسال لو في صورة حتى لو مفيش نص
    if ((!trimmed && !pendingImage) || loading) return;

    // ✅ إلغاء أي طلب سابق
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const imageToSend = pendingImage;
    setPendingImage(null);
    setQuestion("");
    setLoading(true);

    // إضافة رسائل المستخدم
    const newMessages: Message[] = [];
    if (imageToSend) {
      newMessages.push({ role: "user", type: "image", src: imageToSend.preview, time: getTime() });
    }
    if (trimmed) {
      newMessages.push({ role: "user", type: "text", text: trimmed, time: getTime() });
    }
    setMessages((prev) => [...prev, ...newMessages]);

    try {
      // ✅ عرض نتيجة التحليل إذا كانت الصورة جاهزة
      if (imageToSend) {
        if (imageToSend.status === "analyzing") {
          setMessages((prev) => [
            ...prev,
            { role: "bot", type: "detection", disease: "Analyzing image...", time: getTime() },
          ]);
          await new Promise<void>((resolve) => {
            const interval = setInterval(() => {
              setPendingImage((current) => {
                if (!current || current.status !== "analyzing") {
                  clearInterval(interval);
                  resolve();
                }
                return current;
              });
            }, 200);
          });
        }

        const disease = imageToSend.prediction || "Could not identify disease";
        if (imageToSend.status === "error") {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              type: "text",
              text: "⚠️ تعذّر تحليل الصورة. يمكنك إرسال سؤال نصي.",
              time: getTime(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "bot", type: "detection", disease, time: getTime() },
          ]);
        }
      }

      // ✅ بناء السؤال مع سيستم برومت عربي واضح
      const disease = imageToSend?.status === "ready" ? imageToSend.prediction : null;

      const systemContext = disease
        ? `النبتة مصابة بمرض اسمه: ${disease}. عرّف المستخدم باسم هذا المرض باللغة العربية ثم اشرح له كيفية علاجه بشكل واضح ومبسّط.`
        : "";

      const userText = trimmed || "ما هو هذا المرض وكيف أعالجه؟";
      const finalQuestion = systemContext ? `${systemContext}\n\nسؤال المستخدم: ${userText}` : userText;

      const newHistory = [...history, { role: "user", content: finalQuestion }];

      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: finalQuestion,
          history: newHistory.slice(-8),
          top_k: 8,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Chat API error: ${res.status}`);

      const data = await res.json();
      const text = data.answer || "No response received.";

      await typeMessage(text, controller.signal);

      setHistory([...newHistory, { role: "assistant", content: text }]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("AI assistant error:", err);
      await typeMessage(
        "❌ Error contacting AI assistant. Please check your connection and try again.",
        controller.signal
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setHistory([]);
    setLoading(false);
    cancelPendingImage();
  };

  return (
    // ✅ dir="rtl" على المستوى الأعلى لدعم RTL كامل
    <div dir="rtl" className="flex flex-col h-screen bg-green-50 text-gray-900">

      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <h1 className="font-semibold text-green-700 text-lg">مساعد النباتات الذكي</h1>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearConversation}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1 rounded-lg border border-gray-200 hover:border-red-300"
          >
            🗑 مسح المحادثة
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 px-4 w-full space-y-4">
        {messages.length === 0 && !pendingImage && (
          <div className="text-center text-gray-500 mt-20">
            <h2 className="text-xl font-semibold">أهلاً بك في مساعد النباتات الذكي 🌿</h2>
            <p className="mt-2">ارفع صورة نبتة أو اكتب سؤالك</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isBot = msg.role === "bot";

          // ✅ رسائل البوت النصية تأخذ العرض الكامل
          if (isBot && msg.type === "text") {
            return (
              <div key={i} className="w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 w-full">
                  {/* شريط علوي للبوت */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-50">
                    <span className="text-lg">🌱</span>
                    <span className="text-xs font-medium text-green-600">مساعد النباتات</span>
                  </div>
                  <div
                    dir="rtl"
                    className="prose prose-sm max-w-none text-gray-800
                      prose-headings:text-green-800 prose-headings:font-bold
                      prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2
                      prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-1
                      prose-strong:text-gray-900
                      prose-ul:my-2 prose-ul:pe-4
                      prose-li:my-0.5
                      prose-p:leading-relaxed prose-p:my-1
                      break-words"
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  <p className="text-xs mt-3 text-gray-400 text-left">{msg.time}</p>
                </div>
              </div>
            );
          }

          // ✅ رسائل المستخدم — فقاعة على اليسار (بسبب RTL)
          if (isUser) {
            return (
              <div key={i} className="flex justify-start">
                <div className="rounded-2xl p-3 max-w-sm text-sm shadow bg-green-600 text-white">
                  {msg.type === "image" && (
                    <img src={msg.src} alt="صورة النبتة" className="rounded-lg w-48" />
                  )}
                  {msg.type === "text" && (
                    <p className="whitespace-pre-wrap break-words text-right">{msg.text}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70 text-left">{msg.time}</p>
                </div>
              </div>
            );
          }

          // ✅ رسائل الكشف عن المرض — بطاقة ممتدة
          if (isBot && msg.type === "detection") {
            return (
              <div key={i} className="w-full">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  {msg.disease === "Analyzing image..." ? (
                    <>
                      <span className="w-3 h-3 rounded-full bg-green-400 animate-ping inline-block shrink-0" />
                      <span className="text-gray-500 italic text-sm">جارٍ تحليل الصورة...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl shrink-0">🔍</span>
                      <div>
                        <p className="text-xs text-gray-400">المرض المكتشف</p>
                        <p className="font-bold text-green-700 text-base">{msg.disease}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* مؤشر التحميل */}
        {loading && (
          <div className="w-full">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce inline-block" />
              <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce inline-block [animation-delay:0.15s]" />
              <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce inline-block [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Pending Image Preview */}
      {pendingImage && (
        <div className="w-full px-4 pb-2 flex items-center gap-3">
          <div className="relative">
            <img
              src={pendingImage.preview}
              alt="صورة مرفقة"
              className="w-16 h-16 rounded-xl object-cover shadow"
            />
            <button
              onClick={cancelPendingImage}
              className="absolute -top-1 -left-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
          {pendingImage.status === "analyzing" && (
            <span className="text-xs text-gray-400 animate-pulse">🔄 جارٍ التحليل...</span>
          )}
          {pendingImage.status === "ready" && (
            <span className="text-xs text-green-600">✓ جاهز — {pendingImage.prediction}</span>
          )}
          {pendingImage.status === "error" && (
            <span className="text-xs text-red-500">⚠️ فشل التحليل — يمكنك الإرسال مع ذلك</span>
          )}
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t bg-white p-4 shadow-inner">
        <div className="w-full flex items-center gap-2">
          {/* زر الإرسال على اليمين في RTL */}
          <button
            onClick={sendMessage}
            disabled={loading || (!question.trim() && !pendingImage)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            إرسال
          </button>

          <input
            dir="rtl"
            className="flex-1 border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-right"
            placeholder="اسأل عن أمراض النباتات..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <label className="cursor-pointer text-2xl hover:opacity-70 transition-opacity shrink-0" title="رفع صورة (حد أقصى 5MB)">
            📎
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
      </div>
    </div>
  );
}