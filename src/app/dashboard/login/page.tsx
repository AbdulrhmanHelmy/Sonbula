"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { dashboardApi } from "@/lib/dashboard-api";

export default function LoginPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useSettings();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await dashboardApi.signin(email, password);

      if (!res.success || !res.data) {
        setError(t("dashboard.login.error"));
        return;
      }

      // Store token temporarily to test admin access
      localStorage.setItem("token", res.data.token);

      // Verify admin privileges by calling an admin-only endpoint
      // The backend admin middleware checks role === 'ADMIN'
      // If this succeeds, the user is confirmed admin
      try {
        await dashboardApi.getAll("users");

        // Confirmed admin — store user info
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            role: "ADMIN",
          })
        );
        // Also store for the main app compatibility
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
          })
        );

        router.push("/dashboard");
      } catch {
        // Admin API returned 403 — not an admin
        localStorage.removeItem("token");
        setError(t("dashboard.login.notAdmin"));
      }
    } catch {
      setError(t("dashboard.login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 overflow-hidden">
          {/* Green gradient accent */}
          <div className="h-2 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600" />

          <div className="p-8">
            {/* Logo & Branding */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600 text-white mb-4 shadow-md">
                <Sprout className="size-7" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("dashboard.login.title")}
              </h1>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {t("dashboard.login.subtitle")}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="size-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  {t("dashboard.login.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-10 rounded-lg bg-gray-50 border-gray-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                  placeholder={
                    language === "ar"
                      ? "admin@sonbula.com"
                      : "admin@sonbula.com"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  {t("dashboard.login.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 rounded-lg bg-gray-50 border-gray-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500/50 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="ms-2">
                      {t("dashboard.login.loading")}
                    </span>
                  </>
                ) : (
                  t("dashboard.login.submit")
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Language toggle */}
        <div className="flex justify-center mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="text-gray-400 hover:text-gray-600"
          >
            {language === "ar" ? "English" : "عربي"}
          </Button>
        </div>
      </div>
    </div>
  );
}
