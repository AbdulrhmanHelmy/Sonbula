"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { api } from "@/lib/api";
import { MessageSquare, Plus, Home, Activity, Users, LogOut, Menu, X, Trash2, CloudSun } from "lucide-react";
import Link from "next/link";

// Types
type ChatMessage = {
  _id: string;
  role: "user" | "assistant";
  type: "text" | "image";
  content?: string;
  source?: "llm" | "cnn";
  imageUrl?: string;
  createdAt?: string;
  metadata?: {
    disease?: string;
    confidence?: number;
    [key: string]: any;
  };
};

type Conversation = {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
};

export default function AssistantPage() {
  const router = useRouter();
  const params = useParams();
  // استخراج الـ ID من الـ URL لو موجود
  const urlChatId = params?.chatId?.[0] || null;
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // State للرسالة الترحيبية
  const [greetingMsg, setGreetingMsg] = useState<string>("أهلاً بيك! أنا مساعدك الزراعي من سنبلة. تقدر تسألني أي سؤال أو ترفع صورة لفحص النبات.");
  
  const [question, setQuestion] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);

  // 1. Check Auth & Load Initial Data
  useEffect(() => {
    const initPage = async () => {
      if (!api.isAuthenticated()) {
        router.push("/auth");
        return;
      }
      setIsAuthenticated(true);
      fetchConversations();
      
      // جلب الرسالة الترحيبية
      const greetingRes = await api.getUserGreeting();
      if (greetingRes.success && greetingRes.data?.message) {
        setGreetingMsg(greetingRes.data.message);
      }
    };
    initPage();
  }, [router]);

  // 2. مراقبة الـ URL وتحميل المحادثة المناسبة (عشان الـ Refresh يشتغل)
  useEffect(() => {
    if (isAuthenticated) {
      if (urlChatId && urlChatId !== activeConvId) {
        loadConversation(urlChatId);
      } else if (!urlChatId && activeConvId) {
        // لو مسح الـ ID من اللينك نرجع للمحادثة الجديدة
        setActiveConvId(null);
        setMessages([]);
      }
    }
  }, [urlChatId, isAuthenticated]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchConversations = async () => {
    const res = await api.getConversations();
    if (res.success && res.data) {
      setConversations(res.data);
    }
  };

  const loadConversation = async (convId: string) => {
    setActiveConvId(convId);
    setLoading(true);
    setSidebarOpen(false);
    
    const res = await api.getConversationById(convId);
    if (res.success && res.data && res.data.messages) {
      setMessages(res.data.messages);
    } else {
      setMessages([]);
    }
    setLoading(false);
  };

  const selectChat = (convId: string) => {
    router.push(`/assistant/${convId}`);
  };

  const startNewChat = () => {
    router.push(`/assistant`);
    setActiveConvId(null);
    setMessages([]);
    setQuestion("");
    clearFile();
    setSidebarOpen(false);
  };

  const deleteChat = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("متأكد إنك عايز تمسح المحادثة دي؟");
    if (!confirmDelete) return;

    setLoading(true);
    const res = await api.deleteConversation(convId);
    if (res.success) {
      if (activeConvId === convId) startNewChat();
      fetchConversations();
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("معلش، مساحة الصورة لازم تكون أقل من 5 ميجا.");
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const sendMessage = async () => {
    const textToSend = question.trim();
    const fileToSend = selectedFile;
    
    if (!textToSend && !fileToSend) return;

    setLoading(true);
    setQuestion("");
    clearFile();

    let currentConvId = activeConvId;

    if (!currentConvId) {
      const newConvRes = await api.createConversation(fileToSend ? "فحص صورة جديد" : textToSend.substring(0, 30));
      if (newConvRes.success && newConvRes.data) {
        currentConvId = newConvRes.data._id;
        setActiveConvId(currentConvId);
        fetchConversations();
        // تغيير اللينك للـ ID الجديد بسلاسة من غير ريفريش
        window.history.pushState(null, '', `/assistant/${currentConvId}`);
      } else {
        alert("حصلت مشكلة في إنشاء المحادثة، جرب تاني.");
        setLoading(false);
        return;
      }
    }

    if (fileToSend) {
const res = await api.sendImageToConversation(currentConvId!, fileToSend);      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data.userMessage, res.data.assistantMessage]);
      } else {
        alert("فشل تحليل الصورة، السيرفر ماردش.");
      }
    } else if (textToSend) {
      const res = await api.sendTextToConversation(currentConvId!, textToSend);
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data.userMessage, res.data.assistantMessage]);
      } else {
        alert("فشل إرسال الرسالة، السيرفر ماردش.");
      }
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    api.clearToken();
    router.push("/auth");
  };

  if (isAuthenticated === null) return null;

  return (
    <div dir="rtl" className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl text-green-700">سنبلة</span>
          </div>
          <button className="lg:hidden p-1 text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <button 
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition shadow-sm font-medium"
          >
            <Plus size={20} />
            محادثة جديدة
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <p className="text-xs font-bold text-gray-400 mb-3 px-2">الرسايل القديمة</p>
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`w-full flex items-center justify-between gap-2 px-3 py-3 rounded-lg transition-colors cursor-pointer ${
                  activeConvId === conv._id ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-100 text-gray-600"
                }`}
                onClick={() => selectChat(conv._id)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare size={18} className="shrink-0" />
                  <span className="truncate text-sm">{conv.title || "محادثة جديدة"}</span>
                </div>
                <button 
                  onClick={(e) => deleteChat(conv._id, e)}
                  className="text-gray-400 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-4">مفيش محادثات قبل كده.</p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
          <Link href="/" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-white transition">
            <Home size={18} /> الرئيسية
          </Link>
          <Link href="/diseases" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-white transition">
            <Activity size={18} /> خريطة الأمراض
          </Link>
          <Link href="/community" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-white transition">
            <Users size={18} /> مجتمع المزارعين
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 p-2 rounded-lg transition mt-2">
            <LogOut size={18} /> تسجيل خروج
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative w-full h-full">
        <header className="lg:hidden bg-white border-b p-4 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-green-700">المساعد الذكي</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <span className="text-6xl mb-6">🌿</span>
              {/* الرسالة الترحيبية الديناميكية بتتعرض هنا */}
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl max-w-lg shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-3 text-orange-600">
                  <CloudSun size={28} />
                  <h2 className="text-xl font-bold">تحديث مهم عشانك!</h2>
                </div>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {greetingMsg}
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg._id || idx} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 shadow-sm ${msg.role === "user" ? "bg-green-600 text-white rounded-br-none" : "bg-white border border-gray-200 rounded-bl-none"}`}>
                  
                  {msg.role === "user" && msg.type === "image" && msg.imageUrl && (
                    <img src={msg.imageUrl} alt="صورة مرفوعة" className="rounded-lg w-48 object-cover mb-2 border border-green-500" />
                  )}

                  {msg.role === "assistant" && msg.source === "cnn" && msg.metadata && msg.metadata.disease && (
                    <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 flex items-center gap-3">
                      <span className="text-2xl">🦠</span>
                      <div>
                        <p className="text-xs font-bold opacity-80">المرض اللي اكتشفناه</p>
                        <p className="text-lg font-bold">{msg.metadata.disease}</p>
                      </div>
                      {msg.metadata.confidence && (
                        <div className="mr-auto text-left">
                          <span className="text-xs block">النسبة</span>
                          <span className="font-bold text-green-600">{msg.metadata.confidence}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.content && (
                    <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "text-white prose-p:text-white" : "text-gray-800"}`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                  
                </div>
              </div>
            ))
          )}

          {loading && (
             <div className="flex justify-end">
               <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                 <span className="text-sm text-gray-500 font-medium">سنبلة بتفكر...</span>
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></span>
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </div>
             </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="bg-white border-t p-4 sm:p-5">
          {previewUrl && (
            <div className="mb-3 flex items-center gap-3 bg-gray-50 p-2 rounded-lg border w-fit relative">
              <img src={previewUrl} alt="مرفق" className="w-14 h-14 object-cover rounded-md" />
              <div className="text-sm">
                <p className="font-medium text-gray-700 text-xs">صورة جاهزة للفحص</p>
              </div>
              <button onClick={clearFile} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">×</button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={sendMessage}
              disabled={loading || (!question.trim() && !selectedFile)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 transition font-medium shrink-0"
            >
              ابعت
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="اكتب سؤالك هنا أو ارفع صورة النبتة..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition pr-12"
                disabled={loading}
              />
              <label className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-green-600 transition p-1">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={loading} />
                📎
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}