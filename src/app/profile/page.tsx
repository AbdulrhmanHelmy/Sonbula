"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api, type User } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    const userInfo = api.getUser();

    if (!token || !userInfo) {
      router.push("/auth");
      return;
    }

    setUser(userInfo);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    api.clearToken();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-8"></div>

          {/* User Information */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                {user?.username || "N/A"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                {user?.email || "N/A"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-mono break-all">
                {user?._id || "N/A"}
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-green-800 font-semibold mb-2">✨ More Features Coming Soon</p>
            <p className="text-green-700 text-sm">
              Profile features like account settings, password change, and preferences coming soon...
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-8"></div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all"
            >
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
