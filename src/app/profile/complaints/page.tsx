"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

export default function MyComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = api.getToken();
      if (!token) {
        router.push("/auth");
        return;
      }
      
      const response = await api.getUserComplaints();
      if (response.success && response.data) {
        setComplaints(response.data);
      }
      setLoading(false);
    };

    fetchComplaints();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'resolved':
        return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400", label: "Resolved" };
      case 'reviewed':
        return { icon: <AlertCircle className="w-4 h-4 text-blue-400" />, color: "border-blue-500/30 bg-blue-500/10 text-blue-400", label: "Reviewed" };
      default:
        return { icon: <Clock className="w-4 h-4 text-amber-400" />, color: "border-amber-500/30 bg-amber-500/10 text-amber-400", label: "Pending" };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" /> My Complaints
          </h1>
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-300">No Complaints Found</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">You haven't submitted any complaints yet.</p>
            <Link href="/support" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all">
              Submit a Complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => {
              const statusConfig = getStatusConfig(complaint.status);
              
              return (
                <div key={complaint._id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">{complaint.subject}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </div>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-xl p-4 mb-4 text-sm text-slate-300 whitespace-pre-wrap">
                    {complaint.description}
                  </div>

                  {complaint.answer && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mt-4">
                      <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5" /> Support Response
                      </h4>
                      <p className="text-sm text-emerald-100/80 whitespace-pre-wrap">
                        {complaint.answer}
                      </p>
                      {complaint.answeredAt && (
                        <p className="text-[10px] text-emerald-500/60 mt-2">
                          Answered on {new Date(complaint.answeredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
