"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { api, type User } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export default function Navbar() {
  const { t, language } = useSettings();
  const isAr = language === "ar";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const syncAuth = () => {
    const token = api.getToken();
    const userInfo = api.getUser();
    if (token && userInfo) {
      setIsAuthenticated(true);
      setUser(userInfo);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    api.clearToken();
    setIsAuthenticated(false);
    setUser(null);
    setShowDropdown(false);
    window.location.href = "/";
  };

  const linkClass =
    "text-slate-300 hover:text-emerald-400 font-medium transition-colors text-sm relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full";

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/assistant", label: t("nav.assistant") },
    { href: "/diseases", label: t("nav.diseases") },
    { href: "/community", label: t("nav.community") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/support", label: t("nav.support") },
  ];

  const moreLinks = [
    { href: "/diseases", label: t("nav.diseasesDb") },
    { href: "/community", label: t("nav.communityFull") },
    { href: "/faq", label: t("nav.faqFull") },
    { href: "/support", label: t("nav.supportFull") },
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 shadow-[0_1px_0_rgba(34,197,94,0.08)]"
      dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
              🌱
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Sonbula
            </span>
          </Link>

          {/* Desktop Full Nav */}
          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Tablet Nav */}
          <div className="hidden md:flex xl:hidden items-center gap-5">
            <Link href="/" className={linkClass}>
              {t("nav.home")}
            </Link>
            <Link href="/assistant" className={linkClass}>
              {t("nav.assistant")}
            </Link>

            <div ref={moreMenuRef} className="relative">
              <button
                onClick={() => setShowMoreMenu((prev) => !prev)}
                className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-medium text-sm transition-colors"
                aria-expanded={showMoreMenu}
                aria-haspopup="true">
                {t("nav.more")}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showMoreMenu ? "rotate-180" : ""}`}
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

              {showMoreMenu && (
                <div className="absolute mt-3 w-56 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/60 shadow-2xl overflow-hidden z-20 start-0">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors"
                      onClick={() => setShowMoreMenu(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Auth + Mobile Trigger */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                href="/auth"
                className="hidden md:inline-flex px-5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-emerald-500/20 hover:scale-105">
                {t("nav.login")}
              </Link>
            ) : (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white text-sm font-bold shadow-md hover:shadow-emerald-500/30 hover:scale-105 transition-all"
                  title={user?.username}
                  aria-expanded={showDropdown}
                  aria-haspopup="true">
                  {user?.username?.charAt(0).toUpperCase() ?? "U"}
                </button>

                {showDropdown && (
                  <div className="absolute mt-2 w-52 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/60 shadow-2xl overflow-hidden z-20 end-0">
                    <div className="px-4 py-3 border-b border-slate-700/60 bg-slate-800/40">
                      <p className="text-sm font-semibold text-slate-100 truncate">
                        {user?.username}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors"
                      onClick={() => setShowDropdown(false)}>
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {t("nav.myProfile")}
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors"
                      onClick={() => setShowDropdown(false)}>
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {t("nav.settings")}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-start px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors border-t border-slate-700/60">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              aria-label="Toggle mobile menu"
              aria-expanded={showMobileMenu}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-slate-800/60 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}>
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user?.username?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="block px-3 py-2.5 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}>
                  {t("nav.myProfile")}
                </Link>
                <Link
                  href="/settings"
                  className="block px-3 py-2.5 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}>
                  {t("nav.settings")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-start px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/5 rounded-lg transition-colors font-medium">
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800/60">
                <Link
                  href="/auth"
                  className="block px-3 py-2.5 text-sm text-center bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg"
                  onClick={() => setShowMobileMenu(false)}>
                  {t("nav.loginSignup")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
