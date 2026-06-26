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
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

interface MobileSidebarProps {
  onNavigate: () => void;
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

export default function MobileSidebarContent({ onNavigate }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useSettings();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    onNavigate();
    router.push("/dashboard/login");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-100">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-600 text-white shrink-0">
          <Sprout className="size-5" />
        </div>
        <span className="text-base font-semibold text-gray-900 truncate">
          {t("dashboard.sidebar.title")}
        </span>
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
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  active ? "text-emerald-600" : "text-gray-400"
                )}
              />
              <span className="truncate">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: Logout */}
      <div className="border-t border-gray-100 p-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="size-5 shrink-0" />
          <span>{t("dashboard.sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );
}
