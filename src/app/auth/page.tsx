import { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Login / Sign Up | Sonbula",
  description: "Login or sign up to access the plant disease detection AI",
};

export default function AuthPage() {
  return <AuthForm />;
}
