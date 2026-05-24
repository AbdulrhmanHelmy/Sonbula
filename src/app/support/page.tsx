"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "./support.css";

const complaintTypes = [
  "AI Diagnosis Issue",
  "Website Bug",
  "Wrong Plant Information",
  "Account Problem",
  "Performance Issue",
  "Suggestion / Feedback",
  "Other",
];

const categories = [
  {
    icon: "🤖",
    title: "AI Diagnosis Issue",
    description: "Incorrect plant disease identification or poor AI results",
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

const supportCards = [
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

const faqs = [
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

export default function SupportPage() {
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
    >
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
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setSubmitted(true);
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
    <div className="support-root">
      <Navbar />

      <section className="support-hero">
        <div className="support-hero-bg" aria-hidden="true" />
        <div className="support-hero-orb" aria-hidden="true" />

        <div className="support-container">
          <div className="support-hero-content">
            <span className="support-badge">🌿 Support Center</span>
            <h1 className="support-hero-title">
              Complaints &amp;{" "}
              <span className="support-gradient-text">Support</span>
            </h1>
            <p className="support-hero-sub">
              Experiencing an issue or have feedback? Our team and AI are here
              to help you 24 / 7. Submit your complaint and we&apos;ll get back
              to you fast.
            </p>
            <div className="support-hero-stats">
              <div className="sh-stat">
                <span className="sh-stat-value">&lt;4h</span>
                <span className="sh-stat-label">Avg Response</span>
              </div>
              <div className="sh-stat-div" />
              <div className="sh-stat">
                <span className="sh-stat-value">24/7</span>
                <span className="sh-stat-label">AI Available</span>
              </div>
              <div className="sh-stat-div" />
              <div className="sh-stat">
                <span className="sh-stat-value">99%</span>
                <span className="sh-stat-label">Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="support-section support-main-section">
        <div className="support-container">
          <div className="support-main-grid">

            <div className="support-form-wrapper">
              <div className="support-form-card">
                <div className="sfc-header">
                  <span className="sfc-icon">📝</span>
                  <div>
                    <h2 className="sfc-title">Submit a Complaint</h2>
                    <p className="sfc-sub">Fill in the details below and we&apos;ll reach out promptly.</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="support-success">
                    <div className="success-icon">✅</div>
                    <h3 className="success-title">Complaint Submitted!</h3>
                    <p className="success-body">
                      Thanks, <strong>{form.fullName || "there"}</strong>! Your
                      ticket has been received. Check your email for a
                      confirmation and ticket ID.
                    </p>
                    <button className="success-btn" onClick={resetForm}>
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form className="support-form" onSubmit={handleSubmit} noValidate>
                    <div className="sf-row">
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="fullName">
                          Full Name <span className="sf-req">*</span>
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          className="sf-input"
                          placeholder="Your full name"
                          value={form.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="email">
                          Email Address <span className="sf-req">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="sf-input"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="sf-row">
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="type">
                          Complaint Type <span className="sf-req">*</span>
                        </label>
                        <select
                          id="type"
                          name="type"
                          className="sf-select"
                          value={form.type}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a category…</option>
                          {complaintTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sf-field">
                        <label className="sf-label" htmlFor="subject">
                          Subject <span className="sf-req">*</span>
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          className="sf-input"
                          placeholder="Brief summary of the issue"
                          value={form.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="sf-field">
                      <label className="sf-label" htmlFor="message">
                        Message <span className="sf-req">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="sf-textarea"
                        placeholder="Describe your issue in detail…"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                      <p className="sf-hint">
                        {form.message.length} / 1000 characters
                      </p>
                    </div>

                    <div className="sf-field">
                      <label className="sf-label">
                        Screenshot{" "}
                        <span className="sf-optional">(optional)</span>
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
                        aria-label="Upload screenshot"
                        onKeyDown={(e) =>
                          e.key === "Enter" && fileRef.current?.click()
                        }
                      >
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
                                if (fileRef.current)
                                  fileRef.current.value = "";
                              }}
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="dz-icon">📎</span>
                            <p className="dz-primary">
                              Drop screenshot here or{" "}
                              <span className="dz-link">browse</span>
                            </p>
                            <p className="dz-secondary">
                              PNG, JPG, WebP · Max 5 MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="sf-submit"
                      disabled={loading}
                      id="submit-complaint-btn"
                    >
                      {loading ? (
                        <span className="sf-loading">
                          <span className="sf-spinner" />
                          Sending…
                        </span>
                      ) : (
                        <span className="sf-submit-inner">
                          Send Complaint
                          <svg
                            className="sf-arrow"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="support-sidebar">

              <div className="support-categories-card">
                <h2 className="sc-title">Complaint Categories</h2>
                <p className="sc-sub">Select the area that best describes your issue.</p>
                <div className="sc-list">
                  {categories.map((cat) => (
                    <button
                      key={cat.title}
                      type="button"
                      className="sc-item"
                      onClick={() =>
                        setForm((p) => ({ ...p, type: cat.title }))
                      }
                    >
                      <span className="sc-icon">{cat.icon}</span>
                      <div className="sc-text">
                        <span className="sc-name">{cat.title}</span>
                        <span className="sc-desc">{cat.description}</span>
                      </div>
                      <svg
                        className="sc-arrow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="support-quick-card">
                <span className="sqc-icon">💬</span>
                <h3 className="sqc-title">Need Instant Help?</h3>
                <p className="sqc-body">
                  Our AI Assistant can answer many questions right now — no
                  waiting required.
                </p>
                <Link href="/assistant" className="sqc-btn">
                  Chat with AI Assistant →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="support-section support-faq-section">
        <div className="support-container">
          <div className="support-faq-header">
            <h2 className="support-section-title">Frequently Asked Questions</h2>
            <p className="support-section-sub">
              Quick answers before you submit a ticket
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  id={`faq-btn-${i}`}
                >
                  <span>{faq.q}</span>
                  <svg
                    className="faq-chevron"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
            <p>Still have questions?</p>
            <Link href="/faq" className="faq-full-link">
              Visit Full FAQ →
            </Link>
          </div>
        </div>
      </section>

      <footer className="support-footer">
        <div className="support-container">
          <div className="sf-footer-inner">
            <div className="sf-footer-logo">
              <span>🌱</span>
              <span>Sonbula</span>
            </div>
            <div className="sf-footer-links">
              <Link href="/about" className="sf-footer-link">About</Link>
              <Link href="/faq" className="sf-footer-link">FAQ</Link>
              <Link href="/support" className="sf-footer-link sf-footer-link--active">Support</Link>
              <Link href="/settings" className="sf-footer-link">Settings</Link>
            </div>
            <p className="sf-footer-copy">
              © 2026 Sonbula. Plant disease detection powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
