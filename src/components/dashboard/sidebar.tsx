"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  MessagesSquare,
  Mail,
  Microscope,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  key: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { key: "dashboard.sidebar.overview", href: "/dashboard", icon: LayoutDashboard },
  { key: "dashboard.sidebar.users", href: "/dashboard/users", icon: Users },
  { key: "dashboard.sidebar.posts", href: "/dashboard/posts", icon: FileText },
  { key: "dashboard.sidebar.comments", href: "/dashboard/comments", icon: MessageSquare },
  { key: "dashboard.sidebar.complaints", href: "/dashboard/complaints", icon: AlertTriangle },
  { key: "dashboard.sidebar.conversations", href: "/dashboard/conversations", icon: MessagesSquare },
  { key: "dashboard.sidebar.messages", href: "/dashboard/messages", icon: Mail },
  { key: "dashboard.sidebar.diseaseScans", href: "/dashboard/disease-scans", icon: Microscope },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useSettings();
  const isRTL = language === "ar";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    router.push("/dashboard/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-white border-e border-gray-200 transition-all duration-300 h-full",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-100">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-600 text-white shrink-0">
          <Sprout className="size-5" />
        </div>
        {!collapsed && (
          <span className="text-base font-semibold text-gray-900 truncate">
            {t("dashboard.sidebar.title")}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? t(item.key) : undefined}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              {!collapsed && <span className="truncate">{t(item.key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Logout + Collapse */}
      <div className="border-t border-gray-100 p-2 space-y-1">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? t("dashboard.sidebar.logout") : undefined}
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>{t("dashboard.sidebar.logout")}</span>}
        </button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-gray-400 hover:text-gray-600"
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />
          ) : (
            isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
