import { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول / إنشاء حساب | سنبلة",
  description: "سجل دخولك أو أنشئ حساباً للوصول إلى نظام الذكاء الاصطناعي لاكتشاف أمراض النباتات",
};

export default function AuthPage() {
  return <AuthForm />;
}