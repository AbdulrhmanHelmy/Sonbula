"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { dashboardApi, AdminUser } from "@/lib/dashboard-api";
import { useSettings } from "@/context/SettingsContext";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

// Mobile sidebar content — reuses the same nav items as the desktop sidebar
import MobileSidebarContent from "@/components/dashboard/mobile-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useSettings();

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/dashboard/login";

  // ── Force light mode for the dashboard ──────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    const prevTheme = root.getAttribute("data-theme");
    const hadDark = root.classList.contains("dark");

    // Apply light mode immediately
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");

    // Watch for SettingsContext re-adding .dark class and immediately revert
    const observer = new MutationObserver(() => {
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
      }
      if (root.getAttribute("data-theme") !== "light") {
        root.setAttribute("data-theme", "light");
      }
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      observer.disconnect();
      // Restore previous theme on unmount
      if (hadDark) {
        root.classList.add("dark");
        root.removeAttribute("data-theme");
      } else if (prevTheme) {
        root.setAttribute("data-theme", prevTheme);
      }
    };
  }, []);

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/dashboard/login");
          return;
        }

        // Check stored admin user first
        const storedUser = localStorage.getItem("adminUser");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser) as AdminUser;
            // Verify the token is still valid by probing an admin endpoint
            await dashboardApi.getAll("users");
            setAdminUser(parsed);
          } catch {
            // Token expired or no longer admin
            localStorage.removeItem("token");
            localStorage.removeItem("adminUser");
            router.push("/dashboard/login");
          }
        } else {
          // No stored admin user — not authenticated via dashboard login
          localStorage.removeItem("token");
          router.push("/dashboard/login");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("adminUser");
        router.push("/dashboard/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [isLoginPage, router]);

  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobileSidebar = useCallback(() => setMobileOpen((o) => !o), []);

  // ── Login page: render standalone without dashboard shell ───────────────
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  // ── Dashboard shell ────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side={language === "ar" ? "right" : "left"}
          className="w-72 p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileSidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onMobileMenuToggle={toggleMobileSidebar}
          adminName={adminUser?.username}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
