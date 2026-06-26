"use client";

import React from "react";
import { Menu, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  adminName?: string;
}

export default function Header({ onMobileMenuToggle, adminName }: HeaderProps) {
  const { t, language, setLanguage } = useSettings();

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-gray-200 shrink-0">
      {/* Left: Mobile menu button + branding */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-600"
          onClick={onMobileMenuToggle}
        >
          <Menu className="size-5" />
        </Button>

        {/* Mobile-only logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 text-white">
            <Sprout className="size-4" />
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {t("dashboard.sidebar.title")}
          </span>
        </div>
      </div>

      {/* Right: Language toggle + Admin badge */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="text-xs font-medium"
        >
          {language === "ar" ? "EN" : "عربي"}
        </Button>

        {adminName && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-green-700">
                {adminName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {adminName}
              </p>
              <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                {t("dashboard.header.admin")}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
