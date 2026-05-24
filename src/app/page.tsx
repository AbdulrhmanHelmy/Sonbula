import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./home-page.css";

export const metadata: Metadata = {
  title: "Sonbula | Plant Disease Detection AI",
  description: "Upload plant images and let AI detect diseases instantly. Professional agriculture platform powered by artificial intelligence.",
};

export default function Home() {
  return (
    <div className="home-root min-h-screen">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                AI Plant Disease{" "}
              </span>
              <span className="block text-gray-900">Detection</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload plant images and let AI detect diseases instantly. Get accurate diagnosis and actionable insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <span>Analyze Plant</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/plants"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-xl shadow-md transition-all hover:scale-105 border border-emerald-200"
            >
              <span>Plants Dictionary 🌿</span>
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-xl transition-all"
            >
              AI Assistant 🤖
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-green-200">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-green-600">99%</p>
              <p className="text-sm sm:text-base text-gray-600">Detection Accuracy</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-green-600">&lt;2s</p>
              <p className="text-sm sm:text-base text-gray-600">Analysis Time</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-green-600">500+</p>
              <p className="text-sm sm:text-base text-gray-600">Plant Diseases</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Sanbula?
          </h2>
          <p className="text-xl text-gray-600">
            Advanced AI technology for modern agriculture
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:translate-y-[-4px]">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Upload Plant Images
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Easily upload photos of your plants. Supports multiple formats including JPG, PNG, and WebP for maximum compatibility.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                  Quick upload
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                  Drag &amp; drop support
                </li>
              </ul>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:translate-y-[-4px]">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              AI Disease Diagnosis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our advanced AI analyzes plant images and identifies diseases with high accuracy. Get detailed information about detected issues.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                  ML-powered detection
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                  Confidence scores
                </li>
              </ul>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:translate-y-[-4px]">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Fast &amp; Accurate Results
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant results with detailed treatment recommendations. Our system provides actionable insights to save your crops.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                  Real-time processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                  Treatment guides
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Protect Your Plants?
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Start analyzing plant diseases with our AI-powered platform today. Get instant diagnosis and treatment recommendations.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 shadow-lg transition-all transform hover:scale-105 group"
          >
            <span>Get Started Now</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">🌱</span>
              <span className="font-bold text-white text-lg">Sonbula</span>
            </div>

            <div className="flex items-center gap-6 justify-center flex-wrap">
              <Link
                href="/about"
                className="text-gray-400 hover:text-green-500 font-medium transition-colors text-sm"
              >
                About
              </Link>
              <Link
                href="/support"
                className="text-gray-400 hover:text-green-500 font-medium transition-colors text-sm"
              >
                Support
              </Link>
              <Link
                href="/settings"
                className="text-gray-400 hover:text-green-500 font-medium transition-colors text-sm"
              >
                Settings
              </Link>
            </div>

            <p className="text-sm flex-shrink-0 text-center sm:text-right">
              &copy; 2026 Sonbula. Plant disease detection powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
