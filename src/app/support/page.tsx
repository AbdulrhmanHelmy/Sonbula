"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "./support.css";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";

// ─── Static Data (bilingual) ──────────────────────────────────────────────────

const getComplaintTypes = (isAr: boolean) =>
  isAr
    ? [
        "مشكلة تشخيص الذكاء الاصطناعي",
        "خطأ في الموقع",
        "معلومات نبات خاطئة",
        "مشكلة في الحساب",
        "مشكلة في الأداء",
        "اقتراح / ملاحظة",
        "أخرى",
      ]
    : [
        "AI Diagnosis Issue",
        "Website Bug",
        "Wrong Plant Information",
        "Account Problem",
        "Performance Issue",
        "Suggestion / Feedback",
        "Other",
      ];

const getCategories = (isAr: boolean) =>
  isAr
    ? [
        {
          icon: "🤖",
          title: "مشكلة تشخيص الذكاء الاصطناعي",
          description: "تعرف خاطئ على مرض النبات أو نتائج ذكاء اصطناعي ضعيفة",
          color: "emerald",
        },
        {
          icon: "🐛",
          title: "خطأ في الموقع",
          description: "أخطاء تقنية أو ميزات معطلة أو مشاكل في الواجهة",
          color: "green",
        },
        {
          icon: "🌿",
          title: "معلومات نبات خاطئة",
          description: "بيانات نبات غير دقيقة أو أدلة رعاية أو معلومات أمراض",
          color: "teal",
        },
        {
          icon: "👤",
          title: "مشكلة في الحساب",
          description: "مشاكل تسجيل الدخول أو التسجيل أو الملف الشخصي",
          color: "emerald",
        },
        {
          icon: "⚡",
          title: "مشكلة في الأداء",
          description: "بطء التحميل أو انتهاء المهلة أو أخطاء الخادم",
          color: "green",
        },
        {
          icon: "💡",
          title: "اقتراح / ملاحظة",
          description: "أفكار لتحسين سنبلة ومساعدتنا على النمو",
          color: "teal",
        },
      ]
    : [
        {
          icon: "🤖",
          title: "AI Diagnosis Issue",
          description:
            "Incorrect plant disease identification or poor AI results",
          color: "emerald",
        },
        {
          icon: "🐛",
          title: "Website Bug",
          description: "Technical errors, broken features, or UI glitches",
          color: "green",
        },
        {
          icon: "🌿",
          title: "Wrong Plant Info",
          description: "Inaccurate plant data, care guides, or disease info",
          color: "teal",
        },
        {
          icon: "👤",
          title: "Account Problem",
          description: "Login, registration, or profile-related issues",
          color: "emerald",
        },
        {
          icon: "⚡",
          title: "Performance Issue",
          description: "Slow load times, timeouts, or server errors",
          color: "green",
        },
        {
          icon: "💡",
          title: "Suggestion / Feedback",
          description: "Ideas to improve Sonbula and help us grow",
          color: "teal",
        },
      ];

const getSupportCards = (isAr: boolean) =>
  isAr
    ? [
        {
          icon: "⚡",
          title: "استجابة سريعة",
          description: "نرد عادةً خلال ٢–٤ ساعات عمل",
          detail: "أقل من ٤ ساعات",
          badge: "سريع",
        },
        {
          icon: "🤖",
          title: "دعم الذكاء الاصطناعي ٢٤/٧",
          description: "مساعد الذكاء الاصطناعي جاهز دائماً لمساعدتك",
          detail: "متصل دائماً",
          badge: "مباشر",
        },
        {
          icon: "📚",
          title: "مركز المساعدة",
          description: "تصفح الأدلة والشروحات والوثائق",
          detail: "+٢٠٠ مقال",
          badge: "مجاناً",
        },
        {
          icon: "👥",
          title: "المجتمع",
          description: "احصل على مساعدة من مجتمعنا النشط لعشاق النباتات",
          detail: "+١٠ آلاف عضو",
          badge: "نشط",
        },
      ]
    : [
        {
          icon: "⚡",
          title: "Fast Response",
          description: "We typically respond within 2–4 business hours",
          detail: "< 4 hours avg",
          badge: "Fast",
        },
        {
          icon: "🤖",
          title: "AI Support 24/7",
          description: "Our AI assistant is always ready to help you",
          detail: "Always online",
          badge: "Live",
        },
        {
          icon: "📚",
          title: "Help Center",
          description: "Browse guides, tutorials, and documentation",
          detail: "200+ articles",
          badge: "Free",
        },
        {
          icon: "👥",
          title: "Community",
          description: "Get help from our active plant-loving community",
          detail: "10k+ members",
          badge: "Active",
        },
      ];

const getFaqs = (isAr: boolean) =>
  isAr
    ? [
        {
          q: "كم من الوقت يستغرق الرد؟",
          a: "نهدف للرد على جميع تذاكر الدعم خلال ٢–٤ ساعات عمل. المشاكل الحرجة تُعالج بأولوية وبشكل أسرع.",
        },
        {
          q: "هل يمكنني إرفاق أكثر من صورة؟",
          a: "حالياً يدعم النموذج صورة واحدة لكل طلب. يمكنك تقديم طلبات متعددة إذا أردت إرفاق المزيد من الصور.",
        },
        {
          q: "كيف أُبلغ عن تشخيص ذكاء اصطناعي خاطئ؟",
          a: "اختر 'مشكلة تشخيص الذكاء الاصطناعي' من القائمة، صف النبات والنتيجة الخاطئة، وأرفق صورة اختيارياً.",
        },
        {
          q: "هل معلوماتي الشخصية آمنة؟",
          a: "نعم. جميع البيانات المُقدَّمة مشفرة وتُستخدم فقط لحل طلب الدعم. نلتزم بمعايير صارمة لحماية الخصوصية.",
        },
        {
          q: "هل يمكنني تتبع حالة شكواي؟",
          a: "بعد الإرسال ستصلك رسالة تأكيد بالبريد الإلكتروني تحتوي على رقم التذكرة. يمكنك الإشارة إليه في التواصل اللاحق.",
        },
      ]
    : [
        {
          q: "How long does it take to get a response?",
          a: "We aim to respond to all support tickets within 2–4 business hours. Critical issues are prioritized and handled even faster.",
        },
        {
          q: "Can I attach multiple screenshots?",
          a: "Currently, the form supports one screenshot per submission. You can submit multiple tickets if you need to attach more images.",
        },
        {
          q: "How do I report an AI misdiagnosis?",
          a: "Select 'AI Diagnosis Issue' from the complaint type dropdown, describe the plant and the incorrect result, and optionally attach a screenshot.",
        },
        {
          q: "Is my personal information safe?",
          a: "Yes. All submitted data is encrypted and used only for resolving your support request. We follow strict data privacy standards.",
        },
        {
          q: "Can I track the status of my complaint?",
          a: "After submission, you'll receive a confirmation email with a ticket ID. You can reference it in follow-up communications.",
        },
      ];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const { language } = useSettings();
  const isAr = language === "ar";

  const complaintTypes = getComplaintTypes(isAr);
  const categories = getCategories(isAr);
  const supportCards = getSupportCards(isAr);
  const faqs = getFaqs(isAr);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    type: "",
    subject: "",
    message: "",
    screenshot: null as File | null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({ ...prev, screenshot: file }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const subject = form.subject || form.type;
    const response = await api.submitComplaint(subject, form.message);
    
    setLoading(false);
    if (response.success) {
      setSubmitted(true);
    } else {
      // Show error (optional, ideally using a toast, but keeping it simple)
      console.error(response.message);
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      type: "",
      subject: "",
      message: "",
      screenshot: null,
    });
    setSubmitted(false);
  };

  return (
    <div className="support-root relative" dir={isAr ? "rtl" : "ltr"}>
      {/* Full Page Background Image Layer */}
      <div 
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/image (3).jpg')" }}
      />
      {/* Dark Gradient Overlay with Backdrop Blur */}
      <div 
        className="fixed inset-0 -z-20 backdrop-blur-sm"
        style={{
          background: "linear-gradient(to bottom, rgba(2,6,23,0.75), rgba(2,6,23,0.85))"
        }}
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="support-hero">
        <div className="support-hero-bg" aria-hidden="true" />
        <div className="support-hero-orb" aria-hidden="true" />

        <div className="support-container">
          <div className="support-hero-content">
            <span className="support-badge">
              🌿 {isAr ? "مركز الدعم" : "Support Center"}
            </span>
            <h1 className="support-hero-title">
              {isAr ? "الشكاوى و" : "Complaints & "}{" "}
              <span className="support-gradient-text">
                {isAr ? "الدعم" : "Support"}
              </span>
            </h1>
            <p className="support-hero-sub">
              {isAr
                ? "تواجه مشكلة أو لديك ملاحظة؟ فريقنا والذكاء الاصطناعي هنا لمساعدتك على مدار الساعة. قدّم شكواك وسنتواصل معك بسرعة."
                : "Experiencing an issue or have feedback? Our team and AI are here to help you 24/7. Submit your complaint and we'll get back to you fast."}
            </p>
            <div className="support-hero-stats">
              <div className="sh-stat">
                <span className="sh-stat-value">
                  {isAr ? "أقل من ٤س" : "<4h"}
                </span>
                <span className="sh-stat-label">
                  {isAr ? "متوسط الرد" : "Avg Response"}
                </span>
              </div>
              <div className="sh-stat-div" />
              <div className="sh-stat">
                <span className="sh-stat-value">24/7</span>
                <span className="sh-stat-label">
                  {isAr ? "الذكاء الاصطناعي متاح" : "AI Available"}
                </span>
              </div>
              <div className="sh-stat-div" />
              <div className="sh-stat">
                <span className="sh-stat-value">99%</span>
                <span className="sh-stat-label">
                  {isAr ? "تم الحل" : "Resolved"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support Cards ── */}
      <section className="support-section">
        <div className="support-container">
          <div className="support-cards-grid">
            {supportCards.map((card) => (
              <div key={card.title} className="support-info-card">
                <div className="sic-icon">{card.icon}</div>
                <div className="sic-badge">{card.badge}</div>
                <h3 className="sic-title">{card.title}</h3>
                <p className="sic-desc">{card.description}</p>
                <p className="sic-detail">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <section className="support-section support-main-section">
        <div className="support-container">
          <div className="support-main-grid">
            {/* Form */}
            <div className="support-form-wrapper">
              <div className="support-form-card">
                <div className="sfc-header">
                  <span className="sfc-icon">📝</span>
                  <div>
                    <h2 className="sfc-title">
                      {isAr ? "تقديم شكوى" : "Submit a Complaint"}
                    </h2>
                    <p className="sfc-sub">
                      {isAr
                        ? "املأ التفاصيل أدناه وسنتواصل معك فوراً."
                        : "Fill in the details below and we'll reach out promptly."}
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div className="support-success">
                    <div className="success-icon">✅</div>
                    <h3 className="success-title">
                      {isAr ? "تم إرسال الشكوى!" : "Complaint Submitted!"}
                    </h3>
                    <p className="success-body">
                      {isAr ? (
                        <>
                          شكراً، <strong>{form.fullName || "لك"}</strong>! تم
                          استلام تذكرتك. تحقق من بريدك الإلكتروني للحصول على
                          التأكيد ورقم التذكرة.
                        </>
                      ) : (
                        <>
                          Thanks, <strong>{form.fullName || "there"}</strong>!
                          Your ticket has been received. Check your email for a
                          confirmation and ticket ID.
                        </>
                      )}
                    </p>
                    <button className="success-btn" onClick={resetForm}>
                      {isAr ? "تقديم شكوى أخرى" : "Submit Another"}
                    </button>
                  </div>
                ) : (
                  <form
                    className="support-form"
                    onSubmit={handleSubmit}
                    noValidate>
                    <div className="sf-row">
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="fullName">
                          {isAr ? "الاسم الكامل" : "Full Name"}{" "}
                          <span className="sf-req">*</span>
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          className="sf-input"
                          placeholder={isAr ? "اسمك الكامل" : "Your full name"}
                          value={form.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="email">
                          {isAr ? "البريد الإلكتروني" : "Email Address"}{" "}
                          <span className="sf-req">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="sf-input"
                          placeholder={
                            isAr ? "بريدك@مثال.com" : "you@example.com"
                          }
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="sf-row">
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="type">
                          {isAr ? "نوع الشكوى" : "Complaint Type"}{" "}
                          <span className="sf-req">*</span>
                        </label>
                        <select
                          id="type"
                          name="type"
                          className="sf-select"
                          value={form.type}
                          onChange={handleChange}
                          required>
                          <option value="">
                            {isAr ? "اختر فئة…" : "Select a category…"}
                          </option>
                          {complaintTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="subject">
                          {isAr ? "الموضوع" : "Subject"}{" "}
                          <span className="sf-req">*</span>
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          className="sf-input"
                          placeholder={
                            isAr
                              ? "ملخص مختصر للمشكلة"
                              : "Brief summary of the issue"
                          }
                          value={form.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="sf-field">
                      <label className="sf-label" htmlFor="message">
                        {isAr ? "الرسالة" : "Message"}{" "}
                        <span className="sf-req">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="sf-textarea"
                        placeholder={
                          isAr
                            ? "اشرح مشكلتك بالتفصيل…"
                            : "Describe your issue in detail…"
                        }
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                      <p className="sf-hint">
                        {form.message.length} /{" "}
                        {isAr ? "١٠٠٠ حرف" : "1000 characters"}
                      </p>
                    </div>

                    <div className="sf-field">
                      <label className="sf-label">
                        {isAr ? "لقطة شاشة" : "Screenshot"}{" "}
                        <span className="sf-optional">
                          ({isAr ? "اختياري" : "optional"})
                        </span>
                      </label>
                      <div
                        className={`sf-dropzone ${dragOver ? "drag-over" : ""} ${form.screenshot ? "has-file" : ""}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        aria-label={
                          isAr ? "رفع لقطة شاشة" : "Upload screenshot"
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && fileRef.current?.click()
                        }>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="sf-file-hidden"
                          onChange={(e) =>
                            handleFile(e.target.files?.[0] ?? null)
                          }
                        />
                        {form.screenshot ? (
                          <>
                            <span className="dz-icon">🖼️</span>
                            <span className="dz-filename">
                              {form.screenshot.name}
                            </span>
                            <button
                              type="button"
                              className="dz-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                setForm((p) => ({ ...p, screenshot: null }));
                                if (fileRef.current) fileRef.current.value = "";
                              }}>
                              {isAr ? "إزالة" : "Remove"}
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="dz-icon">📎</span>
                            <p className="dz-primary">
                              {isAr ? (
                                <>
                                  اسحب لقطة الشاشة هنا أو{" "}
                                  <span className="dz-link">تصفح</span>
                                </>
                              ) : (
                                <>
                                  Drop screenshot here or{" "}
                                  <span className="dz-link">browse</span>
                                </>
                              )}
                            </p>
                            <p className="dz-secondary">
                              {isAr
                                ? "PNG، JPG، WebP · حد أقصى ٥ ميجابايت"
                                : "PNG, JPG, WebP · Max 5 MB"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="sf-submit"
                      disabled={loading}
                      id="submit-complaint-btn">
                      {loading ? (
                        <span className="sf-loading">
                          <span className="sf-spinner" />
                          {isAr ? "جارٍ الإرسال…" : "Sending…"}
                        </span>
                      ) : (
                        <span className="sf-submit-inner">
                          {isAr ? "إرسال الشكوى" : "Send Complaint"}
                          <svg
                            className="sf-arrow"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={
                                isAr
                                  ? "M11 17l-5-5m0 0l5-5m-5 5h12"
                                  : "M13 7l5 5m0 0l-5 5m5-5H6"
                              }
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="support-sidebar">
              <div className="support-categories-card">
                <h2 className="sc-title">
                  {isAr ? "فئات الشكاوى" : "Complaint Categories"}
                </h2>
                <p className="sc-sub">
                  {isAr
                    ? "اختر المجال الذي يصف مشكلتك بشكل أفضل."
                    : "Select the area that best describes your issue."}
                </p>
                <div className="sc-list">
                  {categories.map((cat) => (
                    <button
                      key={cat.title}
                      type="button"
                      className="sc-item"
                      onClick={() =>
                        setForm((p) => ({ ...p, type: cat.title }))
                      }>
                      <span className="sc-icon">{cat.icon}</span>
                      <div className="sc-text">
                        <span className="sc-name">{cat.title}</span>
                        <span className="sc-desc">{cat.description}</span>
                      </div>
                      <svg
                        className="sc-arrow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={isAr ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="support-quick-card">
                <span className="sqc-icon">💬</span>
                <h3 className="sqc-title">
                  {isAr ? "تحتاج مساعدة فورية؟" : "Need Instant Help?"}
                </h3>
                <p className="sqc-body">
                  {isAr
                    ? "مساعد الذكاء الاصطناعي يمكنه الإجابة على كثير من الأسئلة الآن – بدون انتظار."
                    : "Our AI Assistant can answer many questions right now — no waiting required."}
                </p>
                <Link href="/assistant" className="sqc-btn">
                  {isAr
                    ? "تحدث مع مساعد الذكاء الاصطناعي ←"
                    : "Chat with AI Assistant →"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="support-section support-faq-section">
        <div className="support-container">
          <div className="support-faq-header">
            <h2 className="support-section-title">
              {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <p className="support-section-sub">
              {isAr
                ? "إجابات سريعة قبل تقديم تذكرة"
                : "Quick answers before you submit a ticket"}
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  id={`faq-btn-${i}`}>
                  <span>{faq.q}</span>
                  <svg
                    className="faq-chevron"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="faq-answer" aria-labelledby={`faq-btn-${i}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-footer-cta">
            <p>{isAr ? "لا تزال لديك أسئلة؟" : "Still have questions?"}</p>
            <Link href="/faq" className="faq-full-link">
              {isAr ? "زيارة الأسئلة الشائعة الكاملة ←" : "Visit Full FAQ →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="support-footer">
        <div className="support-container">
          <div className="sf-footer-inner">
            <div className="sf-footer-logo">
              <span>🌱</span>
              <span>{isAr ? "سنبلة" : "Sonbula"}</span>
            </div>
            <div className="sf-footer-links">
              <Link href="/about" className="sf-footer-link">
                {isAr ? "عنا" : "About"}
              </Link>
              <Link href="/faq" className="sf-footer-link">
                {isAr ? "الأسئلة" : "FAQ"}
              </Link>
              <Link
                href="/support"
                className="sf-footer-link sf-footer-link--active">
                {isAr ? "الدعم" : "Support"}
              </Link>
              <Link href="/settings" className="sf-footer-link">
                {isAr ? "الإعدادات" : "Settings"}
              </Link>
            </div>
            <p className="sf-footer-copy">
              {isAr
                ? `© 2026 سنبلة. اكتشاف أمراض النبات بالذكاء الاصطناعي.`
                : `© 2026 Sonbula. Plant disease detection powered by AI.`}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
